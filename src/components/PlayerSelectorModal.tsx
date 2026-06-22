'use client';

import React, { useState, useMemo } from 'react';
import { Player } from '@/types';
import { PLAYERS_DB } from '@/data/players';
import { Search, X, SlidersHorizontal, Eye } from 'lucide-react';

interface PlayerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  targetRole: string;
}

// Danh sách mùa giải với cấu trúc CSS riêng biệt cho từng Badge
const SEASONS_LIST = [
  { code: 'Tất cả', label: 'TẤT CẢ', bg: 'bg-[#182335] text-white border-gray-700' },
  { code: 'VNM', label: 'VNM (VIỆT NAM)', bg: 'bg-red-700 border-yellow-500 text-yellow-300 font-extrabold shadow-lg shadow-red-950/50' },
  { code: 'ICON', label: 'ICON', bg: 'bg-gradient-to-r from-amber-600 to-yellow-400 text-black font-black border-yellow-300' },
  { code: '24TOTY', label: '24TOTY', bg: 'bg-gradient-to-r from-blue-900 to-indigo-950 text-[#00FF87] font-black border-emerald-400/50' },
  { code: '23UCL', label: '23UCL', bg: 'bg-gradient-to-r from-blue-800 to-blue-950 text-white font-bold border-blue-400' },
  { code: 'CC', label: 'CC', bg: 'bg-slate-700 text-white font-bold border-slate-500' }
];

const POSITIONS_LIST = ['Tất cả', 'ST', 'LW', 'RW', 'CF', 'CAM', 'LM', 'RM', 'CM', 'CDM', 'LWB', 'RWB', 'LB', 'RB', 'CB', 'GK'];

export default function PlayerSelectorModal({
  isOpen,
  onClose,
  onSelectPlayer,
  targetRole
}: PlayerSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Tất cả');
  const [selectedPosition, setSelectedPosition] = useState('Tất cả');
  
  const [maxSalary, setMaxSalary] = useState(30);
  const [minOVR, setMinOVR] = useState(80);

  // Logic lọc cầu thủ thời gian thực
  const filteredPlayers = useMemo(() => {
    return PLAYERS_DB.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeason = selectedSeason === 'Tất cả' || player.season === selectedSeason;

      const matchesPosition = selectedPosition === 'Tất cả' || player.positions.includes(selectedPosition);

      const matchesSalary = player.salary <= maxSalary;
      const matchesOvr = player.rating >= minOVR;

      return matchesSearch && matchesSeason && matchesPosition && matchesSalary && matchesOvr;
    });
  }, [searchTerm, selectedSeason, selectedPosition, maxSalary, minOVR]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-fo4-dark border border-gray-800 rounded-2xl w-full max-w-2xl h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0E1524]">
          <div>
            <h2 className="text-white font-black text-base md:text-lg tracking-wider">TÌM KIẾM HUẤN LUYỆN VIÊN</h2>
            <p className="text-xs text-gray-400">Đang tìm vị trí phù hợp cho vai trò <span className="text-[#00FF87] font-bold bg-[#14251C] px-2 py-0.5 rounded border border-emerald-500/20">{targetRole}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 cursor-pointer transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Khung Bộ Lọc Kiểu fcoplayers.com */}
        <div className="p-4 border-b border-gray-800 bg-[#111A2C] space-y-4">
          
          {/* 1. Ô tìm kiếm tên */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên cầu thủ, ví dụ: Ronaldo, Messi, Quang Hải..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#182335] text-white pl-11 pr-4 py-2.5 rounded-xl border border-gray-700/60 focus:border-fo4-accent outline-none text-sm transition"
            />
          </div>

          {/* 2. Bộ lọc nút Vị trí đá (Chuẩn fcoplayers.com) */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Vị Trí Cụ Thể</label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {POSITIONS_LIST.map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer border transition-all ${
                    selectedPosition === pos
                      ? 'bg-fo4-accent border-fo4-accent text-fo4-dark shadow-md shadow-emerald-500/20'
                      : 'bg-[#182335] border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Bộ lọc nút Mùa giải (Chuẩn fcoplayers.com) */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Mùa Thẻ (Seasons)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {SEASONS_LIST.map(season => (
                <button
                  key={season.code}
                  onClick={() => setSelectedSeason(season.code)}
                  className={`px-2 py-2 rounded-lg text-[9px] font-black text-center cursor-pointer border transition-all truncate ${
                    selectedSeason === season.code
                      ? 'border-[#00FF87] ring-2 ring-[#00FF87]/30 scale-95'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  } ${season.bg}`}
                >
                  {season.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Thanh trượt giới hạn Lương và OVR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-gray-800/60">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Giới hạn lương trần cầu thủ</span>
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
                <span className="text-fo4-gold font-bold">{minOVR} OVR</span>
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

        {/* Danh sách cầu thủ lọc được có hiển thị khuôn mặt */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#0D1322]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              KẾT QUẢ TÌM KIẾM ({filteredPlayers.length})
            </p>
            {(selectedSeason !== 'Tất cả' || selectedPosition !== 'Tất cả') && (
              <button 
                onClick={() => { setSelectedSeason('Tất cả'); setSelectedPosition('Tất cả'); }} 
                className="text-[10px] text-fo4-accent font-bold hover:underline cursor-pointer"
              >
                Xoá bộ lọc nhanh
              </button>
            )}
          </div>

          {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="flex items-center justify-between p-3.5 bg-fo4-card/65 hover:bg-fo4-card border border-gray-800/80 hover:border-fo4-accent/40 rounded-2xl transition cursor-pointer active:scale-[0.99] group shadow-sm"
              >
                {/* Ảnh chân dung thật và thông tin chính */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#182335]/70 flex items-center justify-center relative overflow-hidden border border-gray-700/60 shadow">
                    
                    {/* Ảnh Nexon thật */}
                    {player.image ? (
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-contain relative z-10 scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}

                    {/* Badge mùa thẻ đè góc */}
                    <span className="absolute bottom-0 right-0 bg-[#FFD700] text-black text-[7px] px-1 font-black rounded z-20">
                      {player.season}
                    </span>
                    
                    {/* Chữ viết tắt dự phòng nếu lỗi ảnh */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-extrabold text-xs uppercase">
                      {player.name.substring(0, 2)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm md:text-base group-hover:text-fo4-accent transition">
                      {player.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      <span className="bg-emerald-950/80 text-[#00FF87] px-2 py-0.5 rounded text-[10px] font-black border border-emerald-500/20">
                        {player.positions.join(', ')}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-gray-300">{player.club}</span>
                    </div>
                  </div>
                </div>

                {/* Phần thống kê chỉ số, Lương và Giá tiền */}
                <div className="flex items-center space-x-3 sm:space-x-5">
                  <div className="text-right">
                    <span className="block text-fo4-gold font-black text-sm sm:text-base">{player.rating}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-bold block">OVR</span>
                  </div>
                  <div className="text-right border-l border-gray-800 pl-3.5 sm:pl-5">
                    <span className="block text-white font-black text-sm sm:text-base bg-gray-800 px-2 rounded-lg">{player.salary}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-bold block">LƯƠNG</span>
                  </div>
                  <div className="text-right border-l border-gray-800 pl-3.5 sm:pl-5 min-w-[50px] hidden sm:block">
                    <span className="block text-[#FFD700] font-black text-sm sm:text-base">{player.value} Tỷ</span>
                    <span className="text-[9px] text-gray-500 uppercase font-bold block">BP</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-14 text-gray-500 bg-fo4-card/25 rounded-2xl border border-dashed border-gray-800">
              <SlidersHorizontal className="w-12 h-12 mx-auto text-gray-700 mb-3" />
              <p className="font-black text-sm text-gray-400">Không tìm thấy huấn luyện viên nào</p>
              <p className="text-xs mt-1 text-gray-500">Hãy thử giảm OVR tối thiểu hoặc kéo tăng quỹ lương tối đa!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
                }
