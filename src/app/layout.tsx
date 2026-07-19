import type { Metadata } from 'next';
import { Sora, Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Navbar from '@/components/ui/Navbar';
import './globals.css';


const sora = Sora({
  variable: '--font-display',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-body',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Đứt Gãy Công Nghệ — CMCN 4.0 & Việt Nam',
  description:
    'Khám phá hành trình đứt gãy công nghệ qua bốn cuộc Cách mạng Công nghiệp và tác động sâu rộng đến nền kinh tế, xã hội Việt Nam trong kỷ nguyên số hóa.',
  keywords: [
    'Cách mạng Công nghiệp 4.0',
    'đứt gãy công nghệ',
    'Việt Nam',
    'chuyển đổi số',
    'công nghệ',
  ],
  authors: [{ name: 'FPT University' }],
  openGraph: {
    title: 'Đứt Gãy Công Nghệ — CMCN 4.0 & Việt Nam',
    description:
      'Khám phá hành trình đứt gãy công nghệ qua bốn cuộc Cách mạng Công nghiệp.',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-deep-circuit font-sans text-pulse-text">
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
