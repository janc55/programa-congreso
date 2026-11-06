import React from 'react';

export default function BreakBanner({ title, notes = [] }) {
  const isLunch = title?.toLowerCase().includes('almuerzo');
  const isCeremony = title?.toLowerCase().includes('inaugur') || title?.toLowerCase().includes('clausura');

  return (
    <div className={`break-banner w-full text-center py-2.5 px-4 rounded-xl border text-[13px] font-semibold transition-all ${
      isLunch 
        ? 'bg-amber-50/60 border-amber-200 text-amber-900' 
        : isCeremony
        ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-bold'
        : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <div>{title}</div>
      {notes?.length > 0 && (
        <div className="text-[11px] font-normal text-slate-500 mt-0.5">
          {notes.join(' · ')}
        </div>
      )}
    </div>
  );
}

