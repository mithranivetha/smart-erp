'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Customers', href: '/customers' },
  { label: 'Suppliers', href: '/suppliers' },
  { label: 'Stock Items', href: '/stock-items' },
  { label: 'Sales Voucher', href: '/sales' },
  { label: 'Purchase Voucher', href: '/purchases' },
  { label: 'Reports', href: '/reports' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-forest text-offwhite flex flex-col">
      {/* Branding */}
      <div className="px-6 py-6 border-b border-sage">
        <h1 className="text-2xl font-bold text-parchment tracking-wide font-playfair">SmartERP</h1>
        <p className="text-xs text-sage mt-1 uppercase tracking-widest">Business Management</p>
      </div>

      {/* Nav label */}
      <div className="px-6 pt-5 pb-2">
        <p className="text-xs text-sage uppercase tracking-widest">Modules</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-burgundy text-offwhite font-medium'
                  : 'text-parchment hover:bg-sage hover:text-offwhite'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sage">
        <p className="text-xs text-sage uppercase tracking-widest">v1.0 · MVP</p>
      </div>
    </aside>
  );
}