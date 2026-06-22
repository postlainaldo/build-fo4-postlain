import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mã hóa dữ liệu đội hình để đính vào link chia sẻ
 */
export function encodeSquadState(formation: string, players: Record<number, string | null>, cap: number): string {
  try {
    const dataObj = {
      f: formation,
      p: players,
      c: cap
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(dataObj))));
  } catch (err) {
    console.error("Lỗi mã hóa đội hình:", err);
    return "";
  }
}

/**
 * Giải mã dữ liệu đội hình từ URL
 */
export function decodeSquadState(hash: string): {
  formation: string;
  players: Record<number, string | null>;
  cap: number;
} | null {
  try {
    const decoded = decodeURIComponent(escape(atob(hash)));
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object' && 'f' in parsed) {
      return {
        formation: parsed.f,
        players: parsed.p || {},
        cap: parsed.c || 300
      };
    }
    return null;
  } catch (err) {
    console.warn("Định dạng mã hóa đội hình không hợp lệ hoặc đã cũ.");
    return null;
  }
}
