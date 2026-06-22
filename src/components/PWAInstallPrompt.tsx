'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Đã cài đặt app FO4 Squad Master.');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-md bg-fo4-card border border-fo4-accent/30 rounded-xl p-4 shadow-2xl flex items-center justify-between animate-bounce-short">
      <div className="flex items-center space-x-3">
        <div className="bg-fo4-accent/10 p-2.5 rounded-lg text-fo4-accent">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Cài đặt FO4 Squad Master</h3>
          <p className="text-gray-400 text-xs">Dùng mượt giống hệt ứng dụng gốc</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstallClick}
          className="flex items-center space-x-1.5 bg-fo4-accent hover:bg-emerald-400 text-fo4-dark font-bold text-xs px-3 py-2 rounded-lg transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CÀI ĐẶT</span>
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
