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
  const [threshold, setThreshold] = useState('10');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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
        low_stock_threshold: Number(threshold) || 10,
      }),
    });
    setItemName(''); setSku(''); setUnit('');
    setPurchasePrice(''); setSellingPrice('');
    setQuantity(''); setGst(''); setThreshold('10');
    fetchItems();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      item_name: item.item_name,
      sku: item.sku,
      unit: item.unit,
      purchase_price: item.purchase_price,
      selling_price: item.selling_price,
      quantity: item.quantity,
      gst_percentage: item.gst_percentage,
      low_stock_threshold: item.low_stock_threshold,
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditData({}); };

  const saveEdit = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editData,
        purchase_price: Number(editData.purchase_price),
        selling_price: Number(editData.selling_price),
        quantity: Number(editData.quantity),
        gst_percentage: Number(editData.gst_percentage),
        low_stock_threshold: Number(editData.low_stock_threshold),
      }),
    });
    cancelEdit();
    fetchItems();
  };

  const inputClass = "border border-sage bg-parchment text-forest p-1 rounded text-sm focus:outline-none focus:border-forest w-full";
  const addInputClass = "border border-sage bg-parchment text-forest placeholder-sage p-2 rounded focus:outline-none focus:border-forest w-full";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest font-playfair">Stock Items</h1>
        <p className="text-sage mt-1">Manage your inventory and pricing</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required className={`${addInputClass} col-span-2`} />
          <input type="text" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} className={addInputClass} />
          <input type="text" placeholder="Unit (e.g. PCS, KG)" value={unit} onChange={(e) => setUnit(e.target.value)} className={addInputClass} />
          <input type="number" placeholder="Purchase Price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className={addInputClass} />
          <input type="number" placeholder="Selling Price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className={addInputClass} />
          <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={addInputClass} />
          <input type="number" placeholder="GST %" value={gst} onChange={(e) => setGst(e.target.value)} className={addInputClass} />
          <input type="number" placeholder="Low Stock Threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} className={`${addInputClass} col-span-2`} />
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
              <th className="text-left px-4 py-3 text-sm">Threshold</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const isLow = item.quantity <= item.low_stock_threshold;
              return (
                <tr key={item.id} className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                  {editingId === item.id ? (
                    <>
                      <td className="px-2 py-2"><input value={editData.item_name} onChange={(e) => setEditData({...editData, item_name: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2"><input value={editData.sku} onChange={(e) => setEditData({...editData, sku: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2"><input value={editData.unit} onChange={(e) => setEditData({...editData, unit: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2"><input type="number" value={editData.purchase_price} onChange={(e) => setEditData({...editData, purchase_price: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2"><input type="number" value={editData.selling_price} onChange={(e) => setEditData({...editData, selling_price: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2"><input type="number" value={editData.quantity} onChange={(e) => setEditData({...editData, quantity: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2"><input type="number" value={editData.gst_percentage} onChange={(e) => setEditData({...editData, gst_percentage: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2"><input type="number" value={editData.low_stock_threshold} onChange={(e) => setEditData({...editData, low_stock_threshold: e.target.value})} className={inputClass} /></td>
                      <td className="px-2 py-2 text-right space-x-1">
                        <button onClick={() => saveEdit(item.id)} className="text-sm bg-sage text-offwhite px-2 py-1 rounded hover:bg-forest transition-colors">Save</button>
                        <button onClick={cancelEdit} className="text-sm border border-sage text-sage px-2 py-1 rounded hover:bg-parchment transition-colors">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-forest font-medium">
                        <div className="flex items-center gap-2">
                          {item.item_name}
                          {isLow && (
                            <span className="text-xs bg-burgundy text-offwhite px-2 py-0.5 rounded-full">Low Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sage">{item.sku}</td>
                      <td className="px-4 py-3 text-sage">{item.unit}</td>
                      <td className="px-4 py-3 text-forest">₹{item.purchase_price}</td>
                      <td className="px-4 py-3 text-forest">₹{item.selling_price}</td>
                      <td className={`px-4 py-3 font-medium ${isLow ? 'text-burgundy' : 'text-forest'}`}>{item.quantity}</td>
                      <td className="px-4 py-3 text-sage">{item.gst_percentage}%</td>
                      <td className="px-4 py-3 text-sage">{item.low_stock_threshold}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => startEdit(item)} className="text-sm border border-sage text-sage px-3 py-1 rounded hover:bg-sage hover:text-offwhite transition-colors">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="text-sm border border-burgundy text-burgundy px-3 py-1 rounded hover:bg-burgundy hover:text-offwhite transition-colors">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr><td colSpan={9} className="px-6 py-8 text-center text-sage">No stock items yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}