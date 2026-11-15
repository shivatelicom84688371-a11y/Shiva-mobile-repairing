import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shiva Mobile Repairing',
  description: 'Mobile repair booking, pickup and drop service in Laxmi Nagar, Delhi.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hi"><body>{children}</body></html>;
}
