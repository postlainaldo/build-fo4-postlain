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

  // 1. TÍNH CHỈ SỐ TRUNG BÌNH ĐỂ HIỂN THỊ DẢI CHỈ SỐ GARENA SIÊU ĐẸP
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

  // Hàm tạo link Proxy thông minh giúp bypass tất cả tường lửa chống sao chép ảnh
  const getProxyUrl = (url: string) => {
    if (!url) return '';
    const clean = url.replace(/^https?:\/\//, '');
    return `https://wsrv.nl/?url=${clean}&we`;
  };

  const getStatColor = (val: number) => {
    if (val >= 115) return 'text-[#FFD700]'; // Vàng bá chủ
    if (val >= 105) return 'text-[#FF5252]'; // Đỏ xuất sắc
    return 'text-yellow-400'; // Vàng thường
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      
      {/* DẢI CHỈ SỐ SƠ LƯỢC SÂN ĐẤU CHUẨN GARENA */}
      <div className="bg-fo4-card border border-gray-800 rounded-2xl p-3 shadow-lg flex justify-around items-center text-center">
        <div>
          <span className="text-[9px] text-gray-500 uppercase font-black block">Tốc Độ</span>
          <span className={`text-base sm:text-lg font-black ${getStatColor(avgPace)}`}>{avgPace || '--'}</span>
        </div>
        <div className="border-l border-gray-800 h-6" />
        <div>
          <span className="text-[9px] text-gray-500 uppercase font-black block">Dứt Điểm</span>
          <span className={`text-base sm:text-lg font-black ${getStatColor(avgShooting)}`}>{avgShooting || '--'}</span>
        </div>
        <div className="border-l border-gray-800 h-6" />
        <div>
          <span className="text-[9px] text-gray-500 uppercase font-black block font-sans">Chuyền</span>
          <span className={`text-base sm:text-lg font-black ${getStatColor(avgPassing)}`}>{avgPassing || '--'}</span>
        </div>
        <div className="border-l border-gray-800 h-6" />
        <div>
          <span className="text-[9px] text-gray-500 uppercase font-black block">Rê Bóng</span>
          <span className={`text-base sm:text-lg font-black ${getStatColor(avgDribbling)}`}>{avgDribbling || '--'}</span>
        </div>
        <div className="border-l border-gray-800 h-6" />
        <div>
          <span className="text-[9px] text-gray-500 uppercase font-black block">Phòng Thủ</span>
          <span className={`text-base sm:text-lg font-black ${getStatColor(avgDefending)}`}>{avgDefending || '--'}</span>
        </div>
        <div className="border-l border-gray-800 h-6" />
        <div>
          <span className="text-[9px] text-gray-500 uppercase font-black block">Thể Lực</span>
          <span className={`text-base sm:text-lg font-black ${getStatColor(avgPhysical)}`}>{avgPhysical || '--'}</span>
        </div>
      </div>

      {/* KHUNG ĐỘ NGHIÊNG 3D PHỐI CẢNH (Isometric Perspective View) */}
      <div className="w-full [perspective:1000px] overflow-visible py-4 sm:py-6">
        
        {/* Sân bóng nghiêng 20 độ */}
        <div className="relative w-full aspect-[4/3.3] bg-field-texture border-2 border-emerald-500/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] [transform:rotateX(20deg)] origin-bottom transition-all duration-300">
          
          {/* Các vạch cỏ sọc ngang 3D */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#142D1F]/20 to-transparent pointer-events-none rounded-3xl" />
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none flex flex-col justify-between rounded-3xl overflow-hidden">
            <div className="h-[12%] bg-black/10 border-b border-white/5" />
            <div className="h-[12%] bg-transparent border-b border-white/5" />
            <div className="h-[12%] bg-black/10 border-b border-white/5" />
            <div className="h-[12%] bg-transparent border-b border-white/5" />
            <div className="h-[12%] bg-black/10 border-b border-white/5" />
            <div className="h-[12%] bg-transparent border-b border-white/5" />
            <div className="h-[12%] bg-black/10 border-b border-white/5" />
            <div className="h-[12%] bg-transparent" />
          </div>

          {/* Các đường kẻ vạch trên sân bóng */}
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
            <div className="absolute inset-4 border border-white/10 rounded-lg" />
            <div className="absolute top-1/2 left-4 right-4 h-0 border-t border-white/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/20 rounded-full" />
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-44 h-16 border-b border-x border-white/10" />
            <div className="absolute top-[68px] left-1/2 -translate-x-1/2 w-16 h-6 border border-t-0 border-white/10 rounded-b-full" />
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-16 border-t border-x border-white/10" />
            <div className="absolute bottom-[68px] left-1/2 -translate-x-1/2 w-16 h-6 border border-b-0 border-white/10 rounded-t-full" />
          </div>

          {/* Sắp xếp các thẻ cầu thủ lên sơ đồ */}
          {coordinates.map((pos, idx) => {
            const player = selectedPlayers[idx];
            const style = player ? GET_SEASON_CARD_STYLE(player.season) : null;
            const hasImgError = imgErrors[idx];

            return (
              <div
                key={idx}
                style={{ 
                  top: pos.top, 
                  left: pos.left,
                  // ĐỒ HỌA 3D: Xoay ngược -20deg để thẻ dựng đứng 3D vuông góc với mắt
                  transform: 'translate(-50%, -50%) rotateX(-20deg)' 
                }}
                className="absolute z-10 flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer active:scale-95 group"
                onClick={() => onSlotClick(idx)}
              >
                {player && style ? (
                  <div className="relative flex flex-col items-center">
                    
                    {/* Nút xoá */}
                    <button
                      onClick={(e) => onRemovePlayer(idx, e)}
                      className="absolute -top-3.5 -right-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 shadow-xl border border-red-950 z-30 transition opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                      title="Xoá cầu thủ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* THẺ ĐỒ HỌA 3D CHUẨN FC ONLINE */}
                    <div className={`relative flex flex-col items-center ${style.bg} ${style.border} rounded-t-xl rounded-b-md w-14 md:w-[70px] aspect-[1/1.42] overflow-hidden`}>
                      
                      {/* Chỉ số OVR & Lương */}
                      <div className="flex items-center justify-between w-full text-[9px] md:text-xs font-black px-1.5 pt-0.5 md:pt-1">
                        <span className={style.numText}>{player.rating}</span>
                        <span className="text-[7.5px] md:text-[9px] bg-black/45 text-white px-0.5 py-0.2 rounded font-extrabold border border-white/10 scale-90">
                          {player.salary}
                        </span>
                      </div>

                      {/* Logo Mùa Thẻ */}
                      <div className={`text-[6.5px] md:text-[8px] font-black px-1 rounded ${style.badgeBg} uppercase tracking-wider scale-90`}>
                        {player.season}
                      </div>

                      {/* Vùng chứa ảnh chân dung */}
                      <div className="flex-1 w-full flex items-end justify-center relative mt-0.5">
                        
                        {/* Silhouette SVG phát sáng */}
                        <div className="absolute inset-0 flex items-end justify-center opacity-40 z-0">
                          <svg className="w-10 h-10 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>

                        {/* Tải qua Proxy thông minh vượt tường lửa */}
                        {player.image && !hasImgError ? (
                          <img
                            src={getProxyUrl(player.image)}
                            alt={player.displayName}
                            className="w-full h-[95%] object-contain relative z-10 scale-125 translate-y-1 transform transition duration-300 hover:scale-135"
                            onError={() => {
                              setImgErrors(prev => ({ ...prev, [idx]: true }));
                            }}
                          />
                        ) : null}

                      </div>

                      {/* Vị trí đá */}
                      <div className="w-full text-center bg-black/40 py-0.5 text-[7px] md:text-[8.5px] font-bold text-[#00FF87] border-t border-white/10 z-20 scale-95">
                        {pos.role}
                      </div>
                    </div>

                    {/* Tên Cầu Thủ */}
                    <div className="mt-1.5 bg-slate-900/90 backdrop-blur-md border border-gray-800 text-[8.5px] md:text-xs font-bold py-0.5 px-1.5 rounded-full text-center max-w-[80px] md:max-w-[100px] truncate shadow">
                      {player.displayName}
                    </div>
                  </div>
                ) : (
                  // Trạng thái trống
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-11 md:w-11 md:h-[72px] bg-slate-950/80 border border-dashed border-emerald-500/40 hover:border-[#00FF87] rounded-lg flex items-center justify-center text-[#00FF87] shadow-lg transition active:scale-90">
                      <Plus className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="mt-1 bg-slate-900/85 text-[8.5px] md:text-[10px] font-extrabold text-gray-300 py-0.2 px-1.5 rounded-full border border-gray-800">
                      {pos.role}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
