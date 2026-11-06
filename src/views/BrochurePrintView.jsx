import React, { useState } from 'react';
import { Printer, Filter, CheckCircle2 } from 'lucide-react';
import ProgramCard from '../components/ProgramCard';
import BreakBanner from '../components/BreakBanner';

export default function BrochurePrintView({ congressData }) {
  const { congress, careers, salas, days, sessions } = congressData;
  const [selectedCareer, setSelectedCareer] = useState('med'); // default to Medicina like the reference draft
  const [includeGeneral, setIncludeGeneral] = useState(true);
  const [includeQA, setIncludeQA] = useState(true);

  // Common general types
  const GENERAL_KINDS = ['registro', 'acto', 'plenaria', 'almuerzo'];

  // Filter sessions for the selected career
  const filterSessionsByDay = (dayId) => {
    return sessions.filter((s) => {
      if (s.day !== dayId) return false;
      if (!includeQA && s.kind === 'qa') return false;

      if (selectedCareer === 'all') return true;

      const matchesCareer = s.careers && s.careers.includes(selectedCareer);
      const isGeneral = includeGeneral && GENERAL_KINDS.includes(s.kind);

      return matchesCareer || isGeneral;
    });
  };

  const thursdaySessions = filterSessionsByDay('2026-11-12');
  const fridaySessions = filterSessionsByDay('2026-11-13');
  const wednesdaySessions = filterSessionsByDay('2026-11-11');

  const careerInfo = careers[selectedCareer];
  const careerTitle = selectedCareer === 'all' ? 'PROGRAMA GENERAL' : (careerInfo?.name?.toUpperCase() || 'PROGRAMA');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Control Bar (hidden when printing) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Career Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-unior-wine" />
              Seleccionar Carrera para el Folleto:
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCareer('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCareer === 'all'
                    ? 'bg-unior-wine text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todas (General)
              </button>
              {Object.entries(careers).map(([key, car]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCareer(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedCareer === key
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
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

          {/* Action & Toggle Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGeneral}
                onChange={(e) => setIncludeGeneral(e.target.checked)}
                className="rounded border-slate-300 text-unior-wine focus:ring-unior-coral"
              />
              Actos generales
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={includeQA}
                onChange={(e) => setIncludeQA(e.target.checked)}
                className="rounded border-slate-300 text-unior-wine focus:ring-unior-coral"
              />
              Preguntas y resp.
            </label>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-unior-wine to-unior-coral text-white text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar a PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* BROCHURE SHEET CANVAS (Exact replication of reference design) */}
      <div 
        className="brochure-container relative bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 overflow-hidden mx-auto max-w-[1120px]"
        style={{
          backgroundImage: `url('/assets/watermarks/fondo-gris.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Subtle UNIOR Coat of Arms Watermark with Controlled Opacity */}
        <div 
          className="absolute -right-8 top-12 w-[460px] h-[520px] pointer-events-none select-none opacity-[0.07] bg-no-repeat bg-contain"
          style={{ backgroundImage: `url('/assets/watermarks/Unior Escudo Negro.png')` }}
        />

        {/* HEADER SECTION */}
        <header className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-200/80">
          {/* Left: Congress Official Logo */}
          <div className="flex-1 max-w-lg">
            <img 
              src="/assets/logos/logo-congreso.png" 
              alt="1er Congreso Internacional de Integración Científica" 
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-2xs"
            />
          </div>

          {/* Right: Career & Program Badge */}
          <div className="flex flex-col items-center sm:items-end justify-center">
            <span className="inline-block px-6 py-1.5 rounded-full bg-[#F05023] text-white text-xs sm:text-sm font-black tracking-widest uppercase shadow-xs mb-1">
              PROGRAMA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
              {careerTitle}
            </h2>
          </div>
        </header>

        {/* PRE-CONGRESS NOTE (If applicable, e.g. Prótesis Dental on Nov 11) */}
        {wednesdaySessions.length > 0 && (
          <div className="my-6 p-4 rounded-2xl bg-amber-50/80 backdrop-blur-xs border border-amber-200 shadow-2xs">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Pre-Congreso · Miércoles 11 de Noviembre
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {wednesdaySessions.map((session) => (
                <div key={session.id} className="flex gap-3 items-center">
                  <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{session.start} - {session.end}</span>
                  <div className="flex-1">
                    <ProgramCard session={session} salas={salas} careers={careers} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-COLUMN CONGRESS DAYS LAYOUT */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
          {/* COLUMN 1: JUEVES 12 */}
          <section className="flex flex-col">
            {/* Column Header Pills */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-24 text-center py-1.5 px-3 rounded-full bg-[#F05023] text-white text-xs font-black tracking-wider uppercase shadow-xs">
                HORA
              </span>
              <span className="flex-1 text-center py-1.5 px-4 rounded-full bg-[#F05023] text-white text-xs font-black tracking-wider uppercase shadow-xs">
                JUEVES 12
              </span>
            </div>

            {/* Thursday Sessions Timeline */}
            <div className="space-y-3 flex-1">
              {thursdaySessions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic bg-white/50 rounded-xl border border-dashed border-slate-300">
                  No hay actividades programadas para esta carrera el día jueves.
                </div>
              ) : (
                thursdaySessions.map((session) => (
                  <div key={session.id} className="flex items-start gap-2.5">
                    {/* Time Slot on Left */}
                    <div className="w-24 flex-shrink-0 pt-2 text-right">
                      <span className="text-[12px] font-bold text-slate-800 tracking-tight block">
                        {session.start} - {session.end}
                      </span>
                      <div className="w-full border-b border-dashed border-slate-300 mt-2"></div>
                    </div>

                    {/* Card on Right */}
                    <div className="flex-1 min-w-0">
                      {GENERAL_KINDS.includes(session.kind) && !session.speakers?.length ? (
                        <BreakBanner title={session.title} notes={session.notes} />
                      ) : (
                        <ProgramCard session={session} salas={salas} careers={careers} />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* COLUMN 2: VIERNES 13 */}
          <section className="flex flex-col">
            {/* Column Header Pills */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-24 text-center py-1.5 px-3 rounded-full bg-[#F05023] text-white text-xs font-black tracking-wider uppercase shadow-xs">
                HORA
              </span>
              <span className="flex-1 text-center py-1.5 px-4 rounded-full bg-[#F05023] text-white text-xs font-black tracking-wider uppercase shadow-xs">
                VIERNES 13
              </span>
            </div>

            {/* Friday Sessions Timeline */}
            <div className="space-y-3 flex-1">
              {fridaySessions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs italic bg-white/50 rounded-xl border border-dashed border-slate-300">
                  No hay actividades programadas para esta carrera el día viernes.
                </div>
              ) : (
                fridaySessions.map((session) => (
                  <div key={session.id} className="flex items-start gap-2.5">
                    {/* Time Slot on Left */}
                    <div className="w-24 flex-shrink-0 pt-2 text-right">
                      <span className="text-[12px] font-bold text-slate-800 tracking-tight block">
                        {session.start} - {session.end}
                      </span>
                      <div className="w-full border-b border-dashed border-slate-300 mt-2"></div>
                    </div>

                    {/* Card on Right */}
                    <div className="flex-1 min-w-0">
                      {GENERAL_KINDS.includes(session.kind) && !session.speakers?.length ? (
                        <BreakBanner title={session.title} notes={session.notes} />
                      ) : (
                        <ProgramCard session={session} salas={salas} careers={careers} />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* FOOTER SECTION (Institutional logos & co-organizers from public/assets/logos/) */}
        <footer className="relative z-10 mt-10 pt-5 border-t-2 border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Organiza: UNIOR Official Logo */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Organiza:
            </span>
            <img 
              src="/assets/logos/unior-logo.png" 
              alt="UNIOR - Universidad Privada de Oruro" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Con el apoyo de: Partners Official Logos */}
          <div className="flex flex-col md:items-end items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Con el apoyo de:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
              <img 
                src="/assets/logos/gador.png" 
                alt="Gobierno Autónomo Departamental de Oruro" 
                className="h-9 sm:h-11 w-auto object-contain"
                title="Gobierno Autónomo Departamental de Oruro"
              />
              <img 
                src="/assets/logos/gador-secretaria-cultura.png" 
                alt="Cultura y Turismo Oruro" 
                className="h-9 sm:h-11 w-auto object-contain"
                title="Cultura y Turismo Oruro"
              />
              <img 
                src="/assets/logos/gamo.png" 
                alt="Gobierno Autónomo Municipal de Oruro" 
                className="h-9 sm:h-11 w-auto object-contain"
                title="Gobierno Autónomo Municipal de Oruro"
              />
              <img 
                src="/assets/logos/gamo-secretaria-cultura.png" 
                alt="Secretaría Municipal de Cultura" 
                className="h-7 sm:h-9 w-auto object-contain"
                title="Secretaría Municipal de Cultura"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
