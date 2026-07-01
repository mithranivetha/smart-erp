'use client';

import { useState, useEffect } from 'react';
import API_BASE from '@/lib/api';

export default function SalesPage() {
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [gstType, setGstType] = useState('CGST_SGST');

  useEffect(() => {
    fetchCustomers();
    fetchStockItems();
    fetchVouchers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch(`${API_BASE}/api/customers`);
    setCustomers(await res.json());
  };

  const fetchStockItems = async () => {
    const res = await fetch(`${API_BASE}/api/stock-items`);
    setStockItems(await res.json());
  };

  const fetchVouchers = async () => {
    const res = await fetch(`${API_BASE}/api/sales-vouchers`);
    setVouchers(await res.json());
  };

  const addToCart = () => {
    const item = stockItems.find((i) => i.id === selectedItemId);
    if (!item || !quantity) return;
    setCartItems([...cartItems, {
      item_id: item.id,
      item_name: item.item_name,
      quantity: Number(quantity),
      price: item.selling_price,
      gst_percentage: item.gst_percentage,
    }]);
    setSelectedItemId('');
    setQuantity('');
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // GST calculations
  const taxableAmount = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const totalGst = cartItems.reduce((sum, i) => sum + (i.quantity * i.price * i.gst_percentage) / 100, 0);
  const grandTotal = taxableAmount + totalGst;
  const cgst = gstType === 'CGST_SGST' ? totalGst / 2 : 0;
  const sgst = gstType === 'CGST_SGST' ? totalGst / 2 : 0;
  const igst = gstType === 'IGST' ? totalGst : 0;

  const submitInvoice = async () => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer || cartItems.length === 0) {
      alert('Select a customer and add at least one item');
      return;
    }

    const res = await fetch(`${API_BASE}/api/sales-vouchers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: customer.id,
        customer_name: customer.name,
        gst_type: gstType,
        items: cartItems,
      }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    setCartItems([]);
    setCustomerId('');
    fetchVouchers();
    fetchStockItems();
  };

  const selectClass = "border border-sage bg-parchment text-forest p-2 rounded focus:outline-none focus:border-forest";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest font-playfair">Sales Voucher</h1>
        <p className="text-sage mt-1">Create sales invoices with GST</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">New Invoice</h2>

        {/* Customer + GST type row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Customer</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={`${selectClass} w-full`}>
              <option value="">Select customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-1">GST Type</label>
            <select value={gstType} onChange={(e) => setGstType(e.target.value)} className={`${selectClass} w-full`}>
              <option value="CGST_SGST">CGST + SGST (Intra-state)</option>
              <option value="IGST">IGST (Inter-state)</option>
            </select>
          </div>
        </div>

        {/* Add item row */}
        <label className="block text-sm font-medium text-forest mb-1">Add Item</label>
        <div className="flex gap-2 mb-4">
          <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className={`${selectClass} flex-1`}>
            <option value="">Select item</option>
            {stockItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.item_name} — ₹{i.selling_price} | GST {i.gst_percentage}% | Stock: {i.quantity}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border border-sage bg-parchment text-forest p-2 rounded w-24 focus:outline-none focus:border-forest"
          />
          <button onClick={addToCart} className="bg-sage text-offwhite px-4 rounded hover:bg-burgundy transition-colors">
            Add
          </button>
        </div>

        {/* Cart table */}
        {cartItems.length > 0 && (
          <table className="w-full mb-4 border border-parchment rounded">
            <thead className="bg-forest text-offwhite">
              <tr>
                <th className="text-left px-4 py-2 text-sm">Item</th>
                <th className="text-left px-4 py-2 text-sm">Qty</th>
                <th className="text-left px-4 py-2 text-sm">Price</th>
                <th className="text-left px-4 py-2 text-sm">GST%</th>
                <th className="text-left px-4 py-2 text-sm">GST Amt</th>
                <th className="text-left px-4 py-2 text-sm">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((c, idx) => {
                const subtotal = c.quantity * c.price;
                const gstAmt = (subtotal * c.gst_percentage) / 100;
                return (
                  <tr key={idx} className={`border-t border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                    <td className="px-4 py-2 text-forest">{c.item_name}</td>
                    <td className="px-4 py-2 text-forest">{c.quantity}</td>
                    <td className="px-4 py-2 text-forest">₹{c.price}</td>
                    <td className="px-4 py-2 text-sage">{c.gst_percentage}%</td>
                    <td className="px-4 py-2 text-sage">₹{gstAmt.toFixed(2)}</td>
                    <td className="px-4 py-2 text-forest font-medium">₹{(subtotal + gstAmt).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => removeFromCart(idx)} className="text-burgundy hover:text-forest transition-colors">✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* GST Summary box */}
        {cartItems.length > 0 && (
          <div className="bg-parchment border border-sage rounded p-4 mb-4 max-w-xs ml-auto">
            <div className="flex justify-between text-sm text-forest mb-1">
              <span>Taxable Amount</span>
              <span>₹{taxableAmount.toFixed(2)}</span>
            </div>
            {gstType === 'CGST_SGST' ? (
              <>
                <div className="flex justify-between text-sm text-sage mb-1">
                  <span>CGST</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-sage mb-1">
                  <span>SGST</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm text-sage mb-1">
                <span>IGST</span>
                <span>₹{igst.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-sage mt-2 pt-2 flex justify-between font-bold text-forest">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={submitInvoice} className="bg-burgundy text-offwhite px-6 py-2 rounded hover:bg-sage transition-colors">
            Save Invoice
          </button>
        </div>
      </div>

      {/* Past invoices */}
      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-parchment">
          <h2 className="text-lg font-semibold text-forest">Past Invoices</h2>
        </div>
        <div className="divide-y divide-parchment">
          {vouchers.map((v) => (
            <div key={v.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-forest">{v.invoice_number}</p>
                  <p className="text-sage text-sm">{v.customer_name} · {v.gst_type === 'CGST_SGST' ? 'CGST + SGST' : 'IGST'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sage">Taxable: ₹{v.taxable_amount}</p>
                  <p className="text-xs text-sage">GST: ₹{v.gst_amount}</p>
                  <p className="font-bold text-forest">Total: ₹{v.grand_total}</p>
                </div>
              </div>
              <ul className="mt-2 pl-4 space-y-1">
                {v.items?.map((it) => (
                  <li key={it.id} className="text-sm text-sage">
                    {it.item_name} × {it.quantity} @ ₹{it.price} + GST ₹{it.gst_amount} = ₹{(it.subtotal + it.gst_amount).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {vouchers.length === 0 && (
            <p className="px-6 py-8 text-center text-sage">No invoices yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}