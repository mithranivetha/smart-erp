'use client';

import { useState, useEffect } from 'react';

export default function SalesPage() {
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  const [customerId, setCustomerId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cartItems, setCartItems] = useState([]); // items added to this invoice so far

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

    setCartItems([
      ...cartItems,
      {
        item_id: item.id,
        item_name: item.item_name,
        quantity: Number(quantity),
        price: item.selling_price,
      },
    ]);
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
    fetchStockItems(); // refresh so updated quantities show if you check stock page
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sales Voucher</h1>

      <div className="border p-4 rounded mb-6">
        <label className="block mb-2 font-medium">Customer</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Add Item</label>
        <div className="flex gap-2 mb-4">
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="">Select item</option>
            {stockItems.map((i) => (
              <option key={i.id} value={i.id}>{i.item_name} (Stock: {i.quantity})</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 rounded w-24"
          />
          <button onClick={addToCart} className="bg-sage text-offwhite px-4 rounded hover:bg-forest transition-colors">
            Add
          </button>
        </div>

        {cartItems.length > 0 && (
          <table className="w-full mb-4">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((c, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{c.item_name}</td>
                  <td className="p-2">{c.quantity}</td>
                  <td className="p-2">₹{c.price}</td>
                  <td className="p-2">₹{c.quantity * c.price}</td>
                  <td>
                    <button onClick={() => removeFromCart(idx)} className="text-burgundy text-sm hover:text-forest transition-colors">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="font-semibold mb-3">Total: ₹{cartTotal}</p>

        <button onClick={submitInvoice} className="bg-burgundy text-offwhite px-4 py-2 rounded hover:bg-forest transition-colors">
          Save Invoice
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Past Invoices</h2>
      <ul className="space-y-3">
        {vouchers.map((v) => (
          <li key={v.id} className="border p-3 rounded">
            <p className="font-medium">{v.invoice_number} — {v.customer_name}</p>
            <p className="text-sm text-gray-500">Total: ₹{v.total_amount}</p>
            <ul className="text-sm mt-1 pl-4 list-disc">
              {v.items?.map((it) => (
                <li key={it.id}>{it.item_name} × {it.quantity} @ ₹{it.price}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}