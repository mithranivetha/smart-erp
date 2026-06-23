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
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-forest text-offwhite flex flex-col">
      <div className="px-6 py-5 border-b border-sage">
        <h1 className="text-xl font-bold text-parchment tracking-wide">SmartERP</h1>
        <p className="text-xs text-sage mt-1">Business Management</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
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

      <div className="px-6 py-4 border-t border-sage">
        <p className="text-xs text-sage">SmartERP v1.0</p>
      </div>
    </aside>
  );
}