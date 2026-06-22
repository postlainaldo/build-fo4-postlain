'use client';

import React, { useState, useMemo } from 'react';
import { Player } from '@/types';
import { PLAYERS_DB } from '@/data/players';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface PlayerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  targetRole: string;
}

const SEASONS = ['Tất cả', 'VNM', 'ICON', '24TOTY', '23UCL', 'CC'];
const POSITION_GROUPS: Record<string, string[]> = {
  'Tất cả': [],
  'Tiền đạo (FW)': ['ST', 'CF', 'LW', 'RW'],
  'Tiền vệ (MF)': ['CAM', 'CM', 'CDM', 'LM', 'RM'],
  'Hậu vệ (DF)': ['CB', 'LB', 'RB', 'LWB', 'RWB'],
  'Thủ môn (GK)': ['GK']
};

export default function PlayerSelectorModal({
  isOpen,
  onClose,
  onSelectPlayer,
  targetRole
}: PlayerSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Tất cả');
  const [selectedPosGroup, setSelectedPosGroup] = useState('Tất cả');
  
  // Thanh trượt cấu hình giới hạn Lương và OVR
  const [maxSalary, setMaxSalary] = useState(30);
  const [minOVR, setMinOVR] = useState(80);

  // Logic lọc cầu thủ theo thời gian thực (Real-time Filtering)
  const filteredPlayers = useMemo(() => {
    return PLAYERS_DB.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeason = selectedSeason === 'Tất cả' || player.season === selectedSeason;

      let matchesPosGroup = true;
      if (selectedPosGroup !== 'Tất cả') {
        const allowedRoles = POSITION_GROUPS[selectedPosGroup];
        matchesPosGroup = player.positions.some(pos => allowedRoles.includes(pos));
      }

      const matchesSalary = player.salary <= maxSalary;
      const matchesOvr = player.rating >= minOVR;

      return matchesSearch && matchesSeason && matchesPosGroup && matchesSalary && matchesOvr;
    });
  }, [searchTerm, selectedSeason, selectedPosGroup, maxSalary, minOVR]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-fo4-dark border border-gray-800 rounded-2xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0E1524]">
          <div>
            <h2 className="text-white font-bold text-lg">Tìm Kiếm Cầu Thủ</h2>
            <p className="text-xs text-gray-400">Chọn cầu thủ phù hợp cho vai trò <span className="text-[#00FF87] font-semibold">{targetRole}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Khung bộ lọc tìm kiếm */}
        <div className="p-4 border-b border-gray-800 bg-[#111A2C] space-y-3.5">
          {/* Ô nhập tìm kiếm tên */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên cầu thủ, CLB, quốc tịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#182335] text-white pl-11 pr-4 py-2.5 rounded-xl border border-gray-700/60 focus:border-fo4-accent outline-none text-sm transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Lọc theo mùa thẻ */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1">Mùa giải</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full bg-[#182335] text-white text-xs px-2 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-fo4-accent cursor-pointer"
              >
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Lọc theo nhóm vị trí */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1">Vị trí đá</label>
              <select
                value={selectedPosGroup}
                onChange={(e) => setSelectedPosGroup(e.target.value)}
                className="w-full bg-[#182335] text-white text-xs px-2 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-fo4-accent cursor-pointer"
              >
                {Object.keys(POSITION_GROUPS).map(group => <option key={group} value={group}>{group}</option>)}
              </select>
            </div>
          </div>

          {/* Hai thanh kéo Giới Hạn Lương & Chỉ Số OVR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Lương cầu thủ tối đa</span>
                <span className="text-fo4-accent font-bold">{maxSalary} FP</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={maxSalary}
                onChange={(e) => setMaxSalary(parseInt(e.target.value))}
                className="w-full accent-fo4-accent cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Chỉ số OVR tối thiểu</span>
                <span className="text-fo4-gold font-bold">{minOVR}</span>
              </div>
              <input
                type="range"
                min="80"
                max="120"
                value={minOVR}
                onChange={(e) => setMinOVR(parseInt(e.target.value))}
                className="w-full accent-fo4-gold cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Danh sách cầu thủ lọc được */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Danh sách lọc được ({filteredPlayers.length} Cầu thủ)
          </p>

          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="flex items-center justify-between p-3 bg-fo4-card/45 hover:bg-fo4-card border border-gray-800 hover:border-fo4-accent/40 rounded-xl transition cursor-pointer active:scale-[0.99] group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-11 h-11 rounded-full ${player.avatarColor || 'bg-blue-900'} flex items-center justify-center text-white font-extrabold text-sm border border-white/20 relative shadow`}>
                    <span className="absolute bottom-0 right-0 bg-[#FFD700] text-black text-[7px] px-1 font-black rounded">
                      {player.season}
                    </span>
                    {player.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm group-hover:text-fo4-accent transition">
                      {player.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      <span className="bg-[#182335] px-1.5 py-0.5 rounded text-[10px] text-gray-300 font-bold border border-gray-700">
                        {player.positions.join(', ')}
                      </span>
                      <span>•</span>
                      <span>{player.club}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block text-fo4-gold font-extrabold text-base">{player.rating}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">OVR</span>
                  </div>
                  <div className="text-right border-l border-gray-800 pl-4">
                    <span className="block text-white font-bold text-base bg-gray-800 px-2 rounded">{player.salary}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">LƯƠNG</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <SlidersHorizontal className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="font-semibold text-sm">Không tìm thấy cầu thủ phù hợp</p>
              <p className="text-xs mt-1">Vui lòng điều chỉnh lại thanh trượt kéo Lương hoặc kéo OVR thấp xuống</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
                             }
