'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Player, FormationName } from '@/types';
import { decodeSquadState } from '@/lib/utils';
import { PLAYERS_DB } from '@/data/players';

import FootballField from '@/components/FootballField';
import PlayerSelectorModal from '@/components/PlayerSelectorModal';
import SquadStats from '@/components/SquadStats';
import TeamColorDisplay from '@/components/TeamColorDisplay';
import ShareSavePanel from '@/components/ShareSavePanel';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

import { ShieldAlert, ChevronDown, Coins, Users, Award, TrendingUp } from 'lucide-react';

const FORMATIONS: Record<FormationName, { role: string; top: string; left: string }[]> = {
  '4-2-3-1': [
    { role: 'GK', top: '88%', left: '50%' },
    { role: 'LB', top: '72%', left: '12%' },
    { role: 'LCB', top: '75%', left: '35%' },
    { role: 'RCB', top: '75%', left: '65%' },
    { role: 'RB', top: '72%', left: '88%' },
    { role: 'LDM', top: '56%', left: '35%' },
    { role: 'RDM', top: '56%', left: '65%' },
    { role: 'LAM', top: '35%', left: '15%' },
    { role: 'CAM', top: '30%', left: '50%' },
    { role: 'RAM', top: '35%', left: '85%' },
    { role: 'ST', top: '12%', left: '50%' },
  ],
  '4-3-3': [
    { role: 'GK', top: '88%', left: '50%' },
    { role: 'LB', top: '72%', left: '12%' },
    { role: 'LCB', top: '75%', left: '35%' },
    { role: 'RCB', top: '75%', left: '65%' },
    { role: 'RB', top: '72%', left: '88%' },
    { role: 'LCM', top: '52%', left: '25%' },
    { role: 'CM', top: '56%', left: '50%' },
    { role: 'RCM', top: '52%', left: '75%' },
    { role: 'LW', top: '22%', left: '15%' },
    { role: 'ST', top: '12%', left: '50%' },
    { role: 'RW', top: '22%', left: '85%' },
  ],
  '4-1-2-3': [
    { role: 'GK', top: '88%', left: '50%' },
    { role: 'LB', top: '72%', left: '12%' },
    { role: 'LCB', top: '75%', left: '35%' },
    { role: 'RCB', top: '75%', left: '65%' },
    { role: 'RB', top: '72%', left: '88%' },
    { role: 'CDM', top: '58%', left: '50%' },
    { role: 'LCM', top: '44%', left: '28%' },
    { role: 'RCM', top: '44%', left: '72%' },
    { role: 'LW', top: '20%', left: '15%' },
    { role: 'ST', top: '12%', left: '50%' },
    { role: 'RW', top: '20%', left: '85%' },
  ],
  '5-2-3': [
    { role: 'GK', top: '88%', left: '50%' },
    { role: 'LWB', top: '68%', left: '10%' },
    { role: 'LCB', top: '75%', left: '28%' },
    { role: 'CB', top: '76%', left: '50%' },
    { role: 'RCB', top: '75%', left: '72%' },
    { role: 'RWB', top: '68%', left: '90%' },
    { role: 'LCM', top: '48%', left: '33%' },
    { role: 'RCM', top: '48%', left: '67%' },
    { role: 'LW', top: '20%', left: '15%' },
    { role: 'ST', top: '12%', left: '50%' },
    { role: 'RW', top: '20%', left: '85%' },
  ],
  '3-5-2': [
    { role: 'GK', top: '88%', left: '50%' },
    { role: 'LCB', top: '75%', left: '25%' },
    { role: 'CB', top: '76%', left: '50%' },
    { role: 'RCB', top: '75%', left: '75%' },
    { role: 'LDM', top: '56%', left: '35%' },
    { role: 'RDM', top: '56%', left: '65%' },
    { role: 'LM', top: '40%', left: '12%' },
    { role: 'CAM', top: '34%', left: '50%' },
    { role: 'RM', top: '40%', left: '88%' },
    { role: 'LS', top: '14%', left: '33%' },
    { role: 'RS', top: '14%', left: '67%' },
  ]
};

const SALARY_CAPS = [255, 260, 290, 300];

function SquadBuilderContent() {
  const searchParams = useSearchParams();

  const [formation, setFormation] = useState<FormationName>('4-2-3-1');
  const [salaryCap, setSalaryCap] = useState<number>(300);
  const [selectedPlayers, setSelectedPlayers] = useState<Record<number, Player | null>>({
    0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  useEffect(() => {
    const shareToken = searchParams.get('s');
    if (shareToken) {
      const decoded = decodeSquadState(shareToken);
      if (decoded) {
        if (decoded.formation in FORMATIONS) {
          setFormation(decoded.formation as FormationName);
        }
        if (decoded.cap) {
          setSalaryCap(decoded.cap);
        }
        
        const rehydrated: Record<number, Player | null> = {};
        for (let idx = 0; idx < 11; idx++) {
          const pId = decoded.players[idx];
          if (pId) {
            const playerDef = PLAYERS_DB.find(p => p.id === pId);
            rehydrated[idx] = playerDef || null;
          } else {
            rehydrated[idx] = null;
          }
        }
        setSelectedPlayers(rehydrated);
      }
    } else {
      const local = localStorage.getItem('fo4_saved_squad');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed && parsed.formation in FORMATIONS) {
            setFormation(parsed.formation);
            setSalaryCap(parsed.cap || 300);
            
            const rehydrated: Record<number, Player | null> = {};
            for (let idx = 0; idx < 11; idx++) {
              const pId = parsed.players[idx];
              if (pId) {
                const playerDef = PLAYERS_DB.find(p => p.id === pId);
                rehydrated[idx] = playerDef || null;
              } else {
                rehydrated[idx] = null;
              }
            }
            setSelectedPlayers(rehydrated);
          }
        } catch (_) {}
      }
    }
  }, [searchParams]);

  const handleSlotClick = (index: number) => {
    setActiveSlotIndex(index);
    setIsModalOpen(true);
  };

  const handleSelectPlayer = (player: Player) => {
    if (activeSlotIndex !== null) {
      setSelectedPlayers(prev => ({
        ...prev,
        [activeSlotIndex]: player
      }));
    }
    setIsModalOpen(false);
    setActiveSlotIndex(null);
  };

  const handleRemovePlayer = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlayers(prev => ({
      ...prev,
      [index]: null
    }));
  };

  const handleClearSquad = () => {
    if (confirm('Bạn có chắc chắn muốn xoá toàn bộ đội hình hiện tại không?')) {
      setSelectedPlayers({
        0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, 10: null
      });
      localStorage.removeItem('fo4_saved_squad');
    }
  };

  const activePlayers = Object.values(selectedPlayers).filter((p): p is Player => p !== null);
  
  // TÍNH TOÁN THEO THỜI GIAN THỰC
  const totalSalary = activePlayers.reduce((acc, p) => acc + p.salary, 0);
  const totalValue = activePlayers.reduce((acc, p) => acc + p.value, 0);
  
  const avgOVR = activePlayers.length > 0 
    ? Math.round(activePlayers.reduce((acc, p) => acc + p.rating, 0) / activePlayers.length) 
    : 0;

  const isOverSalary = totalSalary > salaryCap;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Cột trái: Sân bóng và Bộ điều khiển */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
          <div className="bg-fo4-card border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Lựa chọn sơ đồ chiến thuật */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Chiến thuật:</span>
              <div className="relative">
                <select
                  value={formation}
                  onChange={(e) => setFormation(e.target.value as FormationName)}
                  className="bg-[#0B0F19] text-white border border-gray-700/80 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer focus:outline-none focus:border-fo4-accent appearance-none pr-8 min-h-[44px]"
                >
                  {Object.keys(FORMATIONS).map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Chọn mốc lương trần */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Giới hạn lương:</span>
              <div className="flex bg-[#0B0F19] rounded-xl p-1 border border-gray-700/80">
                {SALARY_CAPS.map(cap => (
                  <button
                    key={cap}
                    onClick={() => setSalaryCap(cap)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer min-h-[36px] transition-all ${
                      salaryCap === cap 
                        ? 'bg-fo4-accent text-fo4-dark shadow-md' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <FootballField
            formation={formation}
            selectedPlayers={selectedPlayers}
            coordinates={FORMATIONS[formation]}
            onSlotClick={handleSlotClick}
            onRemovePlayer={handleRemovePlayer}
          />
        </div>

        {/* Cột phải: Thống kê chỉ số, Team Color, Chia sẻ */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6">
          
          <div className="bg-fo4-card border border-gray-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-fo4-accent/10 to-transparent rounded-full -mr-6 -mt-6 pointer-events-none" />
            
            {/* THỐNG KÊ 3 CHỈ SỐ CỐT LÕI (BỔ SUNG THÊM GIÁ TRỊ ĐỘI HÌNH TRÊN DI ĐỘNG) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
              
              {/* OVR */}
              <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-2.5 sm:p-3 text-center flex flex-col justify-center">
                <span className="text-gray-400 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider block mb-1">
                  OVR ĐỘI HÌNH
                </span>
                <div className="flex items-center justify-center space-x-1">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fo4-gold" />
                  <span className="text-sm sm:text-lg font-black text-white">{avgOVR || '--'}</span>
                </div>
              </div>

              {/* LƯƠNG */}
              <div className={`border rounded-xl p-2.5 sm:p-3 text-center flex flex-col justify-center transition-all ${
                isOverSalary 
                  ? 'bg-red-950/20 border-red-700/50' 
                  : 'bg-[#0B0F19] border-gray-800'
              }`}>
                <span className="text-gray-400 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider block mb-1">
                  LƯƠNG ĐÃ DÙNG
                </span>
                <div className="flex items-center justify-center space-x-1">
                  <Coins className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isOverSalary ? 'text-red-500' : 'text-fo4-accent'}`} />
                  <span className={`text-sm sm:text-lg font-black ${isOverSalary ? 'text-red-500' : 'text-white'}`}>
                    {totalSalary}
                  </span>
                  <span className="text-[10px] text-gray-500">/{salaryCap}</span>
                </div>
              </div>

              {/* GIÁ TRỊ ĐỘI HÌNH (MỚI BỔ SUNG) */}
              <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-2.5 sm:p-3 text-center flex flex-col justify-center">
                <span className="text-gray-400 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider block mb-1">
                  GIÁ TRỊ ĐỘI
                </span>
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD700]" />
                  <span className="text-sm sm:text-lg font-black text-[#FFD700]">
                    {totalValue.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold">Tỷ</span>
                </div>
              </div>

            </div>

            {/* Cảnh báo nếu vượt quá lương */}
            {isOverSalary && (
              <div className="mt-3 flex items-center space-x-2 bg-red-950/40 border border-red-700/40 p-3 rounded-xl text-red-400 animate-pulse">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p className="text-[11px] font-bold leading-normal">
                  Đội hình vượt quá quỹ lương ({salaryCap} FP)! Hãy giảm lương cầu thủ để tham gia đá xếp hạng.
                </p>
              </div>
            )}
          </div>

          <TeamColorDisplay selectedPlayers={selectedPlayers} />

          <SquadStats selectedPlayers={selectedPlayers} />

          <ShareSavePanel
            formation={formation}
            selectedPlayers={selectedPlayers}
            currentCap={salaryCap}
            onClearSquad={handleClearSquad}
          />
        </div>

      </div>

      {isModalOpen && activeSlotIndex !== null && (
        <PlayerSelectorModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveSlotIndex(null);
          }}
          onSelectPlayer={handleSelectPlayer}
          targetRole={FORMATIONS[formation][activeSlotIndex]?.role || 'N/A'}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="bg-fo4-card border-b border-gray-800 py-4 px-6 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-[#00FF87] text-[#0B0F19] p-1.5 rounded-lg font-black text-xs">
              FCO
            </div>
            <div>
              <h1 className="text-white font-black text-sm md:text-base uppercase tracking-wider">
                FO4 Squad Master
              </h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">Trình xây dựng đội hình tối ưu cho FC Online</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-[#0B0F19]/80 border border-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300">
            <Users className="w-4 h-4 text-[#00FF87]" />
            <span>Mùa Giải 2026</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Đang tải kho dữ liệu cầu thủ...
          </div>
        }>
          <SquadBuilderContent />
        </Suspense>
      </main>

      <footer className="bg-fo4-card border-t border-gray-800 py-5 text-center text-xs text-gray-500">
        <p>© 2026 FO4 Squad Master. Dành riêng cho cộng đồng game thủ FC Online Việt Nam.</p>
      </footer>

      <PWAInstallPrompt />
    </>
  );
}