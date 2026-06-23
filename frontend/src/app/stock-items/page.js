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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setItems(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: itemName,
        sku,
        unit,
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

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Stock Items</h1>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-2 gap-3 border p-4 rounded">
        <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="border p-2 rounded col-span-2" />
        <input type="text" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Unit (e.g. PCS, KG)" value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Purchase Price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Selling Price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="GST %" value={gst} onChange={(e) => setGst(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-burgundy text-offwhite px-4 py-2 rounded col-span-2 hover:bg-forest transition-colors">
          Add Stock Item
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">All Stock Items</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">SKU</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Purchase</th>
            <th className="p-2">Selling</th>
            <th className="p-2">Qty</th>
            <th className="p-2">GST%</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.item_name}</td>
              <td className="p-2">{item.sku}</td>
              <td className="p-2">{item.unit}</td>
              <td className="p-2">₹{item.purchase_price}</td>
              <td className="p-2">₹{item.selling_price}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.gst_percentage}%</td>
              <td className="p-2">
                <button onClick={() => handleDelete(item.id)} className="text-sm border border-burgundy text-burgundy px-2 py-1 rounded hover:bg-burgundy hover:text-offwhite transition-colors">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}