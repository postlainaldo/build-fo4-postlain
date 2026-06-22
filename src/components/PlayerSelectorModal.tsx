'use client';

import React, { useState, useMemo } from 'react';
import { Player } from '@/types';
import { PLAYERS_DB } from '@/data/players';
import { Search, X, SlidersHorizontal, Sliders, Check } from 'lucide-react';

interface PlayerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  targetRole: string;
}

const SEASONS_LIST = [
  { code: 'Tất cả', label: 'TẤT CẢ', bg: 'bg-[#182335] text-white border-gray-700' },
  { code: 'VNM', label: 'VNM', bg: 'bg-red-700 border-yellow-500 text-yellow-300 font-extrabold shadow-lg' },
  { code: 'ICON', label: 'ICON', bg: 'bg-gradient-to-r from-amber-600 to-yellow-400 text-black font-black border-yellow-300' },
  { code: '24TOTY', label: '24TOTY', bg: 'bg-gradient-to-r from-blue-900 to-indigo-950 text-[#00FF87] font-black border-emerald-400/50' },
  { code: '23UCL', label: '23UCL', bg: 'bg-gradient-to-r from-blue-800 to-blue-950 text-white font-bold border-blue-400' },
  { code: 'CC', label: 'CC', bg: 'bg-slate-700 text-white font-bold border-slate-500' }
];

const POSITIONS_LIST = ['Tất cả', 'ST', 'LW', 'RW', 'CF', 'CAM', 'LM', 'RM', 'CM', 'CDM', 'LWB', 'RWB', 'LB', 'RB', 'CB', 'GK'];

// Định nghĩa màu Gradient và màu viền giống hệt trên Sân
const GET_SEASON_CARD_STYLE = (season: string) => {
  switch (season) {
    case 'ICON':
      return {
        bg: 'bg-gradient-to-b from-[#FFF59D] via-[#D4AF37] to-[#4E340E]',
        border: 'border border-[#FFE082]',
        text: 'text-black',
        numText: 'text-[#4E340E]',
        badgeBg: 'bg-black text-[#FFD700]',
      };
    case 'VNM':
      return {
        bg: 'bg-gradient-to-b from-[#FF5252] via-[#E53935] to-[#800000]',
        border: 'border border-[#FFD54F]',
        text: 'text-white',
        numText: 'text-yellow-300',
        badgeBg: 'bg-yellow-400 text-black',
      };
    case '24TOTY':
      return {
        bg: 'bg-gradient-to-b from-[#1A237E] via-[#0D1B2A] to-[#020617]',
        border: 'border border-[#00E5FF]',
        text: 'text-white',
        numText: 'text-[#00FF87]',
        badgeBg: 'bg-cyan-500 text-black',
      };
    case '23UCL':
      return {
        bg: 'bg-gradient-to-b from-[#0D47A1] via-[#1A237E] to-[#120E2E]',
        border: 'border border-[#42A5F5]',
        text: 'text-white',
        numText: 'text-cyan-300',
        badgeBg: 'bg-blue-600 text-white',
      };
    case 'CC':
      return {
        bg: 'bg-gradient-to-b from-[#ECEFF1] via-[#546E7A] to-[#263238]',
        border: 'border border-[#B0BEC5]',
        text: 'text-white',
        numText: 'text-slate-300',
        badgeBg: 'bg-slate-700 text-white',
      };
    default:
      return {
        bg: 'bg-gradient-to-b from-[#374151] to-[#111827]',
        border: 'border border-gray-600',
        text: 'text-white',
        numText: 'text-gray-300',
        badgeBg: 'bg-gray-700 text-white',
      };
  }
};

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

  // Thêm trạng thái Ẩn/Hiện bộ lọc nâng cao trên di động (Mặc định là ẨN)
  const [showAdvancedFilters, setShowFilters] = useState(false);

  const [modalImgErrors, setImgErrors] = useState<Record<string, boolean>>({});

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
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0E1524] shrink-0">
          <div>
            <h2 className="text-white font-black text-base md:text-lg tracking-wider">TÌM KIẾM HUẤN LUYỆN VIÊN</h2>
            <p className="text-xs text-gray-400">Đang chọn vị trí cho vai trò <span className="text-[#00FF87] font-bold bg-[#14251C] px-2 py-0.5 rounded border border-emerald-500/20">{targetRole}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 cursor-pointer transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Khung tìm kiếm chính & Nút mở rộng bộ lọc */}
        <div className="p-3.5 border-b border-gray-800 bg-[#111A2C] space-y-3 shrink-0">
          
          <div className="flex items-center space-x-2">
            {/* Ô tìm kiếm tên */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên siêu sao, ví dụ: Ronaldo, Messi, Quang Hải..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#182335] text-white pl-11 pr-4 py-2.5 rounded-xl border border-gray-700/60 focus:border-fo4-accent outline-none text-sm transition"
              />
            </div>

            {/* Nút bấm Đóng/Mở bộ lọc nâng cao cực kỳ trực quan */}
            <button
              onClick={() => setShowFilters(!showAdvancedFilters)}
              className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                showAdvancedFilters || selectedSeason !== 'Tất cả' || selectedPosition !== 'Tất cả'
                  ? 'bg-fo4-accent/15 border-fo4-accent text-fo4-accent'
                  : 'bg-[#182335] border-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">⚙️ BỘ LỌC</span>
            </button>
          </div>

          {/* BỘ LỌC NÂNG CAO (CHỈ HIỂN THỊ KHI ĐƯỢC BẤM MỞ) */}
          {showAdvancedFilters && (
            <div className="p-3.5 bg-[#0B1220] rounded-xl border border-gray-800 space-y-4 animate-in slide-in-from-top-3 duration-200">
              
              {/* Lọc vị trí */}
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Vị Trí Cụ Thể</label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                  {POSITIONS_LIST.map(pos => (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer border transition-all ${
                        selectedPosition === pos
                          ? 'bg-fo4-accent border-fo4-accent text-fo4-dark shadow-md'
                          : 'bg-[#182335] border-gray-800 text-gray-300'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lọc mùa giải */}
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Mùa Thẻ (Seasons)</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                  {SEASONS_LIST.map(season => (
                    <button
                      key={season.code}
                      onClick={() => setSelectedSeason(season.code)}
                      className={`px-1.5 py-1.5 rounded-lg text-[9px] font-black text-center cursor-pointer border transition-all truncate ${
                        selectedSeason === season.code
                          ? 'border-[#00FF87] ring-1 ring-[#00FF87]/30'
                          : 'border-transparent opacity-65'
                      } ${season.bg}`}
                    >
                      {season.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thanh trượt giới hạn Lương và OVR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5 border-t border-gray-800/60">
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
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
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
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
          )}

        </div>

        {/* Danh sách cầu thủ chiếm 100% diện tích còn lại */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#0D1322]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              DANH SÁCH CẦU THỦ SẴN CÓ ({filteredPlayers.length})
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
            filteredPlayers.map(player => {
              const cardStyle = GET_SEASON_CARD_STYLE(player.season);
              const hasImgError = modalImgErrors[player.id];

              return (
                <div
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  className="flex items-center justify-between p-3.5 bg-fo4-card/65 hover:bg-fo4-card border border-gray-800/80 hover:border-fo4-accent/40 rounded-2xl transition cursor-pointer active:scale-[0.99] group shadow-sm"
                >
                  {/* Trái: THẺ CẦU THỦ 3D thu nhỏ + Thông tin chính */}
                  <div className="flex items-center space-x-4">
                    
                    {/* Thẻ 3D thu nhỏ chuẩn chỉ */}
                    <div className={`relative flex flex-col items-center ${cardStyle.bg} ${cardStyle.border} rounded-t-lg rounded-b-[4px] w-12 h-[68px] overflow-hidden shadow-md shrink-0`}>
                      <div className="flex items-center justify-between w-full text-[7.5px] font-black px-1 pt-0.5">
                        <span className={cardStyle.numText}>{player.rating}</span>
                        <span className="text-[6.5px] bg-black/45 text-white px-0.5 rounded">
                          {player.salary}
                        </span>
                      </div>
                      
                      {/* Ảnh Miniface thật từ s1.fifaaddict.com */}
                      <div className="flex-1 w-full flex items-end justify-center relative mt-0.5">
                        <div className="absolute inset-0 flex items-end justify-center opacity-30 z-0">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        {player.image && !hasImgError ? (
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-full h-full object-contain relative z-10 scale-125"
                            onError={() => {
                              setImgErrors(prev => ({ ...prev, [player.id]: true }));
                            }}
                          />
                        ) : null}
                      </div>

                      <div className={`w-full text-center ${cardStyle.badgeBg} py-0.2 text-[6.5px] font-black`}>
                        {player.season}
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

                  {/* Phải: Chỉ số & Giá tiền */}
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
              );
            })
          ) : (
            <div className="text-center py-14 text-gray-500 bg-fo4-card/25 rounded-2xl border border-dashed border-gray-800">
              <p className="font-black text-sm text-gray-400">Không tìm thấy huấn luyện viên nào</p>
              <p className="text-xs mt-1 text-gray-500">Hãy thử giảm OVR tối thiểu hoặc kéo tăng quỹ lương tối đa!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
