'use client';

import { useState, useEffect } from 'react';

export default function StockItemsPage() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [gst, setGst] = useState('');

  const API_URL = 'http://localhost:5050/api/stock-items';

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const res = await fetch(API_URL);
    setItems(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: itemName, sku, unit,
        purchase_price: Number(purchasePrice) || 0,
        selling_price: Number(sellingPrice) || 0,
        quantity: Number(quantity) || 0,
        gst_percentage: Number(gst) || 0,
      }),
    });
    setItemName(''); setSku(''); setUnit('');
    setPurchasePrice(''); setSellingPrice(''); setQuantity(''); setGst('');
    fetchItems();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const inputClass = "border border-sage bg-parchment text-forest placeholder-sage p-2 rounded focus:outline-none focus:border-forest w-full";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest">Stock Items</h1>
        <p className="text-sage mt-1">Manage your inventory and pricing</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required className={`${inputClass} col-span-2`} />
          <input type="text" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} />
          <input type="text" placeholder="Unit (e.g. PCS, KG)" value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass} />
          <input type="number" placeholder="Purchase Price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className={inputClass} />
          <input type="number" placeholder="Selling Price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className={inputClass} />
          <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
          <input type="number" placeholder="GST %" value={gst} onChange={(e) => setGst(e.target.value)} className={inputClass} />
          <button type="submit" className="col-span-2 bg-burgundy text-offwhite px-6 py-2 rounded hover:bg-sage transition-colors">
            Add Stock Item
          </button>
        </form>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-parchment">
          <h2 className="text-lg font-semibold text-forest">All Stock Items</h2>
        </div>
        <table className="w-full">
          <thead className="bg-forest text-offwhite">
            <tr>
              <th className="text-left px-4 py-3 text-sm">Name</th>
              <th className="text-left px-4 py-3 text-sm">SKU</th>
              <th className="text-left px-4 py-3 text-sm">Unit</th>
              <th className="text-left px-4 py-3 text-sm">Purchase</th>
              <th className="text-left px-4 py-3 text-sm">Selling</th>
              <th className="text-left px-4 py-3 text-sm">Qty</th>
              <th className="text-left px-4 py-3 text-sm">GST%</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                <td className="px-4 py-3 text-forest font-medium">{item.item_name}</td>
                <td className="px-4 py-3 text-sage">{item.sku}</td>
                <td className="px-4 py-3 text-sage">{item.unit}</td>
                <td className="px-4 py-3 text-forest">₹{item.purchase_price}</td>
                <td className="px-4 py-3 text-forest">₹{item.selling_price}</td>
                <td className="px-4 py-3 text-forest">{item.quantity}</td>
                <td className="px-4 py-3 text-sage">{item.gst_percentage}%</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(item.id)} className="text-sm border border-burgundy text-burgundy px-3 py-1 rounded hover:bg-burgundy hover:text-offwhite transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sage">No stock items yet. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}