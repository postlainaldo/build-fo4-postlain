export interface Player {
  id: string;
  name: string;
  displayName: string;
  season: string; // Ví dụ: ICON, 24TOTY, 23UCL, CC, VNM (Việt Nam)
  rating: number; // Chỉ số tổng quát OVR
  salary: number; // Mức lương (Lương tối đa hiện tại là 300)
  positions: string[]; // Ví dụ: ["ST", "CF"]
  nationality: string;
  club: string; // Ví dụ: Chelsea, Real Madrid, Manchester United, Vietnam
  avatarColor: string; // Màu nền avatar tạm thời cho cầu thủ
  stats: {
    pace: number;        // Tốc độ
    shooting: number;    // Dứt điểm
    passing: number;     // Chuyền bóng
    dribbling: number;   // Rê bóng
    defending: number;   // Phòng thủ
    physicality: number; // Thể chất
  };
}

export type FormationName = '4-2-3-1' | '4-3-3' | '4-1-2-3' | '5-2-3' | '3-5-2';

export interface PositionCoordinate {
  role: string;
  top: string;
  left: string;
}

export interface TeamColor {
  id: string;
  name: string;
  type: 'club' | 'nationality';
  requirement: number; // Số cầu thủ tối thiểu để kích hoạt (ví dụ: >= 8 cầu thủ)
  statBoosts: {
    statName: string;
    value: number;
  }[];
}
