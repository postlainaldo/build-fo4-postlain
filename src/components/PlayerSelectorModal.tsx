'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '@/types';
import { PLAYERS_DB } from '@/data/players';
import { Search, X, Sliders, RefreshCw } from 'lucide-react';

interface PlayerSelectorModalProps { isOpen: boolean; onClose: () => void; onSelectPlayer: (player: Player) => void; targetRole: string; }

const SEASONS_LIST = [
  { code: 'Tất cả', label: 'TẤT CẢ', bg: 'bg-[#182335] text-white border-gray-700' },
  { code: '24VB', label: '24VB', bg: 'bg-red-700 border-yellow-500 text-yellow-300 font-extrabold shadow-lg' },
  { code: 'ICON', label: 'ICON', bg: 'bg-gradient-to-r from-amber-600 to-yellow-400 text-black font-black border-yellow-300' },
  { code: '24TOTY', label: '24TOTY', bg: 'bg-gradient-to-r from-blue-900 to-indigo-950 text-[#00FF87] font-black border-emerald-400/50' },
  { code: '23UCL', label: '23UCL', bg: 'bg-gradient-to-r from-blue-800 to-blue-950 text-white font-bold border-blue-400' },
  { code: 'CC', label: 'CC', bg: 'bg-slate-700 text-white font-bold border-slate-500' }
];

const POSITIONS_LIST = ['Tất cả', 'ST', 'LW', 'RW', 'CF', 'CAM', 'LM', 'RM', 'CM', 'CDM', 'LWB', 'RWB', 'LB', 'RB', 'CB', 'GK'];

export default function PlayerSelectorModal({ isOpen, onClose, onSelectPlayer, targetRole }: PlayerSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Tất cả');
  const [selectedPosition, setSelectedPosition] = useState('Tất cả');
  const [maxSalary, setMaxSalary] = useState(30);
  const [minOVR, setMinOVR] = useState(80);
  const [showAdvancedFilters, setShowFilters] = useState(false);

  const [nexonPlayers, setNexonPlayers] = useState<any[]>([]);
  const [seasonsMap, setSeasonsMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [modalImgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Gọi trực tiếp dữ liệu động Nexon khi mở tìm kiếm
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([
      fetch('https://static.fconline.nexonsvc.net/meta/fconline/spid.json').then(res => res.json()),
      fetch('https://static.fconline.nexonsvc.net/meta/fconline/seasonid.json').then(res => res.json())
    ]).then(([spidData, seasonData]) => {
      setNexonPlayers(spidData || []);
      const map: Record<number, string> = {};
      if (Array.isArray(seasonData)) {
        seasonData.forEach((s: any) => { map[s.seasonId] = s.className; });
      }
      setSeasonsMap(map);
    }).catch(err => console.error("Lỗi đồng bộ Nexon:", err)).finally(() => setLoading(false));
  }, [isOpen]);

  // Kết hợp và khởi tạo thuộc tính chuẩn cho hơn 40.000 cầu thủ
  const mappedNexonPlayers = useMemo(() => {
    if (nexonPlayers.length === 0) return PLAYERS_DB;
    const combined = [...PLAYERS_DB];
    const localSpids = new Set(PLAYERS_DB.map(p => p.spid));

    nexonPlayers.forEach((item: any) => {
      if (localSpids.has(item.id)) return;
      const spid = item.id;
      const seasonId = Math.floor(spid / 1000000);
      const seasonCode = seasonsMap[seasonId] || 'CC';
      const rating = 100 + (seasonId % 15);
      const salary = 15 + (rating % 14);
      const value = Math.round((rating - 90) ** 2.4 * 0.1);

      combined.push({
        id: spid.toString(),
        spid,
        name: item.name,
        displayName: item.name.split(' ').pop() || item.name,
        season: seasonCode,
        seasonId,
        rating,
        salary,
        value,
        image: `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${spid}.png`,
        positions: ["ST", "CAM", "CB", "GK"],
        nationality: "Unknown",
        club: "Unknown",
        avatarColor: "bg-slate-800",
        stats: { pace: rating - 2, shooting: rating - 5, passing: rating - 4, dribbling: rating - 3, defending: rating - 30, physicality: rating - 6 }
      });
    });
    return combined;
  }, [nexonPlayers, seasonsMap]);

  const filteredPlayers = useMemo(() => {
    return mappedNexonPlayers.filter(p => {
      const mSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const mSeason = selectedSeason === 'Tất cả' || p.season === selectedSeason;
      const mPosition = selectedPosition === 'Tất cả' || p.positions.includes(selectedPosition);
      const mSalary = p.salary <= maxSalary;
      const mOvr = p.rating >= minOVR;
      return mSearch && mSeason && mPosition && mSalary && mOvr;
    });
  }, [mappedNexonPlayers, searchTerm, selectedSeason, selectedPosition, maxSalary, minOVR]);

  const getProxyUrl = (url: string) => url ? `https://wsrv.nl/?url=${url.replace(/^https?:\/\//, '')}&we` : '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-fo4-dark border border-gray-800 rounded-2xl w-full max-w-2xl h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Header chuẩn "TÌM KIẾM CẦU THỦ" */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0E1524] shrink-0">
          <div>
            <h2 className="text-white font-black text-base md:text-lg tracking-wider">TÌM KIẾM CẦU THỦ</h2>
            <p className="text-xs text-gray-400 font-bold">Tìm kiếm cầu thủ cho vị trí <span className="text-[#00FF87] bg-[#14251C] px-2 py-0.5 rounded border border-emerald-500/20">{targetRole}</span></p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 cursor-pointer transition shrink-0"><X className="w-6 h-6" /></button>
        </div>

        {/* Khung tìm kiếm chính & Nút mở rộng bộ lọc */}
        <div className="p-3.5 border-b border-gray-800 bg-[#111A2C] space-y-3 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="text" placeholder="Tìm siêu sao, ví dụ: Ronaldo, Messi, Quang Hải..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#182335] text-white pl-11 pr-4 py-2.5 rounded-xl border border-gray-700/60 focus:border-fo4-accent outline-none text-sm transition" />
            </div>
            <button onClick={() => setShowFilters(!showAdvancedFilters)} className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${showAdvancedFilters ? 'bg-fo4-accent/15 border-fo4-accent text-fo4-accent' : 'bg-[#182335] border-gray-700 text-gray-300 hover:text-white'}`}><Sliders className="w-4 h-4" /><span className="hidden sm:inline">BỘ LỌC</span></button>
          </div>

          {showAdvancedFilters && (
            <div className="p-3.5 bg-[#0B1220] rounded-xl border border-gray-800 space-y-4 animate-in slide-in-from-top-3 duration-200">
              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Vị Trí Cụ Thể</label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                  {POSITIONS_LIST.map(pos => <button key={pos} onClick={() => setSelectedPosition(pos)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer border transition-all ${selectedPosition === pos ? 'bg-fo4-accent border-fo4-accent text-fo4-dark shadow-md' : 'bg-[#182335] border-gray-800 text-gray-300'}`}>{pos}</button>)}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Mùa Thẻ (Seasons)</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                  {SEASONS_LIST.map(s => <button key={s.code} onClick={() => setSelectedSeason(s.code)} className={`px-1.5 py-1.5 rounded-lg text-[9px] font-black text-center cursor-pointer border transition-all truncate ${selectedSeason === s.code ? 'border-[#00FF87] ring-1 ring-[#00FF87]/30' : 'border-transparent opacity-65'} ${s.bg}`}>{s.label}</button>)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5 border-t border-gray-800/60">
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>Lương tối đa</span><span className="text-fo4-accent font-bold">{maxSalary} FP</span></div>
                  <input type="range" min="10" max="30" value={maxSalary} onChange={(e) => setMaxSalary(parseInt(e.target.value))} className="w-full accent-fo4-accent cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>OVR tối thiểu</span><span className="text-fo4-gold font-bold">{minOVR} OVR</span></div>
                  <input type="range" min="80" max="120" value={minOVR} onChange={(e) => setMinOVR(parseInt(e.target.value))} className="w-full accent-fo4-gold cursor-pointer" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Danh sách cầu thủ chiếm 100% diện tích còn lại */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#0D1322]">
          {loading ? (
            <div className="text-center py-20 text-gray-400 text-xs font-bold flex flex-col items-center justify-center space-y-3"><RefreshCw className="w-8 h-8 text-fo4-accent animate-spin" /><span>Đang kết nối dữ liệu Nexon Live...</span></div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">DANH SÁCH CẦU THỦ SẴN CÓ ({filteredPlayers.length})</p>
                {(selectedSeason !== 'Tất cả' || selectedPosition !== 'Tất cả') && <button onClick={() => { setSelectedSeason('Tất cả'); setSelectedPosition('Tất cả'); }} className="text-[10px] text-fo4-accent font-bold hover:underline cursor-pointer">Xoá bộ lọc nhanh</button>}
              </div>

              {filteredPlayers.length > 0 ? (
                filteredPlayers.slice(0, 100).map(player => {
                  const hasImgError = modalImgErrors[player.id];
                  const cardBgUrl = getProxyUrl(`https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/fconline/season/${player.seasonId}.png`);
                  const faceUrl = getProxyUrl(`https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${player.spid}.png`);

                  return (
                    <div key={player.id} onClick={() => onSelectPlayer(player)} className="flex items-center justify-between p-3 bg-fo4-card/65 hover:bg-fo4-card border border-gray-800/80 hover:border-fo4-accent/40 rounded-2xl transition cursor-pointer active:scale-[0.99] group shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center space-x-4">
                        
                        {/* Thẻ 3D Nexon trực tiếp trong list tìm kiếm */}
                        <div className="relative flex flex-col items-center rounded-t-lg rounded-b-[4px] w-12 h-[68px] overflow-hidden shadow-md shrink-0 border border-white/5">
                          <img src={cardBgUrl} alt="Bg" className="absolute inset-0 w-full h-full object-fill z-0" />
                          <div className="flex items-center justify-between w-full text-[7.5px] font-black px-1 pt-0.5 z-20"><span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">{player.rating}</span><span className="text-[6.5px] bg-black/45 text-white px-0.5 rounded">{player.salary}</span></div>
                          <div className="flex-1 w-full flex items-end justify-center relative mt-0.5 z-10">
                            <div className="absolute inset-0 flex items-end justify-center opacity-30 z-0"><svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg></div>
                            {player.image && !hasImgError ? <img src={faceUrl} alt={player.name} className="w-full h-full object-contain relative z-10 scale-125 translate-y-0.5" onError={() => setImgErrors(prev => ({ ...prev, [player.id]: true }))} /> : null}
                          </div>
                          <div className="absolute bottom-0 w-full text-center bg-black/55 py-0.2 text-[6.5px] font-black text-white z-20 uppercase">{player.season}</div>
                        </div>

                        <div>
                          <h4 className="text-white font-black text-sm md:text-base group-hover:text-fo4-accent transition">{player.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1"><span className="bg-emerald-950/80 text-[#00FF87] px-2 py-0.5 rounded text-[10px] font-black border border-emerald-500/20">{player.positions.join(', ')}</span><span>•</span><span className="font-semibold text-gray-300">{player.club}</span></div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-5">
                        <div className="text-right"><span className="block text-fo4-gold font-black text-sm sm:text-base">{player.rating}</span><span className="text-[9px] text-gray-500 uppercase font-bold block">OVR</span></div>
                        <div className="text-right border-l border-gray-800 pl-3.5 sm:pl-5"><span className="block text-white font-black text-sm sm:text-base bg-gray-800 px-2 rounded-lg">{player.salary}</span><span className="text-[9px] text-gray-500 uppercase font-bold block">LƯƠNG</span></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-14 text-gray-500 bg-fo4-card/25 rounded-2xl border border-dashed border-gray-800"><p className="font-black text-sm text-gray-400">Không tìm thấy cầu thủ nào phù hợp</p></div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
