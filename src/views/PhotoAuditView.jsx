import React, { useState, useMemo } from 'react';
import { Camera, Check, Copy, Search, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import SpeakerAvatar from '../components/SpeakerAvatar';
import { SPEAKER_PHOTO_MAP } from '../data/speakerPhotos';

export default function PhotoAuditView({ congressData }) {
  const { sessions, careers } = congressData;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, with_photo, without_photo
  const [copiedSlug, setCopiedSlug] = useState(null);

  // Extract unique speakers with all their sessions
  const speakersList = useMemo(() => {
    const map = {};

    sessions.forEach((s) => {
      s.speakers?.forEach((sp) => {
        if (!map[sp.s]) {
          const hasPhoto = Boolean(SPEAKER_PHOTO_MAP[sp.s]);
          map[sp.s] = {
            speaker: sp,
            country: s.country,
            career: s.careers?.[0] ? careers[s.careers[0]]?.name : null,
            hasPhoto,
            photoFile: SPEAKER_PHOTO_MAP[sp.s] || null,
            sessions: []
          };
        }
        map[sp.s].sessions.push(s);
      });
    });

    return Object.values(map).sort((a, b) => a.speaker.d.localeCompare(b.speaker.d));
  }, [sessions, careers]);

  const countWithPhoto = useMemo(() => speakersList.filter(s => s.hasPhoto).length, [speakersList]);
  const countWithoutPhoto = speakersList.length - countWithPhoto;

  const filtered = useMemo(() => {
    return speakersList.filter(item => {
      if (filterStatus === 'with_photo' && !item.hasPhoto) return false;
      if (filterStatus === 'without_photo' && item.hasPhoto) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.speaker.n.toLowerCase().includes(q) || 
        item.speaker.s.toLowerCase().includes(q) ||
        (item.career || '').toLowerCase().includes(q)
      );
    });
  }, [speakersList, search, filterStatus]);

  const handleCopyName = (slug) => {
    const filename = `${slug}.jpg`;
    navigator.clipboard.writeText(filename);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 1800);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-unior-wine text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5" />
              Gestión y Auditoría de Fotografías
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Fotos de Expositores Oficiales
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Monitoreo del estado de fotografías para el folleto. Las banderas de país se generan automáticamente mediante <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">flag-icons</code>.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-2xl font-black text-emerald-800 block">{countWithPhoto}</span>
              <span className="text-[11px] font-bold text-emerald-700">Con Foto</span>
            </div>
            <div className="text-center px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-2xl font-black text-amber-800 block">{countWithoutPhoto}</span>
              <span className="text-[11px] font-bold text-amber-700">Pendientes</span>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({speakersList.length})
          </button>
          <button
            onClick={() => setFilterStatus('with_photo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'with_photo' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Con foto ({countWithPhoto})
          </button>
          <button
            onClick={() => setFilterStatus('without_photo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'without_photo' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pendientes ({countWithoutPhoto})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar expositor por nombre o carrera..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-500 bg-white shadow-2xs"
        />
      </div>

      {/* Grid of Speakers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(({ speaker, country, career, hasPhoto, photoFile, sessions: spSessions }) => {
          const isCopied = copiedSlug === speaker.s;

          return (
            <div 
              key={speaker.s}
              className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-xs transition-all flex gap-3.5 items-start ${
                hasPhoto ? 'border-slate-200' : 'border-amber-200/80 bg-amber-50/20'
              }`}
            >
              {/* Avatar with country flag */}
              <SpeakerAvatar
                speaker={speaker}
                country={country}
                size="lg"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                    {speaker.n}
                  </h4>
                  {hasPhoto ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" title="Foto cargada" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" title="Foto pendiente" />
                  )}
                </div>
                
                {career && (
                  <span className="inline-block text-[11px] font-semibold text-slate-500 mt-0.5">
                    {career}
                  </span>
                )}

                {/* Status / Copy Filename Button */}
                <div className="mt-2.5">
                  {hasPhoto ? (
                    <span className="inline-block text-[10.5px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md truncate max-w-full">
                      {photoFile}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCopyName(speaker.s)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                      }`}
                      title="Copiar nombre de archivo esperado"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-amber-700" />
                          <span className="truncate max-w-[130px]">{speaker.s}.jpg</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Sessions list */}
                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  {spSessions.length} {spSessions.length === 1 ? 'ponencia' : 'ponencias'} asignadas
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
