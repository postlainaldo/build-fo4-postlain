'use client';

import React, { useState } from 'react';
import { Player, FormationName, PositionCoordinate } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface FootballFieldProps {
  formation: FormationName;
  selectedPlayers: Record<number, Player | null>;
  coordinates: PositionCoordinate[];
  onSlotClick: (index: number) => void;
  onRemovePlayer: (index: number, e: React.MouseEvent) => void;
}

const GET_SEASON_CARD_STYLE = (season: string) => {
  switch (season) {
    case 'ICON':
      return {
        bg: 'bg-gradient-to-b from-[#FFF59D] via-[#D4AF37] to-[#4E340E]',
        border: 'border-2 border-[#FFE082] shadow-[0_0_12px_rgba(212,175,55,0.4)]',
        text: 'text-black',
        numText: 'text-[#4E340E]',
        badgeBg: 'bg-black text-[#FFD700]',
      };
    case 'VNM':
      return {
        bg: 'bg-gradient-to-b from-[#FF5252] via-[#E53935] to-[#800000]',
        border: 'border-2 border-[#FFD54F] shadow-[0_0_12px_rgba(255,82,82,0.4)]',
        text: 'text-white',
        numText: 'text-yellow-300',
        badgeBg: 'bg-yellow-400 text-black',
      };
    case '24TOTY':
      return {
        bg: 'bg-gradient-to-b from-[#1A237E] via-[#0D1B2A] to-[#020617]',
        border: 'border-2 border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.5)]',
        text: 'text-white',
        numText: 'text-[#00FF87]',
        badgeBg: 'bg-cyan-500 text-black',
      };
    case '23UCL':
      return {
        bg: 'bg-gradient-to-b from-[#0D47A1] via-[#1A237E] to-[#120E2E]',
        border: 'border-2 border-[#42A5F5] shadow-[0_0_10px_rgba(66,165,245,0.4)]',
        text: 'text-white',
        numText: 'text-cyan-300',
        badgeBg: 'bg-blue-600 text-white',
      };
    case 'CC':
      return {
        bg: 'bg-gradient-to-b from-[#ECEFF1] via-[#546E7A] to-[#263238]',
        border: 'border-2 border-[#B0BEC5] shadow-[0_0_10px_rgba(176,190,197,0.3)]',
        text: 'text-white',
        numText: 'text-slate-300',
        badgeBg: 'bg-slate-700 text-white',
      };
    default:
      return {
        bg: 'bg-gradient-to-b from-[#374151] to-[#111827]',
        border: 'border-2 border-gray-600',
        text: 'text-white',
        numText: 'text-gray-300',
        badgeBg: 'bg-gray-700 text-white',
      };
  }
};

export default function FootballField({
  selectedPlayers,
  coordinates,
  onSlotClick,
  onRemovePlayer
}: FootballFieldProps) {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  return (
    <div className="relative w-full aspect-[3.2/4] bg-field-texture border border-emerald-900/60 rounded-2xl overflow-hidden shadow-inner select-none max-w-2xl mx-auto">
      
      {/* Các đường kẻ vạch trên sân bóng */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
        <div className="absolute inset-4 border border-white/10 rounded-lg" />
        <div className="absolute top-1/2 left-4 right-4 h-0 border-t border-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/20 rounded-full" />
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-x border-white/10" />
        <div className="absolute top-[84px] left-1/2 -translate-x-1/2 w-20 h-8 border border-t-0 border-white/10 rounded-b-full" />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-x border-white/10" />
        <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 w-20 h-8 border border-b-0 border-white/10 rounded-t-full" />
      </div>

      {/* Sắp xếp các thẻ cầu thủ lên sơ đồ */}
      {coordinates.map((pos, idx) => {
        const player = selectedPlayers[idx];
        const style = player ? GET_SEASON_CARD_STYLE(player.season) : null;
        const hasImgError = imgErrors[idx];

        return (
          <div
            key={idx}
            style={{ top: pos.top, left: pos.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer active:scale-95 group"
            onClick={() => onSlotClick(idx)}
          >
            {player && style ? (
              <div className="relative flex flex-col items-center animate-in fade-in-50 duration-200">
                
                {/* Nút xoá */}
                <button
                  onClick={(e) => onRemovePlayer(idx, e)}
                  className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 shadow-xl border border-red-950 z-30 transition opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                  title="Xoá cầu thủ khỏi đội hình"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* THẺ ĐỒ HỌA 3D CHUẨN FC ONLINE */}
                <div className={`relative flex flex-col items-center ${style.bg} ${style.border} rounded-t-xl rounded-b-md w-16 md:w-[76px] aspect-[1/1.42] overflow-hidden`}>
                  
                  {/* Dải chỉ số OVR & Lương trên cùng */}
                  <div className="flex items-center justify-between w-full text-[10px] md:text-xs font-black px-1.5 pt-1">
                    <span className={style.numText}>{player.rating}</span>
                    <span className="text-[8px] md:text-[9.5px] bg-black/45 text-white px-1 py-0.2 rounded border border-white/10">
                      {player.salary}
                    </span>
                  </div>

                  {/* Logo/Badge Mùa Thẻ */}
                  <div className={`mt-0.5 text-[7px] md:text-[8px] font-black px-1.5 py-0.2 rounded ${style.badgeBg} uppercase tracking-wider scale-90`}>
                    {player.season}
                  </div>

                  {/* Vùng chứa ảnh chân dung */}
                  <div className="flex-1 w-full flex items-end justify-center relative mt-0.5">
                    
                    {/* Bóng người Silhouette SVG */}
                    <div className="absolute inset-0 flex items-end justify-center opacity-40 z-0">
                      <svg className="w-11 h-11 text-white/35" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    {/* Ảnh thật của cầu thủ từ CDN FIFAAddict mới */}
                    {player.image && !hasImgError ? (
                      <img
                        src={player.image}
                        alt={player.displayName}
                        className="w-full h-[95%] object-contain relative z-10 scale-125 translate-y-1 transform transition duration-300 hover:scale-135"
                        onError={() => {
                          setImgErrors(prev => ({ ...prev, [idx]: true }));
                        }}
                      />
                    ) : null}

                  </div>

                  {/* Vạch vị trí chân thẻ cầu thủ */}
                  <div className="w-full text-center bg-black/40 py-0.5 text-[7px] md:text-[9px] font-bold text-[#00FF87] border-t border-white/10 z-20">
                    {pos.role}
                  </div>
                </div>

                {/* Nhãn Tên Cầu Thủ dưới thẻ */}
                <div className="mt-1.5 bg-slate-900/90 backdrop-blur-md border border-gray-800 text-white text-[9.5px] md:text-xs font-bold py-0.5 px-2 rounded-full text-center max-w-[90px] md:max-w-[110px] truncate shadow-lg">
                  {player.displayName}
                </div>
              </div>
            ) : (
              // Trạng thái slot trống
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 md:w-13 md:h-13 bg-slate-950/80 border-2 border-dashed border-emerald-500/40 hover:border-[#00FF87] rounded-full flex items-center justify-center text-[#00FF87] shadow-lg transition active:scale-90">
                  <Plus className="w-5 h-5 animate-pulse" />
                </div>
                <div className="mt-1.5 bg-slate-900/85 text-[9px] md:text-xs font-extrabold text-gray-300 py-0.5 px-2 rounded-full border border-gray-800">
                  {pos.role}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
