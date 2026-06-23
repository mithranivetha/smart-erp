import { Geist } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'SmartERP',
  description: 'Business Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-parchment min-h-screen`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}