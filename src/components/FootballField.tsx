'use client';
import React, { useState } from 'react';
import { Player, FormationName, PositionCoordinate } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface FootballFieldProps { formation: FormationName; selectedPlayers: Record<number, Player | null>; coordinates: PositionCoordinate[]; onSlotClick: (index: number) => void; onRemovePlayer: (index: number, e: React.MouseEvent) => void; }

export default function FootballField({ selectedPlayers, coordinates, onSlotClick, onRemovePlayer }: FootballFieldProps) {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const players = Object.values(selectedPlayers).filter((p): p is Player => p !== null);
  
  const calcAvg = (k: keyof Player['stats']) => players.length === 0 ? 0 : Math.round(players.reduce((a, p) => a + p.stats[k], 0) / players.length);
  const ap = calcAvg('pace'), as = calcAvg('shooting'), apa = calcAvg('passing'), ad = calcAvg('dribbling'), ade = calcAvg('defending'), aph = calcAvg('physicality');

  const getProxyUrl = (url: string) => url ? `https://wsrv.nl/?url=${url.replace(/^https?:\/\//, '')}&we` : '';
  const getCol = (v: number) => v >= 115 ? 'text-[#FFD700]' : v >= 105 ? 'text-[#FF5252]' : 'text-yellow-400';

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Thống kê chỉ số Garena */}
      <div className="bg-fo4-card border border-gray-800 rounded-2xl p-2.5 shadow-lg flex justify-around items-center text-center">
        <div><span className="text-[9px] text-gray-500 font-black block">Tốc Độ</span><span className={`text-sm sm:text-base font-black ${getCol(ap)}`}>{ap || '--'}</span></div>
        <div className="border-l border-gray-800 h-5" />
        <div><span className="text-[9px] text-gray-500 font-black block">Sút</span><span className={`text-sm sm:text-base font-black ${getCol(as)}`}>{as || '--'}</span></div>
        <div className="border-l border-gray-800 h-5" />
        <div><span className="text-[9px] text-gray-500 font-black block">Chuyền</span><span className={`text-sm sm:text-base font-black ${getCol(apa)}`}>{apa || '--'}</span></div>
        <div className="border-l border-gray-800 h-5" />
        <div><span className="text-[9px] text-gray-500 font-black block">Rê Bóng</span><span className={`text-sm sm:text-base font-black ${getCol(ad)}`}>{ad || '--'}</span></div>
        <div className="border-l border-gray-800 h-5" />
        <div><span className="text-[9px] text-gray-500 font-black block">Phòng Thủ</span><span className={`text-sm sm:text-base font-black ${getCol(ade)}`}>{ade || '--'}</span></div>
        <div className="border-l border-gray-800 h-5" />
        <div><span className="text-[9px] text-gray-500 font-black block">Thể Lực</span><span className={`text-sm sm:text-base font-black ${getCol(aph)}`}>{aph || '--'}</span></div>
      </div>

      {/* Sân bóng 3D thiết kế lùn dẹt tỉ lệ [4/3.05] tiết kiệm diện tích tối đa */}
      <div className="w-full [perspective:1000px] overflow-visible py-3 sm:py-5">
        
        {/* LỚP SÂN CỎ 3D: Có overflow-hidden để bo tròn viền cỏ */}
        <div className="relative w-full aspect-[4/3.05] bg-field-texture border border-emerald-950 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] [transform:rotateX(20deg)] origin-bottom overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#142D1F]/10 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between rounded-3xl overflow-hidden">
            <div className="h-[12%] bg-black/5 border-b border-white/5" /><div className="h-[12%] bg-transparent border-b border-white/5" /><div className="h-[12%] bg-black/5 border-b border-white/5" /><div className="h-[12%] bg-transparent border-b border-white/5" /><div className="h-[12%] bg-black/5 border-b border-white/5" /><div className="h-[12%] bg-transparent border-b border-white/5" /><div className="h-[12%] bg-black/5 border-b border-white/5" /><div className="h-[12%] bg-transparent" />
          </div>
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
            <div className="absolute inset-4 border border-white/10 rounded-lg" />
            <div className="absolute top-1/2 left-4 right-4 h-0 border-t border-white/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/10 rounded-full" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-14 border-b border-x border-white/10" />
            <div className="absolute top-[56px] left-1/2 -translate-x-1/2 w-14 h-5 border border-t-0 border-white/10 rounded-b-full" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-14 border-t border-x border-white/10" />
            <div className="absolute bottom-[56px] left-1/2 -translate-x-1/2 w-14 h-5 border border-b-0 border-white/10 rounded-t-full" />
          </div>
        </div>

        {/* LỚP CẦU THỦ 3D: Có overflow-visible để thẻ ST thoải mái vươn ra ngoài mà không bị cắt đầu */}
        <div className="absolute inset-0 [transform:rotateX(20deg)] origin-bottom overflow-visible pointer-events-none">
          {coordinates.map((pos, idx) => {
            const player = selectedPlayers[idx];
            const hasImgError = imgErrors[idx];

            return (
              <div
                key={idx}
                style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%) rotateX(-20deg)' }}
                className="absolute z-10 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 group pointer-events-auto"
                onClick={() => onSlotClick(idx)}
              >
                {player ? (
                  <div className="relative flex flex-col items-center animate-in fade-in duration-200">
                    <button onClick={(e) => onRemovePlayer(idx, e)} className="absolute -top-3.5 -right-3.5 bg-red-600 text-white rounded-full p-1 shadow border border-red-950 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    
                    {/* THẺ GHÉP LỚP 3D NEXON TRỰC QUAN */}
                    <div className="relative flex flex-col items-center rounded-t-xl rounded-b-md w-13 md:w-[68px] aspect-[1/1.42] overflow-hidden shadow-lg border border-white/10">
                      
                      {/* Lớp 1: Ảnh nền phôi thẻ chuẩn Nexon */}
                      <img src={getProxyUrl(`https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/fconline/season/${player.seasonId}.png`)} alt="Card Bg" className="absolute inset-0 w-full h-full object-fill z-0" />

                      {/* Chỉ số OVR & Lương đè lên phôi */}
                      <div className="absolute top-0.5 left-1 z-20 flex flex-col items-center leading-none scale-90 md:scale-100">
                        <span className="text-[10px] md:text-xs font-black text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,1)]">{player.rating}</span>
                        <span className="text-[7px] md:text-[8px] font-black text-yellow-300 drop-shadow-[0_1px_1px_rgba(0,0,0,1)] bg-black/45 px-0.5 rounded mt-0.5">{player.salary}</span>
                      </div>
                      
                      {/* Lớp 2: Ảnh chân dung thật đè lên trên phôi */}
                      <div className="flex-1 w-full flex items-end justify-center relative mt-0.5 z-10">
                        <div className="absolute inset-0 flex items-end justify-center opacity-30 z-0"><svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg></div>
                        {player.image && !hasImgError ? (
                          <img
                            src={getProxyUrl(player.image)}
                            alt={player.displayName}
                            className="w-full h-[95%] object-contain scale-125 translate-y-1 transform transition duration-300 hover:scale-135"
                            onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                          />
                        ) : null}
                      </div>

                      <div className="w-full text-center bg-black/40 py-0.5 text-[7px] md:text-[8px] font-bold text-[#00FF87] border-t border-white/10 z-20">{pos.role}</div>
                    </div>

                    <div className="mt-1 bg-slate-900/90 border border-gray-800 text-[8px] md:text-xs font-bold py-0.2 px-1 rounded-full text-center max-w-[75px] md:max-w-[95px] truncate shadow">{player.displayName}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-11 md:w-11 md:h-[72px] bg-slate-950/80 border border-dashed border-emerald-500/40 hover:border-[#00FF87] rounded-lg flex items-center justify-center text-[#00FF87] shadow-lg transition active:scale-90"><Plus className="w-4 h-4 animate-pulse" /></div>
                    <div className="mt-1 bg-slate-900/85 text-[8.5px] md:text-[10px] font-extrabold text-gray-300 py-0.2 px-1.5 rounded-full border border-gray-800">{pos.role}</div>
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
