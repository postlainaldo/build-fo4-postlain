'use client';

import React, { useState } from 'react';
import { Player, FormationName } from '@/types';
import { encodeSquadState } from '@/lib/utils';
import { Share2, Bookmark, Check, Copy, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareSavePanelProps {
  formation: FormationName;
  selectedPlayers: Record<number, Player | null>;
  currentCap: number;
  onClearSquad: () => void;
}

export default function ShareSavePanel({
  formation,
  selectedPlayers,
  currentCap,
  onClearSquad
}: ShareSavePanelProps) {
  const [copied, setCopied] = useState(false);
  const [savedName, setSavedName] = useState('Đội Hình Siêu Cấp');

  const getShareUrl = () => {
    const playerIds: Record<number, string | null> = {};
    Object.keys(selectedPlayers).forEach(k => {
      const idx = parseInt(k);
      playerIds[idx] = selectedPlayers[idx]?.id || null;
    });

    const encodedState = encodeSquadState(formation, playerIds, currentCap);
    if (typeof window !== 'undefined') {
      return `${window.location.origin}?s=${encodedState}`;
    }
    return '';
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 }
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Không thể copy link vào clipboard', err);
    }
  };

  const handleSaveToLocal = () => {
    try {
      const payload = {
        name: savedName,
        formation,
        players: Object.keys(selectedPlayers).reduce((acc, curr) => {
          const idx = parseInt(curr);
          acc[idx] = selectedPlayers[idx]?.id || null;
          return acc;
        }, {} as Record<number, string | null>),
        cap: currentCap
      };
      localStorage.setItem('fo4_saved_squad', JSON.stringify(payload));
      alert('Đã lưu cấu hình đội hình vào trình duyệt của bạn!');
    } catch (err) {
      alert('Không thể lưu cấu hình đội hình!');
    }
  };

  return (
    <div className="bg-fo4-card border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
        <Share2 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
          Chia Sẻ & Lưu Trữ
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1">Tên Đội Hình</label>
          <input
            type="text"
            value={savedName}
            onChange={(e) => setSavedName(e.target.value)}
            className="w-full bg-[#0B0F19] border border-gray-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FF87]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center space-x-2 bg-fo4-accent text-fo4-dark hover:bg-emerald-400 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>ĐÃ COPY LINK</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>SAO CHÉP LINK</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveToLocal}
            className="flex items-center justify-center space-x-2 bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
            <span>LƯU LOCAL</span>
          </button>
        </div>

        <button
          onClick={onClearSquad}
          className="w-full flex items-center justify-center space-x-1.5 text-xs text-rose-500 hover:text-rose-400 border border-rose-950/50 hover:border-rose-700/50 bg-rose-950/20 py-2.5 rounded-xl font-bold transition mt-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>XOÁ SẠCH LÀM LẠI</span>
        </button>
      </div>
    </div>
  );
}
