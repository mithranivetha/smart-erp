'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API_BASE from '@/lib/api';

const modules = [
  { label: 'Customers', href: '/customers', desc: 'Manage customer ledger and balances' },
  { label: 'Suppliers', href: '/suppliers', desc: 'Manage supplier ledger and dues' },
  { label: 'Stock Items', href: '/stock-items', desc: 'View and manage inventory' },
  { label: 'Sales Voucher', href: '/sales', desc: 'Create sales invoices with GST' },
  { label: 'Purchase Voucher', href: '/purchases', desc: 'Record purchases from suppliers' },
  { label: 'Reports', href: '/reports', desc: 'Sales, purchases and stock summary' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0, suppliers: 0,
    stockItems: 0, sales: 0, purchases: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric',
      month: 'long', day: 'numeric',
    }));

    const fetchAll = async () => {
      const [customers, suppliers, stockItems, sales, purchases, lowStock] = await Promise.all([
      fetch(`${API_BASE}/api/customers`).then(r => r.json()),
      fetch(`${API_BASE}/api/suppliers`).then(r => r.json()),
      fetch(`${API_BASE}/api/stock-items`).then(r => r.json()),
      fetch(`${API_BASE}/api/sales-vouchers`).then(r => r.json()),
      fetch(`${API_BASE}/api/purchase-vouchers`).then(r => r.json()),
      fetch(`${API_BASE}/api/stock-items/low-stock`).then(r => r.json()), 
      ]);

      setStats({
        customers: customers.length,
        suppliers: suppliers.length,
        stockItems: stockItems.length,
        sales: sales.length,
        purchases: purchases.length,
      });
      setLowStockItems(lowStock);
    };

    fetchAll();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-10 border-b border-sage pb-6">
        <p className="text-sage text-sm mb-1">{date}</p>
        <h1 className="text-4xl font-bold text-forest font-playfair">Gateway of SmartERP</h1>
        <p className="text-sage mt-2">Welcome back. Here's your business at a glance.</p>
      </div>

      {/* Low stock warning */}
      {lowStockItems.length > 0 && (
        <div className="mb-8 bg-offwhite border border-burgundy rounded-lg p-4">
          <h2 className="text-burgundy font-semibold mb-3 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i> Low Stock Alert ({lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''})
          </h2>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <Link
                key={item.id}
                href="/stock-items"
                className="flex items-center gap-2 bg-parchment border border-burgundy rounded px-3 py-1 text-sm hover:bg-burgundy hover:text-offwhite transition-colors group"
              >
                <span className="text-forest group-hover:text-offwhite">{item.item_name}</span>
                <span className="text-burgundy font-bold group-hover:text-offwhite">{item.quantity} left</span>
              </Link>
            ))}
          </div>
        </div>
      )}

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

      <div className="mt-16 border-t border-sage pt-4">
        <p className="text-xs text-sage text-center tracking-widest uppercase">SmartERP · Business Management System</p>
      </div>
    </div>
  );
}