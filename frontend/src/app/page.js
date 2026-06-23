'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const modules = [
  { label: 'Customers', href: '/customers', desc: 'Manage customer ledger' },
  { label: 'Suppliers', href: '/suppliers', desc: 'Manage supplier ledger' },
  { label: 'Stock Items', href: '/stock-items', desc: 'View and manage inventory' },
  { label: 'Sales Voucher', href: '/sales', desc: 'Create sales invoices' },
  { label: 'Purchase Voucher', href: '/purchases', desc: 'Record purchases' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    suppliers: 0,
    stockItems: 0,
    sales: 0,
    purchases: 0,
  });

  useEffect(() => {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest">Gateway of SmartERP</h1>
        <p className="text-sage mt-1">Welcome back. Here's your business at a glance.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Customers', value: stats.customers },
          { label: 'Suppliers', value: stats.suppliers },
          { label: 'Stock Items', value: stats.stockItems },
          { label: 'Sales', value: stats.sales },
          { label: 'Purchases', value: stats.purchases },
        ].map((stat) => (
          <div key={stat.label} className="bg-forest text-offwhite rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-parchment">{stat.value}</p>
            <p className="text-sm text-sage mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <h2 className="text-lg font-semibold text-forest mb-4">Modules</h2>
      <div className="grid grid-cols-3 gap-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="block border-2 border-forest bg-offwhite rounded-lg p-5 hover:bg-burgundy hover:text-offwhite hover:border-burgundy transition-colors group"
          >
            <h3 className="font-semibold text-forest group-hover:text-offwhite">{mod.label}</h3>
            <p className="text-sm text-sage mt-1 group-hover:text-parchment">{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}