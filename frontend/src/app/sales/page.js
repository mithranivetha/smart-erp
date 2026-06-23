'use client';

import { useState, useEffect } from 'react';

export default function SalesPage() {
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchStockItems();
    fetchVouchers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch('http://localhost:5050/api/customers');
    setCustomers(await res.json());
  };

  const fetchStockItems = async () => {
    const res = await fetch('http://localhost:5050/api/stock-items');
    setStockItems(await res.json());
  };

  const fetchVouchers = async () => {
    const res = await fetch('http://localhost:5050/api/sales-vouchers');
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
    }]);
    setSelectedItemId('');
    setQuantity('');
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const submitInvoice = async () => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer || cartItems.length === 0) {
      alert('Select a customer and add at least one item');
      return;
    }
    await fetch('http://localhost:5050/api/sales-vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: customer.id,
        customer_name: customer.name,
        items: cartItems,
      }),
    });
    setCartItems([]);
    setCustomerId('');
    fetchVouchers();
    fetchStockItems();
  };

  const selectClass = "border border-sage bg-parchment text-forest p-2 rounded focus:outline-none focus:border-forest";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest">Sales Voucher</h1>
        <p className="text-sage mt-1">Create sales invoices and track inventory</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">New Invoice</h2>

        <label className="block text-sm font-medium text-forest mb-1">Customer</label>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={`${selectClass} w-full mb-4`}>
          <option value="">Select customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label className="block text-sm font-medium text-forest mb-1">Add Item</label>
        <div className="flex gap-2 mb-4">
          <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)} className={`${selectClass} flex-1`}>
            <option value="">Select item</option>
            {stockItems.map((i) => <option key={i.id} value={i.id}>{i.item_name} (Stock: {i.quantity})</option>)}
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

        {cartItems.length > 0 && (
          <table className="w-full mb-4 border border-parchment rounded">
            <thead className="bg-forest text-offwhite">
              <tr>
                <th className="text-left px-4 py-2 text-sm">Item</th>
                <th className="text-left px-4 py-2 text-sm">Qty</th>
                <th className="text-left px-4 py-2 text-sm">Price</th>
                <th className="text-left px-4 py-2 text-sm">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((c, idx) => (
                <tr key={idx} className={`border-t border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                  <td className="px-4 py-2 text-forest">{c.item_name}</td>
                  <td className="px-4 py-2 text-forest">{c.quantity}</td>
                  <td className="px-4 py-2 text-forest">₹{c.price}</td>
                  <td className="px-4 py-2 text-forest">₹{c.quantity * c.price}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => removeFromCart(idx)} className="text-burgundy hover:text-forest transition-colors">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-center">
          <p className="font-semibold text-forest text-lg">Total: ₹{cartTotal}</p>
          <button onClick={submitInvoice} className="bg-burgundy text-offwhite px-6 py-2 rounded hover:bg-sage transition-colors">
            Save Invoice
          </button>
        </div>
      </div>

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
                  <p className="text-sage text-sm">{v.customer_name}</p>
                </div>
                <p className="font-bold text-forest">₹{v.total_amount}</p>
              </div>
              <ul className="mt-2 pl-4 space-y-1">
                {v.items?.map((it) => (
                  <li key={it.id} className="text-sm text-sage">
                    {it.item_name} × {it.quantity} @ ₹{it.price} = ₹{it.subtotal}
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