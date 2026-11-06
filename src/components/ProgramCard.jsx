import React from 'react';
import SpeakerAvatar from './SpeakerAvatar';

const SALA_COLORS = {
  1: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-600' }, // Sala 1 (Subterráneo)
  2: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700' }, // Sala 2 (Piso 2)
  3: { bg: 'bg-sky-600', text: 'text-white', border: 'border-sky-700' },      // Sala 3 (Piso 6)
  4: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },     // Sala 4 (Piso 7)
};

export default function ProgramCard({ session, salas, careers }) {
  const isQA = session.kind === 'qa';
  const isWorkshop = session.kind === 'workshop';
  const isPlenary = session.kind === 'plenaria';

  // Sala label
  const salaNum = session.sala;
  const salaInfo = salaNum ? salas[salaNum] : null;
  const salaStyle = salaNum ? SALA_COLORS[salaNum] : { bg: 'bg-slate-700', text: 'text-white', border: 'border-slate-800' };

  return (
    <article className="session-card relative bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm transition-all p-3 flex gap-3 items-start overflow-hidden">
      {/* Career color accent line on the left */}
      {session.careers?.length > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ 
            backgroundColor: session.careers[0] && careers[session.careers[0]] 
              ? `#${careers[session.careers[0]].color}` 
              : '#94a3b8' 
          }}
          title={session.careers.map(c => careers[c]?.name).filter(Boolean).join(', ')}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 pl-1">
        {/* Speaker Name / Title */}
        <h4 className="font-bold text-slate-900 text-[13px] leading-snug line-clamp-2">
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

        {/* Topic / Description */}
        {session.topic && (
          <p className="text-[11.5px] text-slate-600 font-normal mt-0.5 leading-snug line-clamp-2">
            {isWorkshop && <span className="font-semibold text-teal-700">Workshop: </span>}
            {isPlenary && <span className="font-semibold text-rose-700">Plenaria: </span>}
            {session.topic}
          </p>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {/* Sala Badge */}
          {salaNum ? (
            <span 
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${salaStyle.bg} ${salaStyle.text}`}
              title={salaInfo || `Sala ${salaNum}`}
            >
              Sala {salaNum}
            </span>
          ) : session.room ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-800">
              {session.room}
            </span>
          ) : null}

          {/* Modality Badge */}
          {session.virtual ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-600 text-white">
              Virtual{session.country ? ` (${session.country})` : ''}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
              Presencial
            </span>
          )}

          {/* Workshop Badge */}
          {isWorkshop && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500 text-white">
              Workshop
            </span>
          )}

          {/* Extra Modality Note */}
          {session.mod && !isWorkshop && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] text-slate-500 bg-slate-100">
              {session.mod}
            </span>
          )}
        </div>
      </div>

      {/* Speaker Avatar on the right */}
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

