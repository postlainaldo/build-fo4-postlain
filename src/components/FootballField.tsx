'use client';

import React from 'react';
import { Player, FormationName, PositionCoordinate } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface FootballFieldProps {
  formation: FormationName;
  selectedPlayers: Record<number, Player | null>;
  coordinates: PositionCoordinate[];
  onSlotClick: (index: number) => void;
  onRemovePlayer: (index: number, e: React.MouseEvent) => void;
}

export default function FootballField({
  formation,
  selectedPlayers,
  coordinates,
  onSlotClick,
  onRemovePlayer
}: FootballFieldProps) {
  return (
    <div className="relative w-full aspect-[3.2/4] bg-field-texture border border-emerald-900/60 rounded-2xl overflow-hidden shadow-inner select-none max-w-2xl mx-auto">
      
      {/* Các đường kẻ vạch trên sân bóng */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
        {/* Đường biên ngoài */}
        <div className="absolute inset-4 border border-white/10 rounded-lg" />
        {/* Đường giữa sân */}
        <div className="absolute top-1/2 left-4 right-4 h-0 border-t border-white/10" />
        {/* Vòng tròn trung tâm */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/20 rounded-full" />
        
        {/* Vòng cấm địa phía trên */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-x border-white/10" />
        <div className="absolute top-[84px] left-1/2 -translate-x-1/2 w-20 h-8 border border-t-0 border-white/10 rounded-b-full" />
        
        {/* Vòng cấm địa phía dưới */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-x border-white/10" />
        <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 w-20 h-8 border border-b-0 border-white/10 rounded-t-full" />
      </div>

      {/* Sắp xếp các thẻ cầu thủ lên sơ đồ */}
      {coordinates.map((pos, idx) => {
        const player = selectedPlayers[idx];

        return (
          <div
            key={idx}
            style={{ top: pos.top, left: pos.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer active:scale-95 group"
            onClick={() => onSlotClick(idx)}
          >
            {player ? (
              <div className="relative flex flex-col items-center">
                {/* Nút xoá */}
                <button
                  onClick={(e) => onRemovePlayer(idx, e)}
                  className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 shadow-lg border border-red-900 z-30 transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  title="Xoá cầu thủ khỏi đội hình"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Thẻ cầu thủ */}
                <div className="flex flex-col items-center bg-[#101726]/95 border border-fo4-gold/40 rounded-lg p-1.5 w-16 md:w-20 shadow-md">
                  <div className="flex items-center justify-between w-full text-[10px] md:text-xs font-bold px-0.5 border-b border-gray-700/50 pb-0.5">
                    <span className="text-fo4-gold">{player.rating}</span>
                    <span className="text-gray-300 bg-gray-800 rounded px-1 text-[8px] md:text-[10px]">
                      {player.salary}
                    </span>
                  </div>

                  <div className="my-1 text-[8px] font-extrabold px-1.5 py-0.2 rounded bg-fo4-gold text-black scale-90 md:scale-100">
                    {player.season}
                  </div>

                  <div className={`w-8 h-8 rounded-full ${player.avatarColor || 'bg-blue-900'} flex items-center justify-center text-white font-extrabold text-[10px] md:text-xs uppercase shadow`}>
                    {player.name.substring(0, 2)}
                  </div>

                  <div className="text-[7px] md:text-[9px] text-[#00FF87] font-semibold mt-1 bg-emerald-950/65 px-1 rounded border border-emerald-500/20">
                    {pos.role}
                  </div>
                </div>

                <div className="mt-1 bg-black/85 backdrop-blur-sm border border-gray-800 text-white text-[9px] md:text-xs font-semibold py-0.5 px-1.5 rounded-full text-center max-w-[85px] md:max-w-[105px] truncate shadow">
                  {player.displayName}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0B0F19]/90 border-2 border-dashed border-emerald-500/40 hover:border-[#00FF87] rounded-full flex items-center justify-center text-[#00FF87] shadow-lg transition">
                  <Plus className="w-5 h-5 animate-pulse" />
                </div>
                <div className="mt-1 bg-black/75 text-[9px] md:text-xs font-bold text-gray-300 py-0.5 px-2 rounded-full border border-gray-800">
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
