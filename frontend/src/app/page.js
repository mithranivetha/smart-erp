'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const modules = [
  { label: 'Customers', href: '/customers', desc: 'Manage customer ledger and balances' },
  { label: 'Suppliers', href: '/suppliers', desc: 'Manage supplier ledger and dues' },
  { label: 'Stock Items', href: '/stock-items', desc: 'View and manage inventory' },
  { label: 'Sales Voucher', href: '/sales', desc: 'Create sales invoices' },
  { label: 'Purchase Voucher', href: '/purchases', desc: 'Record purchases from suppliers' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    suppliers: 0,
    stockItems: 0,
    sales: 0,
    purchases: 0,
  });

  const [date, setDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));

    const fetchStats = async () => {
      const [customers, suppliers, stockItems, sales, purchases] = await Promise.all([
        fetch('http://localhost:5050/api/customers').then(r => r.json()),
        fetch('http://localhost:5050/api/suppliers').then(r => r.json()),
        fetch('http://localhost:5050/api/stock-items').then(r => r.json()),
        fetch('http://localhost:5050/api/sales-vouchers').then(r => r.json()),
        fetch('http://localhost:5050/api/purchase-vouchers').then(r => r.json()),
      ]);
      setStats({
        customers: customers.length,
        suppliers: suppliers.length,
        stockItems: stockItems.length,
        sales: sales.length,
        purchases: purchases.length,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-10 border-b border-sage pb-6">
        <p className="text-sage text-sm mb-1">{date}</p>
        <h1 className="text-4xl font-bold text-forest font-playfair">Gateway of SmartERP</h1>
        <p className="text-sage mt-2">Welcome back. Here's your business at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-12">
        {[
          { label: 'Customers', value: stats.customers },
          { label: 'Suppliers', value: stats.suppliers },
          { label: 'Stock Items', value: stats.stockItems },
          { label: 'Sales', value: stats.sales },
          { label: 'Purchases', value: stats.purchases },
        ].map((stat) => (
          <div key={stat.label} className="bg-forest text-offwhite rounded-lg p-5 text-center border border-sage">
            <p className="text-4xl font-bold text-parchment font-playfair">{stat.value}</p>
            <p className="text-sm text-sage mt-2 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-forest font-playfair">Modules</h2>
        <div className="flex-1 h-px bg-sage opacity-30"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="block border border-forest bg-offwhite rounded-lg p-5 hover:bg-burgundy hover:border-burgundy transition-colors group"
          >
            <h3 className="font-semibold text-forest group-hover:text-offwhite font-playfair text-lg">{mod.label}</h3>
            <p className="text-sm text-sage mt-1 group-hover:text-parchment">{mod.desc}</p>
          </Link>
        ))}
      </div>

      {/* Footer line */}
      <div className="mt-16 border-t border-sage pt-4">
        <p className="text-xs text-sage text-center tracking-widest uppercase">SmartERP · Business Management System</p>
      </div>
    </div>
  );
}