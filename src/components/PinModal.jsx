import React, { useState } from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';

export default function PinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (cleanPin === '102334') {
      localStorage.setItem('unior_committee_auth', 'true');
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-150">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 text-center">Acceso del Comité</h3>
        <p className="text-xs text-slate-500 text-center mt-1 mb-5">
          Ingresa el PIN de organizador para acceder a la gestión de cruces, salas y auditoría.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña / PIN de acceso
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="Ingresa el PIN de seguridad"
              autoFocus
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all outline-hidden ${
                error 
                  ? 'border-red-500 ring-2 ring-red-200 bg-red-50/50' 
                  : 'border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-100'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 mt-1.5 font-medium">
                PIN incorrecto. Verifica los dígitos e intenta nuevamente.
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-unior-wine text-white text-sm font-semibold hover:bg-unior-darkWine shadow-sm transition-all"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

