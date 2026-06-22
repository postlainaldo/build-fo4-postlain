import { TeamColor } from '@/types';

export const TEAM_COLORS_DB: TeamColor[] = [
  {
    id: "tc-chelsea",
    name: "Chelsea",
    type: "club",
    requirement: 8,
    statBoosts: [
      { statName: "Chỉ số chung (OVR)", value: 3 },
      { statName: "Tăng tốc", value: 2 },
      { statName: "Rê bóng", value: 1 },
      { statName: "Khéo léo", value: 1 }
    ]
  },
  {
    id: "tc-real",
    name: "Real Madrid",
    type: "club",
    requirement: 8,
    statBoosts: [
      { statName: "Chỉ số chung (OVR)", value: 3 },
      { statName: "Sút xoáy", value: 2 },
      { statName: "Chuyền ngắn", value: 2 },
      { statName: "Tốc độ", value: 1 }
    ]
  },
  {
    id: "tc-manutd",
    name: "Manchester United",
    type: "club",
    requirement: 8,
    statBoosts: [
      { statName: "Chỉ số chung (OVR)", value: 3 },
      { statName: "Thể lực", value: 2 },
      { statName: "Sút xa", value: 2 },
      { statName: "Cắt bóng", value: 1 }
    ]
  },
  {
    id: "tc-vietnam",
    name: "Vietnam",
    type: "nationality",
    requirement: 5,
    statBoosts: [
      { statName: "Chỉ số chung (OVR)", value: 4 },
      { statName: "Tốc độ", value: 3 },
      { statName: "Khéo léo", value: 3 },
      { statName: "Chuyền bóng", value: 2 }
    ]
  }
];
