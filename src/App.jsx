import React, { useState, useEffect } from 'react';
import congressData from './data/congressData.json';
import Navbar from './components/Navbar';
import PinModal from './components/PinModal';
import PublicAgendaView from './views/PublicAgendaView';
import BrochurePrintView from './views/BrochurePrintView';
import CommitteeDashboard from './views/CommitteeDashboard';
import PhotoAuditView from './views/PhotoAuditView';

export default function App() {
  const [activeTab, setActiveTab] = useState('agenda');
  const [isCommitteeAuth, setIsCommitteeAuth] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Check auth and initial hash on mount
  useEffect(() => {
    const auth = localStorage.getItem('unior_committee_auth') === 'true';
    setIsCommitteeAuth(auth);

    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'programa' || hash === 'brochure' || hash === 'pdf') {
      setActiveTab('brochure');
    } else if (hash === 'comite' || hash === 'committee' || hash === 'admin') {
      if (auth) {
        setActiveTab('committee');
      } else {
        setIsPinModalOpen(true);
      }
    } else if (hash === 'fotos' || hash === 'photos') {
      setActiveTab('photos');
    } else {
      setActiveTab('agenda');
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#/', '').replace('#', '');
      if (newHash === 'programa' || newHash === 'brochure' || newHash === 'pdf') {
        setActiveTab('brochure');
      } else if (newHash === 'comite' || newHash === 'committee') {
        if (localStorage.getItem('unior_committee_auth') === 'true') {
          setActiveTab('committee');
        } else {
          setIsPinModalOpen(true);
        }
      } else if (newHash === 'fotos') {
        setActiveTab('photos');
      } else {
        setActiveTab('agenda');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'agenda') window.location.hash = '#/';
    if (tab === 'brochure') window.location.hash = '#/programa';
    if (tab === 'committee') window.location.hash = '#/comite';
    if (tab === 'photos') window.location.hash = '#/fotos';
  };

  const handlePinSuccess = () => {
    setIsCommitteeAuth(true);
    setIsPinModalOpen(false);
    setActiveTab('committee');
    window.location.hash = '#/comite';
  };

  const handleLogoutCommittee = () => {
    localStorage.removeItem('unior_committee_auth');
    setIsCommitteeAuth(false);
    if (activeTab === 'committee') {
      setActiveTab('agenda');
      window.location.hash = '#/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isCommitteeAuth={isCommitteeAuth}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onLogoutCommittee={handleLogoutCommittee}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'agenda' && (
          <PublicAgendaView congressData={congressData} />
        )}

        {activeTab === 'brochure' && (
          <BrochurePrintView congressData={congressData} />
        )}

        {activeTab === 'committee' && (
          <CommitteeDashboard congressData={congressData} />
        )}

        {activeTab === 'photos' && (
          <PhotoAuditView congressData={congressData} />
        )}
      </main>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Footer Info (Screen only) */}
      <footer className="no-print py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>1er Congreso Internacional de Integración Científica · Universidad Privada de Oruro (UNIOR)</p>
        <p className="text-[11px] text-slate-400 mt-1">12 y 13 de Noviembre de 2026 · Hotel Edén, Oruro, Bolivia</p>
      </footer>
    </div>
  );
}

