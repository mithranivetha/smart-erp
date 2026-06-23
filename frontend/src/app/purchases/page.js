'use client';

import { useState, useEffect } from 'react';

export default function PurchasesPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchSuppliers();
    fetchStockItems();
    fetchVouchers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await fetch('http://localhost:5050/api/suppliers');
    setSuppliers(await res.json());
  };

  const fetchStockItems = async () => {
    const res = await fetch('http://localhost:5050/api/stock-items');
    setStockItems(await res.json());
  };

  const fetchVouchers = async () => {
    const res = await fetch('http://localhost:5050/api/purchase-vouchers');
    setVouchers(await res.json());
  };

  const addToCart = () => {
    const item = stockItems.find((i) => i.id === selectedItemId);
    if (!item || !quantity) return;
    setCartItems([...cartItems, {
      item_id: item.id,
      item_name: item.item_name,
      quantity: Number(quantity),
      price: item.purchase_price,
    }]);
    setSelectedItemId('');
    setQuantity('');
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const submitVoucher = async () => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier || cartItems.length === 0) {
      alert('Select a supplier and add at least one item');
      return;
    }
    await fetch('http://localhost:5050/api/purchase-vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        items: cartItems,
      }),
    });
    setCartItems([]);
    setSupplierId('');
    fetchVouchers();
    fetchStockItems();
  };

  const selectClass = "border border-sage bg-parchment text-forest p-2 rounded focus:outline-none focus:border-forest";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest">Purchase Voucher</h1>
        <p className="text-sage mt-1">Record purchases from suppliers and update inventory</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">New Purchase</h2>

        <label className="block text-sm font-medium text-forest mb-1">Supplier</label>
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className={`${selectClass} w-full mb-4`}>
          <option value="">Select supplier</option>
          {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
          <button onClick={submitVoucher} className="bg-burgundy text-offwhite px-6 py-2 rounded hover:bg-sage transition-colors">
            Save Purchase
          </button>
        </div>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-parchment">
          <h2 className="text-lg font-semibold text-forest">Past Purchases</h2>
        </div>
        <div className="divide-y divide-parchment">
          {vouchers.map((v) => (
            <div key={v.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-forest">{v.voucher_number}</p>
                  <p className="text-sage text-sm">{v.supplier_name}</p>
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
            <p className="px-6 py-8 text-center text-sage">No purchases yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}