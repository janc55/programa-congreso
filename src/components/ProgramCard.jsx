import React from 'react';
import SpeakerAvatar from './SpeakerAvatar';

const SALA_COLORS = {
  1: { bg: 'bg-amber-500', text: 'text-white' }, // Sala 1 (Subterráneo)
  2: { bg: 'bg-purple-600', text: 'text-white' }, // Sala 2 (Piso 2)
  3: { bg: 'bg-sky-600', text: 'text-white' },      // Sala 3 (Piso 6)
  4: { bg: 'bg-blue-600', text: 'text-white' },     // Sala 4 (Piso 7)
};

export default function ProgramCard({ session, salas, careers }) {
  const isQA = session.kind === 'qa';
  const isWorkshop = session.kind === 'workshop';
  const isPlenary = session.kind === 'plenaria';

  const salaNum = session.sala;
  const salaInfo = salaNum ? salas[salaNum] : null;
  const salaStyle = salaNum ? SALA_COLORS[salaNum] : { bg: 'bg-slate-700', text: 'text-white' };

  return (
    <article className="session-card relative bg-white/95 rounded-lg border border-slate-200/90 shadow-2xs px-2.5 py-1.5 flex gap-2 items-center justify-between">
      {/* Left career accent line */}
      {session.careers?.length > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ 
            backgroundColor: session.careers[0] && careers[session.careers[0]] 
              ? `#${careers[session.careers[0]].color}` 
              : '#94a3b8' 
          }}
          title={session.careers.map(c => careers[c]?.name).filter(Boolean).join(', ')}
        />
      )}

      {/* Main info */}
      <div className="flex-1 min-w-0 pl-1">
        <h4 className="font-bold text-slate-900 text-[11px] leading-tight block">
          {isQA ? (
            <span className="text-slate-700 font-semibold">
              Preguntas y respuestas
              {session.who && <span className="text-slate-500 font-normal"> · {session.who}</span>}
            </span>
          ) : session.speakers?.length > 0 ? (
            session.speakers.map(s => s.n).join(' / ')
          ) : (
            session.title || 'Actividad por definir'
          )}
        </h4>

        {session.topic && (
          <p className="text-[9.5px] text-slate-600 font-normal leading-tight mt-0.5 block">
            {isWorkshop && <span className="font-semibold text-teal-700">Workshop: </span>}
            {isPlenary && <span className="font-semibold text-rose-700">Plenaria: </span>}
            {session.topic}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1 mt-1">
          {salaNum ? (
            <span 
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-bold leading-none ${salaStyle.bg} ${salaStyle.text}`}
              title={salaInfo || `Sala ${salaNum}`}
            >
              Sala {salaNum}
            </span>
          ) : session.room ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-semibold leading-none bg-slate-200 text-slate-800">
              {session.room}
            </span>
          ) : null}

          {session.virtual ? (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-bold leading-none bg-pink-600 text-white">
              Virtual
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-semibold leading-none bg-emerald-500 text-white">
              Presencial
            </span>
          )}

          {isWorkshop && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-semibold leading-none bg-teal-500 text-white">
              Workshop
            </span>
          )}

          {session.mod && !isWorkshop && (
            <span className="inline-flex items-center px-1 py-0.5 rounded-xs text-[8.5px] leading-none text-slate-500 bg-slate-100">
              {session.mod}
            </span>
          )}
        </div>
      </div>

      {/* Speaker Avatar */}
      {!isQA && session.speakers?.length > 0 && (
        <div className="flex flex-col gap-1 items-center justify-center flex-shrink-0">
          {session.speakers.map((sp, idx) => (
            <SpeakerAvatar
              key={idx}
              speaker={sp}
              country={session.country}
              size="md"
            />
          ))}
        </div>
      )}
    </article>
  );
}
