import React, { useState } from 'react';
import { AlertTriangle, Clock, Layers, Copy, FileSpreadsheet, CheckCircle, Info, ChevronRight } from 'lucide-react';
import ProgramCard from '../components/ProgramCard';
import CommitteeMesaTable from '../components/CommitteeMesaTable';

export default function CommitteeDashboard({ congressData }) {
  const { congress, careers, salas, days, sessions, alerts } = congressData;

  const [activeSubTab, setActiveSubTab] = useState('alerts'); // 'alerts', 'matrix', 'program'
  const [selectedDay, setSelectedDay] = useState('all');
  const [copiedToast, setCopiedToast] = useState(false);

  // Filter alerts by day
  const filteredAlerts = alerts.filter(
    (a) => selectedDay === 'all' || a.day === selectedDay || a.day === 'general'
  );

  const conflicts = filteredAlerts.filter((a) => a.level === 'conflicto');
  const pendings = filteredAlerts.filter((a) => a.level === 'pendiente');
  const reviews = filteredAlerts.filter((a) => a.level === 'revisar');

  // Copy schedule text to clipboard
  const handleCopyText = () => {
    const text = days.map(d => {
      const daySessions = sessions.filter(s => s.day === d.id);
      if (!daySessions.length) return '';
      const lines = daySessions.map(s => {
        const time = `${s.start} - ${s.end}`;
        const room = s.sala ? `Sala ${s.sala} (${salas[s.sala]})` : (s.room || 'General');
        const who = s.kind === 'qa' ? `Preguntas (${s.who || ''})` : s.speakers.map(x => x.n).join(' / ') || s.title || '';
        const topic = s.topic ? ` - "${s.topic}"` : '';
        return `${time} | ${room} | ${who}${topic}`;
      }).join('\n');
      return `=== ${d.label.toUpperCase()} ===\n${lines}`;
    }).filter(Boolean).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = ['Día', 'Inicio', 'Fin', 'Tipo', 'Sala', 'Lugar', 'Carreras', 'Expositores', 'Tema', 'Modalidad', 'Notas', 'Archivo Foto'];
    
    const rows = sessions.map(s => {
      const dayShort = days.find(d => d.id === s.day)?.short || s.day;
      const salaName = s.sala ? `Sala ${s.sala} - ${salas[s.sala]}` : (s.room || 'General');
      const careerNames = s.careers.map(c => careers[c]?.name).filter(Boolean).join(' + ');
      const speakersStr = s.kind === 'qa' ? (s.who || 'Preguntas') : s.speakers.map(x => x.n).join(' / ') || s.title;
      const modality = (s.virtual ? 'Virtual ' : 'Presencial ') + (s.country || '') + (s.mod ? ` (${s.mod})` : '');
      const photoFiles = s.speakers.map(x => `${x.s}.jpg`).join('; ');

      return [dayShort, s.start, s.end, s.kind, s.sala || '', salaName, careerNames, speakersStr, s.topic || '', modality, s.notes.join(' · '), photoFiles].map(q).join(',');
    });

    const csvContent = '\ufeff' + [headers.map(q).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `programa_congreso_${selectedDay}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>¡Cronograma copiado al portapapeles!</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              Modo Organizador
            </span>
            <span className="text-xs text-slate-400">· Actualizado en vivo</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Panel de Control y Seguimiento del Comité
          </h2>
          <p className="text-xs text-slate-500">
            Detección de cruces de salas, expositores sin tema y matriz de salas en tiempo real.
          </p>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar Texto</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-all shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Descargar CSV Excel</span>
          </button>
        </div>
      </div>

      {/* Navigation & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sesiones</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{sessions.length}</div>
          <span className="text-[11px] text-slate-400">8 carreras distribuidas</span>
        </div>

        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center justify-between">
            Cruces de Horario
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </span>
          <div className="text-2xl font-black text-rose-900 mt-1">{conflicts.length}</div>
          <span className="text-[11px] text-rose-700">Requieren reajuste de sala</span>
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
            Datos Pendientes
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </span>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendings.length}</div>
          <span className="text-[11px] text-amber-700">Temas o nombres faltantes</span>
        </div>

        <div className="bg-sky-50 rounded-2xl border border-sky-200 p-4 shadow-xs">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center justify-between">
            Por Confirmar
            <Info className="w-3.5 h-3.5 text-sky-600" />
          </span>
          <div className="text-2xl font-black text-sky-900 mt-1">{reviews.length}</div>
          <span className="text-[11px] text-sky-700">Consultas de organización</span>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'alerts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Alertas de Organización ({filteredAlerts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Matriz de Salas en Paralelo
          </button>
          <button
            onClick={() => setActiveSubTab('program')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'program'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Programa y Mesas
          </button>
        </div>

        {/* Day Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Día:</span>
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedDay === 'all' ? 'bg-unior-wine text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Todos
          </button>
          {days.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${selectedDay === d.id ? 'bg-unior-wine text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {d.short}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: ALERTS VIEW */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-6">
          {/* Conflicts Group */}
          {conflicts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                Cruces de horario o de sala detectados ({conflicts.length})
              </h3>
              <div className="space-y-2">
                {conflicts.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border-l-4 border-red-500 border border-slate-200 shadow-2xs text-xs">
                    <span className="font-bold text-red-700 mr-2">
                      [{item.day === 'general' ? 'GENERAL' : days.find(d => d.id === item.day)?.short}]
                    </span>
                    <span className="text-slate-800">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Group */}
          {pendings.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Datos pendientes por definir en el Excel ({pendings.length})
              </h3>
              <div className="space-y-2">
                {pendings.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border-l-4 border-amber-500 border border-slate-200 shadow-2xs text-xs">
                    <span className="font-bold text-amber-700 mr-2">
                      [{item.day === 'general' ? 'GENERAL' : days.find(d => d.id === item.day)?.short}]
                    </span>
                    <span className="text-slate-800">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Group */}
          {reviews.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-sky-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                Puntos por confirmar con el comité organizador ({reviews.length})
              </h3>
              <div className="space-y-2">
                {reviews.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border-l-4 border-sky-500 border border-slate-200 shadow-2xs text-xs">
                    <span className="font-bold text-sky-700 mr-2">
                      [{item.day === 'general' ? 'GENERAL' : days.find(d => d.id === item.day)?.short}]
                    </span>
                    <span className="text-slate-800">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: ROOM MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-8">
          {days.filter(d => selectedDay === 'all' || d.id === selectedDay).map(day => {
            const daySessions = sessions.filter(s => s.day === day.id);
            if (!daySessions.length) return null;

            return (
              <div key={day.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-unior-coral"></span>
                  {day.label} · Distribución por Sala
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-x-auto">
                  {/* Columns for Salas 1, 2, 3, 4 */}
                  {[1, 2, 3, 4].map(roomNum => (
                    <div key={roomNum} className="space-y-3 min-w-[220px]">
                      <div className="py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold text-center">
                        <div>Sala {roomNum}</div>
                        <div className="text-[10px] text-slate-300 font-normal truncate">{salas[roomNum]}</div>
                      </div>
                      <div className="space-y-2.5">
                        {daySessions.filter(s => s.sala === roomNum).map(s => (
                          <div key={s.id} className="text-xs">
                            <span className="font-bold text-slate-500 block mb-1">{s.start} - {s.end}</span>
                            <ProgramCard session={s} salas={salas} careers={careers} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Column for Plenaries and Workshops */}
                  <div className="space-y-3 min-w-[220px]">
                    <div className="py-2 px-3 rounded-xl bg-unior-wine text-white text-xs font-bold text-center">
                      <div>Actos Generales / Simulaciones</div>
                      <div className="text-[10px] text-rose-200 font-normal">Plenarias y Talleres</div>
                    </div>
                    <div className="space-y-2.5">
                      {daySessions.filter(s => !s.sala).map(s => (
                        <div key={s.id} className="text-xs">
                          <span className="font-bold text-slate-500 block mb-1">{s.start} - {s.end}</span>
                          <ProgramCard session={s} salas={salas} careers={careers} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 3: PROGRAM WITH MESA INFO */}
      {activeSubTab === 'program' && (
        <CommitteeMesaTable
          sessions={sessions}
          days={days}
          salas={salas}
          careers={careers}
          selectedDay={selectedDay}
        />
      )}
    </div>
  );
}

