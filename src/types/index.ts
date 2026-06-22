export interface Player {
  id: string; // SPID kiểu chuỗi
  spid: number; // SPID 9 chữ số của Nexon
  name: string;
  displayName: string;
  season: string; // Tên mùa giải (Ví dụ: ICON, 24VB, 24TOTY)
  seasonId: number; // Mã số mùa giải để gọi ảnh phôi thẻ
  rating: number; // Chỉ số tổng quát OVR
  salary: number; // Mức lương
  value: number;  // Giá trị chuyển nhượng (Tỷ BP)
  positions: string[]; // Vị trí thi đấu
  nationality: string;
  club: string;
  avatarColor: string; // Thuộc tính màu nền avatar dự phòng
  image: string;
  stats: { pace: number; shooting: number; passing: number; dribbling: number; defending: number; physicality: number; };
}

export type FormationName = '4-2-3-1' | '4-3-3' | '4-1-2-3' | '5-2-3' | '3-5-2';

export interface PositionCoordinate { role: string; top: string; left: string; }

export interface TeamColor {
  id: string;
  name: string;
  type: 'club' | 'nationality';
  requirement: number; // Số cầu thủ tối thiểu để kích hoạt
  statBoosts: { statName: string; value: number; }[];
}
