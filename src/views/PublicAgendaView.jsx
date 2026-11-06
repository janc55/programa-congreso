import React, { useState, useMemo } from 'react';
import { Search, Calendar, MapPin, Sparkles, Filter, Clock } from 'lucide-react';
import ProgramCard from '../components/ProgramCard';
import BreakBanner from '../components/BreakBanner';

export default function PublicAgendaView({ congressData }) {
  const { congress, careers, salas, days, sessions } = congressData;

  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVirtual, setFilterVirtual] = useState('all'); // all, presencial, virtual
  const [filterQA, setFilterQA] = useState(true);

  const GENERAL_KINDS = ['registro', 'acto', 'plenaria', 'almuerzo'];

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Day filter
      if (selectedDay !== 'all' && s.day !== selectedDay) return false;

      // QA filter
      if (!filterQA && s.kind === 'qa') return false;

      // Modality filter
      if (filterVirtual === 'virtual' && !s.virtual) return false;
      if (filterVirtual === 'presencial' && s.virtual) return false;

      // Career filter
      if (selectedCareer !== 'all') {
        const matchesCar = s.careers?.includes(selectedCareer);
        const isGeneral = GENERAL_KINDS.includes(s.kind);
        if (!matchesCar && !isGeneral) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const speakerNames = s.speakers?.map(x => x.n.toLowerCase()).join(' ') || '';
        const topic = (s.topic || '').toLowerCase();
        const title = (s.title || '').toLowerCase();
        const who = (s.who || '').toLowerCase();
        const room = (s.room || '').toLowerCase();
        const salaName = s.sala ? (salas[s.sala] || '').toLowerCase() : '';

        const fullString = `${speakerNames} ${topic} ${title} ${who} ${room} ${salaName}`;
        if (!fullString.includes(q)) return false;
      }

      return true;
    });
  }, [sessions, selectedDay, selectedCareer, searchQuery, filterVirtual, filterQA, salas]);

  // Group by day for clean display
  const groupedByDay = useMemo(() => {
    const groups = {};
    days.forEach(d => {
      groups[d.id] = { dayInfo: d, sessions: [] };
    });
    filteredSessions.forEach(s => {
      if (groups[s.day]) {
        groups[s.day].sessions.push(s);
      }
    });
    return Object.values(groups).filter(g => g.sessions.length > 0);
  }, [filteredSessions, days]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-unior-wine text-xs font-bold uppercase tracking-wider mb-2">
          {congress.edition} {congress.name}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Programa Oficial y Cronograma
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          {congress.dates} · Sede: {congress.venue}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por expositor, tema, especialidad o sala..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-500 bg-slate-50/50"
          />
        </div>

        {/* Day Filter Buttons */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Día del Congreso:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDay === 'all'
                  ? 'bg-unior-wine text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos los días
            </button>
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDay === day.id
                    ? 'bg-unior-wine text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>
        </div>

        {/* Career Filter Pills */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Filtrar por Área / Carrera:
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCareer('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedCareer === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas las áreas
            </button>
            {Object.entries(careers).map(([key, car]) => (
              <button
                key={key}
                onClick={() => setSelectedCareer(key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  selectedCareer === key
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
                style={{
                  borderLeftColor: `#${car.color}`,
                  borderLeftWidth: '4px'
                }}
              >
                {car.name}
              </button>
            ))}
          </div>
        </div>

        {/* Extra Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Modalidad:</span>
            <button
              onClick={() => setFilterVirtual('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${filterVirtual === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterVirtual('presencial')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${filterVirtual === 'presencial' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Presencial
            </button>
            <button
              onClick={() => setFilterVirtual('virtual')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${filterVirtual === 'virtual' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Virtual
            </button>
          </div>

          <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={filterQA}
              onChange={(e) => setFilterQA(e.target.checked)}
              className="rounded border-slate-300 text-unior-wine focus:ring-unior-coral"
            />
            <span>Incluir Preguntas y Respuestas</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs font-semibold text-slate-500">
          Mostrando {filteredSessions.length} actividades
          {selectedCareer !== 'all' && ` para ${careers[selectedCareer]?.name}`}
        </span>
      </div>

      {/* Sessions Timeline List */}
      <div className="space-y-10">
        {groupedByDay.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No se encontraron actividades con estos filtros</p>
            <p className="text-xs text-slate-400 mt-1">Intenta cambiar la búsqueda o el día seleccionado.</p>
          </div>
        ) : (
          groupedByDay.map(({ dayInfo, sessions: daySessions }) => (
            <section key={dayInfo.id} className="space-y-4">
              {/* Day Header Ribbon */}
              <div className="sticky top-16 z-20 py-2.5 px-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-unior-coral" />
                  <h3 className="text-sm font-bold tracking-tight">{dayInfo.label}</h3>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  {daySessions.length} actividades
                </span>
              </div>

              {/* Day Items */}
              <div className="space-y-3">
                {daySessions.map((session) => (
                  <div key={session.id} className="flex items-start gap-3">
                    {/* Time */}
                    <div className="w-20 sm:w-24 flex-shrink-0 pt-2 text-right">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block tracking-tight">
                        {session.start}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {session.end}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="flex-1 min-w-0">
                      {GENERAL_KINDS.includes(session.kind) && !session.speakers?.length ? (
                        <BreakBanner title={session.title} notes={session.notes} />
                      ) : (
                        <ProgramCard session={session} salas={salas} careers={careers} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

