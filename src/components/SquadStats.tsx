'use client';

import React from 'react';
import { Player } from '@/types';
import { Activity } from 'lucide-react';

interface SquadStatsProps {
  selectedPlayers: Record<number, Player | null>;
}

export default function SquadStats({ selectedPlayers }: SquadStatsProps) {
  const players = Object.values(selectedPlayers).filter((p): p is Player => p !== null);

  const calculateAverageStat = (key: keyof Player['stats']) => {
    if (players.length === 0) return 0;
    const total = players.reduce((acc, p) => acc + p.stats[key], 0);
    return Math.round(total / players.length);
  };

  const avgPace = calculateAverageStat('pace');
  const avgShooting = calculateAverageStat('shooting');
  const avgPassing = calculateAverageStat('passing');
  const avgDribbling = calculateAverageStat('dribbling');
  const avgDefending = calculateAverageStat('defending');
  const avgPhysical = calculateAverageStat('physicality');

  return (
    <div className="bg-fo4-card border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
        <Activity className="w-5 h-5 text-fo4-accent" />
        <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
          Chỉ Số Trung Bình Đội Hình
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Tốc độ */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-xs text-gray-400">Tốc Độ (PAC)</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-lg font-extrabold text-[#00FF87]">{avgPace || '--'}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${Math.min(avgPace, 120) / 1.2}%` }} className="bg-[#00FF87] h-full rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* Dứt điểm */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-xs text-gray-400">Dứt Điểm (SHO)</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-lg font-extrabold text-fo4-gold">{avgShooting || '--'}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${Math.min(avgShooting, 120) / 1.2}%` }} className="bg-fo4-gold h-full rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* Chuyền bóng */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-xs text-gray-400">Chuyền Bóng (PAS)</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-lg font-extrabold text-cyan-400">{avgPassing || '--'}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${Math.min(avgPassing, 120) / 1.2}%` }} className="bg-cyan-400 h-full rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* Rê bóng */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-xs text-gray-400">Rê Bóng (DRI)</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-lg font-extrabold text-purple-400">{avgDribbling || '--'}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${Math.min(avgDribbling, 120) / 1.2}%` }} className="bg-purple-400 h-full rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* Phòng thủ */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-xs text-gray-400">Phòng Thủ (DEF)</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-lg font-extrabold text-orange-400">{avgDefending || '--'}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${Math.min(avgDefending, 120) / 1.2}%` }} className="bg-orange-400 h-full rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* Thể chất */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-xs text-gray-400">Thể Chất (PHY)</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-lg font-extrabold text-rose-500">{avgPhysical || '--'}</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${Math.min(avgPhysical, 120) / 1.2}%` }} className="bg-rose-500 h-full rounded-full transition-all duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
            }
