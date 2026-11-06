import React from 'react';
import { Calendar, FileDown, ShieldAlert, Image, Lock, Unlock } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab, isCommitteeAuth, isAdminMode, onOpenPinModal, onLogoutCommittee }) {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img 
              src="/assets/logos/unior-logo.png" 
              alt="UNIOR" 
              className="h-9 w-auto object-contain"
            />
            <div className="border-l border-slate-200 pl-3 hidden sm:block">
              <h1 className="text-xs font-black text-slate-900 tracking-tight leading-tight uppercase">
                1er Congreso Internacional de Integración Científica
              </h1>
              <p className="text-[10.5px] text-slate-500 font-medium">
                12 y 13 de Noviembre 2026 · Hotel Edén, Oruro
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          {isAdminMode ? (
            /* Admin & Committee Navigation */
            <nav className="flex items-center gap-1.5 sm:gap-2">
              {/* 1. Public Agenda */}
              <button
                onClick={() => onSelectTab('agenda')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'agenda'
                    ? 'bg-rose-50 text-unior-wine shadow-xs border border-rose-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Agenda Asistentes</span>
              </button>

              {/* 2. Brochure PDF Designer */}
              <button
                onClick={() => onSelectTab('brochure')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'brochure'
                    ? 'bg-rose-50 text-unior-wine shadow-xs border border-rose-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileDown className="w-4 h-4" />
                <span>Folleto PDF</span>
              </button>

              {/* 3. Committee Dashboard */}
              <button
                onClick={() => {
                  if (isCommitteeAuth) {
                    onSelectTab('committee');
                  } else {
                    onOpenPinModal();
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'committee'
                    ? 'bg-amber-50 text-amber-900 shadow-xs border border-amber-300'
                    : isCommitteeAuth
                    ? 'text-amber-800 hover:bg-amber-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Panel Comité</span>
                {!isCommitteeAuth && (
                  <Lock className="w-3 h-3 text-slate-400 ml-0.5" />
                )}
              </button>

              {/* 4. Photo Manager */}
              <button
                onClick={() => onSelectTab('photos')}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'photos'
                    ? 'bg-rose-50 text-unior-wine shadow-xs border border-rose-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Auditoría de fotos de expositores"
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Fotos</span>
              </button>

              {/* Auth status indicator & Logout */}
              {isCommitteeAuth && (
                <button
                  onClick={onLogoutCommittee}
                  title="Cerrar sesión de administrador / volver a vista pública"
                  className="ml-1 p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span className="hidden md:inline text-[11px] text-slate-500">Salir</span>
                </button>
              )}
            </nav>
          ) : (
            /* Public View (Attendees Only): Clean header with badge */
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-unior-wine text-xs font-bold border border-rose-200/60 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-unior-coral" />
                <span>Agenda Asistentes</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
