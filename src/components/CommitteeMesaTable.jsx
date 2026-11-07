import React, { useMemo, useState } from 'react';
import { CheckCircle, Copy, FileSpreadsheet, Search, User } from 'lucide-react';

const KIND_LABEL = {
  charla: 'Charla',
  workshop: 'Taller',
  qa: 'Preguntas y respuestas',
  plenaria: 'Plenaria',
  acto: 'Acto',
  registro: 'Registro',
  almuerzo: 'Almuerzo'
};

const NO_MESA_KINDS = ['registro', 'acto', 'almuerzo', 'plenaria'];

const MESA_STATE = {
  assigned: { text: 'Asignada', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  support: { text: 'Apoyo', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  missing: { text: 'Sin asignar', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  na: { text: 'No aplica', className: 'bg-slate-50 text-slate-500 border-slate-200' }
};

const KIND_STYLE = {
  charla: 'bg-slate-100 text-slate-700',
  workshop: 'bg-indigo-50 text-indigo-700',
  qa: 'bg-sky-50 text-sky-700',
  plenaria: 'bg-unior-wine/10 text-unior-wine',
  acto: 'bg-amber-50 text-amber-800',
  registro: 'bg-slate-100 text-slate-600',
  almuerzo: 'bg-emerald-50 text-emerald-700'
};

export function getMesaState(session) {
  if (session.mesa?.pres || session.mesa?.sec) return 'assigned';
  if (session.mesa?.apoyo) return 'support';
  if (NO_MESA_KINDS.includes(session.kind)) return 'na';
  return 'missing';
}

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function kindLabel(session) {
  return KIND_LABEL[session.kind] || session.kind || 'Actividad';
}

function activityText(session) {
  const kind = kindLabel(session);
  const title = session.title && normalize(session.title) !== normalize(kind) ? session.title : '';
  const topic = session.topic || '';

  if (title && topic && normalize(title) !== normalize(topic)) {
    return { primary: title, secondary: topic };
  }
  if (title) return { primary: title, secondary: '' };
  if (topic) return { primary: topic, secondary: '' };
  return { primary: '—', secondary: '' };
}

function ActivityText({ session }) {
  const { primary, secondary } = activityText(session);
  return (
    <div className="leading-snug">
      <div className="text-xs font-semibold text-slate-900">{primary}</div>
      {secondary && <div className="text-[11px] text-slate-500 mt-0.5">{secondary}</div>}
    </div>
  );
}

function speakersText(session) {
  if (session.kind === 'qa') return session.who || 'Ronda de preguntas';
  const names = (session.speakers || []).map((s) => s.n).filter(Boolean);
  if (names.length) return names.join(' / ');
  if (['registro', 'acto', 'almuerzo'].includes(session.kind)) return '—';
  return 'Por confirmar';
}

function roomName(session) {
  if (session.sala) return `Sala ${session.sala}`;
  return session.room || 'Actividad general';
}

function roomDetail(session, salas) {
  if (session.sala) return salas[session.sala] || '';
  return '';
}

function modality(session) {
  if (session.virtual) {
    return { text: session.mod || 'Virtual', className: 'bg-rose-50 text-rose-700 border-rose-200' };
  }
  if (session.mod) {
    return { text: session.mod, className: 'bg-slate-50 text-slate-600 border-slate-200' };
  }
  return { text: 'Presencial', className: 'bg-slate-50 text-slate-600 border-slate-200' };
}

function careerNames(session, careers) {
  return (session.careers || [])
    .map((code) => careers[code])
    .filter(Boolean);
}

function sortSessions(items) {
  return [...items].sort((a, b) => {
    if (a.start !== b.start) return a.start.localeCompare(b.start);
    const salaA = a.sala ?? 99;
    const salaB = b.sala ?? 99;
    if (salaA !== salaB) return salaA - salaB;
    return a.id - b.id;
  });
}

function MesaCell({ session }) {
  const state = getMesaState(session);
  const meta = MESA_STATE[state];
  const { pres, sec, apoyo } = session.mesa || {};

  return (
    <div className="space-y-1">
      {pres && (
        <div className="text-[11px] leading-snug">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Pres. </span>
          <span className="text-slate-800">{pres}</span>
        </div>
      )}
      {sec && (
        <div className="text-[11px] leading-snug">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Sec. </span>
          <span className="text-slate-800">{sec}</span>
        </div>
      )}
      {apoyo && (
        <div className="text-[11px] leading-snug text-sky-800">
          <span className="text-[9px] font-bold uppercase tracking-wider text-sky-500">Apoyo </span>
          {apoyo}
        </div>
      )}
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[9px] font-bold ${meta.className}`}>
        {meta.text}
      </span>
    </div>
  );
}

export default function CommitteeMesaTable({ sessions, days, salas, careers, selectedDay }) {
  const [query, setQuery] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  const visibleDays = useMemo(
    () => days.filter((d) => selectedDay === 'all' || d.id === selectedDay),
    [days, selectedDay]
  );

  const scopedSessions = useMemo(
    () => sessions.filter((s) => selectedDay === 'all' || s.day === selectedDay),
    [sessions, selectedDay]
  );

  const missingCount = useMemo(
    () => scopedSessions.filter((s) => getMesaState(s) === 'missing').length,
    [scopedSessions]
  );

  const searchTerm = normalize(query);
  const filteredSessions = useMemo(() => {
    return scopedSessions.filter((s) => {
      if (onlyMissing && getMesaState(s) !== 'missing') return false;
      if (!searchTerm) return true;

      const haystack = [
        s.topic,
        s.title,
        s.who,
        s.kind,
        s.room,
        s.mesa?.pres,
        s.mesa?.sec,
        s.mesa?.apoyo,
        ...(s.speakers || []).map((sp) => sp.n),
        ...(s.careers || []).map((c) => careers[c]?.name),
        s.sala ? `sala ${s.sala}` : ''
      ]
        .map(normalize)
        .join(' ');

      return haystack.includes(searchTerm);
    });
  }, [scopedSessions, onlyMissing, searchTerm, careers]);

  const groups = useMemo(() => {
    return visibleDays
      .map((day) => {
        const all = scopedSessions.filter((s) => s.day === day.id);
        const rows = sortSessions(filteredSessions.filter((s) => s.day === day.id));
        return {
          day,
          rows,
          total: all.length,
          withMesa: all.filter((s) => getMesaState(s) === 'assigned' || getMesaState(s) === 'support').length,
          missing: all.filter((s) => getMesaState(s) === 'missing').length,
          na: all.filter((s) => getMesaState(s) === 'na').length
        };
      })
      .filter((group) => group.rows.length > 0);
  }, [visibleDays, scopedSessions, filteredSessions]);

  const exportRows = useMemo(
    () =>
      groups.flatMap((group) =>
        group.rows.map((session) => ({
          day: group.day.short,
          session
        }))
      ),
    [groups]
  );

  const handleCopy = async () => {
    const text = groups
      .map((group) => {
        const lines = group.rows.map((session) => {
          const mesa = session.mesa || {};
          const mesaLine = [
            mesa.pres ? `Pres. ${mesa.pres}` : '',
            mesa.sec ? `Sec. ${mesa.sec}` : '',
            mesa.apoyo ? `Apoyo ${mesa.apoyo}` : ''
          ]
            .filter(Boolean)
            .join(' · ');
          const state = MESA_STATE[getMesaState(session)].text;
          const activity = activityText(session);
          return [
            `${session.start} - ${session.end} | ${roomName(session)} | ${kindLabel(session)}`,
            `  ${activity.primary}`,
            ...(activity.secondary ? [`  ${activity.secondary}`] : []),
            `  Expositores: ${speakersText(session)}`,
            `  Mesa: ${mesaLine || state}${mesaLine ? ` (${state})` : ''}`
          ].join('\n');
        });
        return `=== ${group.day.label.toUpperCase()} ===\n${lines.join('\n\n')}`;
      })
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Clipboard unavailable; keep the UI silent.
    }
  };

  const handleExportCSV = () => {
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = [
      'Día',
      'Inicio',
      'Fin',
      'Sala',
      'Tipo',
      'Actividad',
      'Expositores',
      'Tema',
      'Carreras',
      'Modalidad',
      'Presidente',
      'Secretario',
      'Apoyo',
      'Estado mesa'
    ];

    const rows = exportRows.map(({ day, session }) => {
      const mesa = session.mesa || {};
      const sala = session.sala
        ? `Sala ${session.sala} - ${salas[session.sala] || ''}`.trim()
        : session.room || 'General';
      return [
        day,
        session.start,
        session.end,
        sala,
        kindLabel(session),
        session.title || '',
        speakersText(session),
        session.topic || '',
        careerNames(session, careers).map((c) => c.name).join(' + '),
        modality(session).text,
        mesa.pres || '',
        mesa.sec || '',
        mesa.apoyo || '',
        MESA_STATE[getMesaState(session)].text
      ]
        .map(q)
        .join(',');
    });

    const csvContent = '\ufeff' + [headers.map(q).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `programa_mesas_${selectedDay}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Programa con mesas copiado al portapapeles</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar expositor, tema o miembro de mesa..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-unior-wine/20 focus:border-unior-wine/40"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 select-none">
          <input
            type="checkbox"
            checked={onlyMissing}
            onChange={(event) => setOnlyMissing(event.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-unior-wine focus:ring-unior-wine/30"
          />
          Solo sin mesa
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800">
            {missingCount}
          </span>
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!exportRows.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar mesas</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!exportRows.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>CSV mesas</span>
          </button>
        </div>
      </div>

      {!groups.length && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          No hay sesiones que coincidan con el filtro actual.
        </div>
      )}

      {groups.map((group) => (
        <div key={group.day.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-unior-coral"></span>
              {group.day.label}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Total {group.total}</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
                Con mesa {group.withMesa}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
                Sin mesa {group.missing}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-500">
                No aplica {group.na}
              </span>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[9px] uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 font-bold whitespace-nowrap">Hora</th>
                  <th className="px-3 py-2 font-bold">Sala</th>
                  <th className="px-3 py-2 font-bold">Actividad</th>
                  <th className="px-3 py-2 font-bold w-[24%]">Tema</th>
                  <th className="px-3 py-2 font-bold w-[18%]">Expositores</th>
                  <th className="px-3 py-2 font-bold">Carreras</th>
                  <th className="px-3 py-2 font-bold w-[22%]">Mesa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {group.rows.map((session) => {
                  const state = getMesaState(session);
                  const mod = modality(session);
                  const list = careerNames(session, careers);

                  return (
                    <tr
                      key={session.id}
                      className={`align-top transition-colors ${
                        state === 'missing' ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-black text-slate-900">{session.start}</div>
                        <div className="text-[10px] text-slate-400">{session.end}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="text-xs font-bold text-slate-800">{roomName(session)}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{roomDetail(session, salas)}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                            KIND_STYLE[session.kind] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {kindLabel(session)}
                        </span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[9px] font-semibold ${mod.className}`}>
                            {mod.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <ActivityText session={session} />
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-slate-700 leading-snug">{speakersText(session)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {list.length ? (
                            list.map((career) => (
                              <span key={career.name} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: `#${career.color || 'cbd5e1'}` }}
                                ></span>
                                {career.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">General</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <MesaCell session={session} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden p-3 space-y-3">
            {group.rows.map((session) => {
              const state = getMesaState(session);
              const mod = modality(session);
              const list = careerNames(session, careers);

              return (
                <div
                  key={session.id}
                  className={`rounded-xl border p-3 ${
                    state === 'missing' ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">
                      {session.start} - {session.end}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {roomName(session)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                        KIND_STYLE[session.kind] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {kindLabel(session)}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[9px] font-semibold ${mod.className}`}>
                      {mod.text}
                    </span>
                  </div>

                  <div className="mt-1.5">
                    <p className="text-sm font-bold text-slate-900 leading-snug">{activityText(session).primary}</p>
                    {activityText(session).secondary && (
                      <p className="text-[11px] text-slate-500 leading-snug">{activityText(session).secondary}</p>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-700">
                    <User className="w-3 h-3 mt-0.5 text-slate-400 flex-shrink-0" />
                    <span>{speakersText(session)}</span>
                  </div>

                  {list.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {list.map((career) => (
                        <span key={career.name} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: `#${career.color || 'cbd5e1'}` }}
                          ></span>
                          {career.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2.5 rounded-lg bg-slate-50 border border-slate-200 p-2">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Mesa</div>
                    <MesaCell session={session} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
