import React, { useState, useRef } from 'react';
import { Download, Printer, Filter } from 'lucide-react';
import ProgramCard from '../components/ProgramCard';
import BreakBanner from '../components/BreakBanner';
import { exportElementToImage } from '../utils/pdfExport';

export default function BrochurePrintView({ congressData }) {
  const { congress, careers, salas, days, sessions } = congressData;
  const [selectedCareer, setSelectedCareer] = useState('med');
  const [includeGeneral, setIncludeGeneral] = useState(true);
  const [includeQA, setIncludeQA] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const brochureRef = useRef(null);

  const GENERAL_KINDS = ['registro', 'acto', 'plenaria', 'almuerzo'];

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

  const handleExportPDF = async () => {
    if (!brochureRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const cleanCareerName = careerTitle.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Programa_${cleanCareerName}_UNIOR_2026.png`;
      await exportElementToImage(brochureRef.current, filename);
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Hubo un inconveniente al generar la imagen. Por favor intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Control Bar (hidden when printing) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Career Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-unior-wine" />
              Seleccionar Carrera para el Folleto:
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCareer('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCareer === 'all'
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
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedCareer === key
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
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
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

            {/* DIRECT IMAGE DOWNLOAD BUTTON */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-unior-wine to-unior-coral text-white text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer ${isExporting ? 'opacity-70 cursor-wait' : ''
                }`}
              title="Descargar folleto como imagen"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generando...' : 'Descargar Imagen'}</span>
            </button>

            {/* Standard Print fallback (clean white paper version) */}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              title="Imprimir versión en papel limpio (sin fondo gris)"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Imprimir (Papel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* BROCHURE SHEET CANVAS (Calibrated A4 Proportions: 794px x 1123px) */}
      <div
        ref={brochureRef}
        id="brochure-container"
        className="brochure-container relative bg-white rounded-2xl border border-slate-200/90 shadow-xl pt-1 px-5 sm:px-6 pb-2 sm:pb-3 mx-auto w-full max-w-[794px]"
        style={{
          backgroundImage: `url('/assets/watermarks/fondo-gris.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        {/* Watermark Coat of Arms with subtle opacity */}
        <div
          className="watermark-shield absolute -right-4 top-6 w-[380px] h-[440px] pointer-events-none select-none opacity-[0.06] bg-no-repeat bg-contain"
          style={{ backgroundImage: `url('/assets/watermarks/Unior Escudo Negro.png')` }}
        />

        {/* TOP: HEADER SECTION */}
        <header className="relative z-10 flex items-center justify-between gap-4 pb-1 border-b border-slate-200 flex-shrink-0">
          {/* Left: Congress Official Logo - Balanced & Crisp */}
          <div className="flex-1 max-w-sm">
            <img
              src="/assets/logos/logo-congreso.png"
              alt="1er Congreso Internacional de Integración Científica"
              className="h-32 w-auto object-contain drop-shadow-2xs"
            />
          </div>

          {/* Right: Career & Program Badge (Centered with flex to prevent offset) */}
          <div className="flex flex-col items-end justify-center flex-shrink-0">
            <div className="px-4 py-1 rounded-full bg-[#F05023] text-white text-xl font-black tracking-widest uppercase flex items-center justify-center leading-none mb-0.5 shadow-2xs">
              PROGRAMA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase leading-none">
              {careerTitle}
            </h2>
          </div>
        </header>

        {/* MIDDLE: PRE-CONGRESS (If applicable) */}
        {wednesdaySessions.length > 0 && (
          <div className="my-2 p-2 rounded-lg bg-amber-50/80 backdrop-blur-xs border border-amber-200 shadow-2xs flex-shrink-0">
            <h3 className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              Pre-Congreso · Miércoles 11 de Noviembre
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {wednesdaySessions.map((session) => (
                <div key={session.id} className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{session.start} - {session.end}</span>
                  <div className="flex-1">
                    <ProgramCard session={session} salas={salas} careers={careers} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MIDDLE: 2-COLUMN CONGRESS DAYS LAYOUT */}
        <div className="relative z-10 grid grid-cols-2 gap-3.5 my-3 flex-1">
          {/* COLUMN 1: JUEVES 12 */}
          <section className="flex flex-col">
            {/* Column Header Pills */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-16 text-center rounded-full bg-[#F05023] text-white text-[10px] font-black tracking-wider uppercase shadow-xs flex items-center justify-center leading-none h-5">
                HORA
              </div>
              <div className="flex-1 text-center rounded-full bg-[#F05023] text-white text-[10px] font-black tracking-wider uppercase shadow-xs flex items-center justify-center leading-none h-5">
                JUEVES 12
              </div>
            </div>

            {/* Thursday Sessions Timeline */}
            <div className="space-y-1.5 flex-1">
              {thursdaySessions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs italic bg-white/50 rounded-xl border border-dashed border-slate-300">
                  No hay actividades para esta carrera el día jueves.
                </div>
              ) : (
                thursdaySessions.map((session) => (
                  <div key={session.id} className="timeline-row flex items-start gap-1.5">
                    {/* Time Slot on Left */}
                    <div className="w-16 flex-shrink-0 pt-1 text-right">
                      <span className="text-[10px] font-bold text-slate-800 tracking-tight block leading-tight">
                        {session.start} - {session.end}
                      </span>
                      <div className="w-full border-b border-dashed border-slate-300 mt-1"></div>
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
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-16 text-center rounded-full bg-[#F05023] text-white text-[10px] font-black tracking-wider uppercase shadow-xs flex items-center justify-center leading-none h-5">
                HORA
              </div>
              <div className="flex-1 text-center rounded-full bg-[#F05023] text-white text-[10px] font-black tracking-wider uppercase shadow-xs flex items-center justify-center leading-none h-5">
                VIERNES 13
              </div>
            </div>

            {/* Friday Sessions Timeline */}
            <div className="space-y-1.5 flex-1">
              {fridaySessions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs italic bg-white/50 rounded-xl border border-dashed border-slate-300">
                  No hay actividades para esta carrera el día viernes.
                </div>
              ) : (
                fridaySessions.map((session) => (
                  <div key={session.id} className="timeline-row flex items-start gap-1.5">
                    {/* Time Slot on Left */}
                    <div className="w-16 flex-shrink-0 pt-1 text-right">
                      <span className="text-[10px] font-bold text-slate-800 tracking-tight block leading-tight">
                        {session.start} - {session.end}
                      </span>
                      <div className="w-full border-b border-dashed border-slate-300 mt-1"></div>
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

        {/* BOTTOM: FOOTER SECTION (Always pinned to bottom of A4) */}
        <footer className="relative z-10 mt-2 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-4 flex-shrink-0">
          {/* Organiza: UNIOR Official Logo */}
          <div className="flex items-center gap-2">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500">
              Organiza:
            </span>
            <img
              src="/assets/logos/unior-logo.png"
              alt="UNIOR - Universidad Privada de Oruro"
              className="h-11 w-auto object-contain"
            />
          </div>

          {/* Con el apoyo de: Partners Official Logos */}
          <div className="flex items-center gap-2">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
              Con el apoyo de:
            </span>
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/logos/gador.png"
                alt="Gobierno Autónomo Departamental de Oruro"
                className="h-10 w-auto object-contain"
                title="Gobierno Autónomo Departamental de Oruro"
              />
              <img
                src="/assets/logos/gador-secretaria-cultura.png"
                alt="Cultura y Turismo Oruro"
                className="h-10 w-auto object-contain"
                title="Cultura y Turismo Oruro"
              />
              <img
                src="/assets/logos/gamo.png"
                alt="Gobierno Autónomo Municipal de Oruro"
                className="h-10 w-auto object-contain"
                title="Gobierno Autónomo Municipal de Oruro"
              />
              <img
                src="/assets/logos/gamo-secretaria-cultura.png"
                alt="Secretaría Municipal de Cultura"
                className="h-9 w-auto object-contain"
                title="Secretaría Municipal de Cultura"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
