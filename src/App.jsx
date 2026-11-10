import React, { useState, useEffect, useCallback } from 'react';
import congressData from './data/congressData.json';
import Navbar from './components/Navbar';
import PinModal from './components/PinModal';
import PublicAgendaView from './views/PublicAgendaView';
import BrochurePrintView from './views/BrochurePrintView';
import CommitteeDashboard from './views/CommitteeDashboard';
import PhotoAuditView from './views/PhotoAuditView';

export default function App() {
  const [activeTab, setActiveTab] = useState('agenda');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCommitteeAuth, setIsCommitteeAuth] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Evalua la URL actual (hash, pathname o search params) para determinar vista y permisos
  const evaluateRoute = useCallback(() => {
    const auth = localStorage.getItem('unior_committee_auth') === 'true';
    setIsCommitteeAuth(auth);

    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const pathname = window.location.pathname.replace(/^\//, '').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const hasAdminParam = searchParams.has('admin');

    const adminRoutes = ['admin', 'comite', 'committee', 'programa', 'brochure', 'pdf', 'fotos', 'photos'];
    const isAdminRequested = adminRoutes.includes(hash) || adminRoutes.includes(pathname) || hasAdminParam;

    // Si se solicitó una ruta admin o ya está autenticado previamente, activar modo admin
    if (isAdminRequested || auth) {
      setIsAdminMode(true);

      if (hash === 'programa' || hash === 'brochure' || hash === 'pdf') {
        setActiveTab('brochure');
      } else if (hash === 'fotos' || hash === 'photos') {
        setActiveTab('photos');
      } else if (hash === 'admin' || hash === 'comite' || hash === 'committee' || pathname === 'admin') {
        if (auth) {
          setActiveTab('committee');
        } else {
          setActiveTab('agenda');
          setIsPinModalOpen(true);
        }
      } else if (hash === 'agenda') {
        setActiveTab('agenda');
      } else {
        // Default admin view
        setActiveTab(auth ? 'committee' : 'agenda');
      }
    } else {
      // Modo exclusivo público (Asistentes)
      setIsAdminMode(false);
      setActiveTab('agenda');
    }
  }, []);

  useEffect(() => {
    evaluateRoute();

    const handleHashChange = () => {
      evaluateRoute();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [evaluateRoute]);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'agenda') window.location.hash = '#/agenda';
    if (tab === 'brochure') window.location.hash = '#/programa';
    if (tab === 'committee') window.location.hash = '#/comite';
    if (tab === 'photos') window.location.hash = '#/fotos';
  };

  const handlePinSuccess = () => {
    setIsCommitteeAuth(true);
    setIsAdminMode(true);
    setIsPinModalOpen(false);
    setActiveTab('committee');
    window.location.hash = '#/comite';
  };

  const handleLogoutCommittee = () => {
    localStorage.removeItem('unior_committee_auth');
    setIsCommitteeAuth(false);
    setIsAdminMode(false);
    setActiveTab('agenda');
    window.location.hash = '#/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isCommitteeAuth={isCommitteeAuth}
        isAdminMode={isAdminMode}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onLogoutCommittee={handleLogoutCommittee}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'agenda' && (
          <PublicAgendaView congressData={congressData} />
        )}

        {isAdminMode && activeTab === 'brochure' && (
          <BrochurePrintView congressData={congressData} />
        )}

        {isAdminMode && activeTab === 'committee' && (
          <CommitteeDashboard congressData={congressData} />
        )}

        {isAdminMode && activeTab === 'photos' && (
          <PhotoAuditView congressData={congressData} />
        )}
      </main>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          // Si no completó auth y estaba en comite/admin, volver a agenda pública
          if (!isCommitteeAuth) {
            setActiveTab('agenda');
          }
        }}
        onSuccess={handlePinSuccess}
      />

      {/* Footer Info (Screen only) */}
      <footer className="no-print py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>1er Congreso Internacional de Integración Científica · Universidad Privada de Oruro (UNIOR)</p>
        <p className="text-[11px] text-slate-400 mt-1">12 y 13 de Noviembre de 2026 · Hotel Edén, Oruro, Bolivia</p>
        <p className="text-[15px] text-slate-400 mt-3 font-medium">Desarrollado por <span className="text-sky-800">NettiDev</span></p>
      </footer>
    </div>
  );
}

