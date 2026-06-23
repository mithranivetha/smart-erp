'use client';

import { useState, useEffect } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const API_URL = 'http://localhost:5050/api/suppliers';

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setSuppliers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, address, outstanding_dues: 0 }),
    });
    setName('');
    setMobile('');
    setAddress('');
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchSuppliers();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supplier Ledger</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3 border p-4 rounded">
        <input
          type="text"
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-burgundy text-offwhite px-4 py-2 rounded hover:bg-forest transition-colors">
          Add Supplier
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">All Suppliers</h2>
      <ul className="space-y-2">
        {suppliers.map((s) => (
          <li key={s.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-500">{s.mobile} — {s.address}</p>
              <p className="text-sm">Dues: ₹{s.outstanding_dues}</p>
            </div>
            <button
              onClick={() => handleDelete(s.id)}
              className="text-sm border border-burgundy text-burgundy px-2 py-1 rounded hover:bg-burgundy hover:text-offwhite transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}