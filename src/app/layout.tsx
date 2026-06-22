import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FO4 Squad Master - FC Online Squad Builder',
  description: 'Trình xây dựng và tối ưu hóa đội hình chuyên nghiệp cho game FC Online. Quản lý giới hạn lương tối ưu, tự động kiểm tra kích hoạt thuộc tính ẩn Team Color.',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    apple: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Tối ưu giao diện cảm ứng không bị zoom ngoài ý muốn
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-fo4-dark min-h-screen text-gray-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
