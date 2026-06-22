export interface Player {
  id: string;
  name: string;
  displayName: string;
  season: string; // Ví dụ: ICON, 24TOTY, 23UCL, CC, VNM
  rating: number; // Chỉ số tổng quát OVR
  salary: number; // Mức lương
  value: number;  // Giá trị chuyển nhượng (Đơn vị: Tỷ BP, ví dụ: 1200 tương đương 1,200 Tỷ BP)
  positions: string[]; // Ví dụ: ["ST", "CF"]
  nationality: string;
  club: string; // Ví dụ: Chelsea, Real Madrid, Manchester United, Vietnam
  avatarColor: string; // Màu nền avatar
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
  requirement: number; // Số cầu thủ tối thiểu để kích hoạt
  statBoosts: {
    statName: string;
    value: number;
  }[];
}
