'use client';

import React, { useMemo } from 'react';
import { Player, TeamColor } from '@/types';
import { TEAM_COLORS_DB } from '@/data/teamColors';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

interface TeamColorDisplayProps {
  selectedPlayers: Record<number, Player | null>;
}

export default function TeamColorDisplay({ selectedPlayers }: TeamColorDisplayProps) {
  const activePlayers = useMemo(() => {
    return Object.values(selectedPlayers).filter((p): p is Player => p !== null);
  }, [selectedPlayers]);

  const activeTeamColors = useMemo(() => {
    if (activePlayers.length === 0) return [];

    const activeList: { teamColor: TeamColor; currentCount: number }[] = [];

    const clubCounts: Record<string, number> = {};
    const nationCounts: Record<string, number> = {};

    activePlayers.forEach(p => {
      if (p.club) {
        clubCounts[p.club] = (clubCounts[p.club] || 0) + 1;
      }
      if (p.nationality) {
        nationCounts[p.nationality] = (nationCounts[p.nationality] || 0) + 1;
      }
    });

    TEAM_COLORS_DB.forEach(color => {
      let calculatedCount = 0;
      if (color.type === 'club') {
        if (color.id === 'tc-chelsea') calculatedCount = clubCounts['Chelsea'] || 0;
        if (color.id === 'tc-real') calculatedCount = clubCounts['Real Madrid'] || 0;
        if (color.id === 'tc-manutd') calculatedCount = clubCounts['Manchester United'] || 0;
      } else if (color.type === 'nationality') {
        if (color.id === 'tc-vietnam') calculatedCount = nationCounts['Vietnam'] || 0;
      }

      if (calculatedCount >= color.requirement) {
        activeList.push({ teamColor: color, currentCount: calculatedCount });
      }
    });

    return activeList;
  }, [activePlayers]);

  return (
    <div className="bg-fo4-card border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
        <Trophy className="w-5 h-5 text-fo4-gold" />
        <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
          Kích Hoạt Team Color ({activeTeamColors.length})
        </h3>
      </div>

      {activeTeamColors.length > 0 ? (
        <div className="space-y-3">
          {activeTeamColors.map(({ teamColor, currentCount }) => (
            <div
              key={teamColor.id}
              className="bg-[#0B0F19] border border-[#FFD700]/30 rounded-xl p-3.5 space-y-2 animate-pulse-short"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF87]" />
                  <span className="text-white font-bold text-sm">{teamColor.name}</span>
                </div>
                <span className="text-xs bg-emerald-950/80 border border-emerald-500/30 text-[#00FF87] px-2 py-0.5 rounded-full font-bold">
                  {currentCount} Cầu thủ
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-800/60">
                {teamColor.statBoosts.map((boost, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[10px] font-bold bg-[#1B273C] text-gray-200 px-2.5 py-1 rounded border border-gray-700"
                  >
                    {boost.statName} +{boost.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 text-center text-gray-500">
          <Sparkles className="w-9 h-9 mx-auto text-gray-700 mb-2" />
          <p className="text-xs font-semibold">Chưa kích hoạt Team Color nào</p>
          <p className="text-[10px] mt-1 max-w-xs mx-auto text-gray-500">
            Hãy chọn ít nhất 8 cầu thủ từ Chelsea, Real Madrid, Manchester United hoặc 5 tuyển thủ Việt Nam để kích hoạt thuộc tính ẩn!
          </p>
        </div>
      )}
    </div>
  );
}
