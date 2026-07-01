'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API_BASE from '@/lib/api';

export default function ReportsPage() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [s, p, st] = await Promise.all([
        fetch(`${API_BASE}/api/sales-vouchers`).then(r => r.json()),
        fetch(`${API_BASE}/api/purchase-vouchers`).then(r => r.json()),
        fetch(`${API_BASE}/api/stock-items`).then(r => r.json()),
      ]);
      setSales(s);
      setPurchases(p);
      setStockItems(st);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const totalSalesValue = sales.reduce((sum, v) => sum + (v.grand_total || v.total_amount), 0);
  const totalTaxCollected = sales.reduce((sum, v) => sum + (v.gst_amount || 0), 0);
  const totalPurchasesValue = purchases.reduce((sum, v) => sum + v.total_amount, 0);
  const lowStockItems = stockItems.filter(i => i.quantity <= i.low_stock_threshold);

  if (loading) return <p className="text-sage p-8">Loading reports...</p>;

  return (
    <div>
      <div className="mb-8 border-b border-sage pb-6">
        <h1 className="text-4xl font-bold text-forest font-playfair">Reports</h1>
        <p className="text-sage mt-1">Business summary and analytics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Sales', value: `₹${totalSalesValue.toFixed(2)}`, sub: `${sales.length} invoices` },
          { label: 'Tax Collected', value: `₹${totalTaxCollected.toFixed(2)}`, sub: 'GST on sales' },
          { label: 'Total Purchases', value: `₹${totalPurchasesValue.toFixed(2)}`, sub: `${purchases.length} vouchers` },
          { label: 'Low Stock Items', value: lowStockItems.length, sub: 'need restocking' },
        ].map((card) => (
          <div key={card.label} className="bg-forest rounded-lg p-5 text-center border border-sage">
            <p className="text-3xl font-bold text-parchment font-playfair">{card.value}</p>
            <p className="text-sm text-sage mt-1 uppercase tracking-widest">{card.label}</p>
            <p className="text-xs text-sage mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Sales register */}
      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-parchment flex justify-between items-center">
          <h2 className="text-lg font-semibold text-forest font-playfair">Sales Register</h2>
          <span className="text-sm text-sage">{sales.length} records</span>
        </div>
        <table className="w-full">
          <thead className="bg-forest text-offwhite">
            <tr>
              <th className="text-left px-6 py-3 text-sm">Invoice No.</th>
              <th className="text-left px-6 py-3 text-sm">Customer</th>
              <th className="text-left px-6 py-3 text-sm">GST Type</th>
              <th className="text-left px-6 py-3 text-sm">Taxable</th>
              <th className="text-left px-6 py-3 text-sm">GST</th>
              <th className="text-left px-6 py-3 text-sm">Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((v, idx) => (
              <tr key={v.id} className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                <td className="px-6 py-3 text-forest font-medium">{v.invoice_number}</td>
                <td className="px-6 py-3 text-sage">{v.customer_name}</td>
                <td className="px-6 py-3 text-sage">{v.gst_type === 'CGST_SGST' ? 'CGST+SGST' : 'IGST'}</td>
                <td className="px-6 py-3 text-forest">₹{v.taxable_amount || v.total_amount}</td>
                <td className="px-6 py-3 text-sage">₹{v.gst_amount || 0}</td>
                <td className="px-6 py-3 text-forest font-semibold">₹{v.grand_total || v.total_amount}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sage">No sales yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Purchase register */}
      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-parchment flex justify-between items-center">
          <h2 className="text-lg font-semibold text-forest font-playfair">Purchase Register</h2>
          <span className="text-sm text-sage">{purchases.length} records</span>
        </div>
        <table className="w-full">
          <thead className="bg-forest text-offwhite">
            <tr>
              <th className="text-left px-6 py-3 text-sm">Voucher No.</th>
              <th className="text-left px-6 py-3 text-sm">Supplier</th>
              <th className="text-left px-6 py-3 text-sm">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((v, idx) => (
              <tr key={v.id} className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                <td className="px-6 py-3 text-forest font-medium">{v.voucher_number}</td>
                <td className="px-6 py-3 text-sage">{v.supplier_name}</td>
                <td className="px-6 py-3 text-forest font-semibold">₹{v.total_amount}</td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-sage">No purchases yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stock summary */}
      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-parchment flex justify-between items-center">
          <h2 className="text-lg font-semibold text-forest font-playfair">Stock Summary</h2>
          <span className="text-sm text-sage">{stockItems.length} items</span>
        </div>
        <table className="w-full">
          <thead className="bg-forest text-offwhite">
            <tr>
              <th className="text-left px-6 py-3 text-sm">Item</th>
              <th className="text-left px-6 py-3 text-sm">SKU</th>
              <th className="text-left px-6 py-3 text-sm">Unit</th>
              <th className="text-left px-6 py-3 text-sm">Current Stock</th>
              <th className="text-left px-6 py-3 text-sm">Threshold</th>
              <th className="text-left px-6 py-3 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item, idx) => {
              const isLow = item.quantity <= item.low_stock_threshold;
              return (
                <tr key={item.id} className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                  <td className="px-6 py-3 text-forest font-medium">{item.item_name}</td>
                  <td className="px-6 py-3 text-sage">{item.sku}</td>
                  <td className="px-6 py-3 text-sage">{item.unit}</td>
                  <td className={`px-6 py-3 font-semibold ${isLow ? 'text-burgundy' : 'text-forest'}`}>{item.quantity}</td>
                  <td className="px-6 py-3 text-sage">{item.low_stock_threshold}</td>
                  <td className="px-6 py-3">
                    {isLow ? (
                      <span className="text-xs bg-burgundy text-offwhite px-2 py-1 rounded-full">Low Stock</span>
                    ) : (
                      <span className="text-xs bg-sage text-offwhite px-2 py-1 rounded-full">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {stockItems.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sage">No stock items yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}