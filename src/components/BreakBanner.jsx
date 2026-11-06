import React from 'react';

export default function BreakBanner({ title, notes = [] }) {
  const isLunch = title?.toLowerCase().includes('almuerzo');
  const isCeremony = title?.toLowerCase().includes('inaugur') || title?.toLowerCase().includes('clausura');

  return (
    <div className={`break-banner w-full text-center py-2 px-3 rounded-xl border text-[12px] font-semibold transition-all ${
      isLunch 
        ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
        : isCeremony
        ? 'bg-rose-50/80 border-rose-200 text-rose-950 font-bold'
        : 'bg-white/90 border-slate-200 text-slate-700'
    }`}>
      <div>{title}</div>
      {notes?.length > 0 && (
        <div className="text-[10px] font-normal text-slate-500 mt-0.5">
          {notes.join(' · ')}
        </div>
      )}
    </div>
  );
}
