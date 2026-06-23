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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest">Supplier Ledger</h1>
        <p className="text-sage mt-1">Manage your suppliers and outstanding dues</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">Add New Supplier</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Supplier Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest"
          />
          <button
            type="submit"
            className="bg-burgundy text-offwhite px-6 py-2 rounded hover:bg-sage transition-colors"
          >
            Add Supplier
          </button>
        </form>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-parchment">
          <h2 className="text-lg font-semibold text-forest">All Suppliers</h2>
        </div>
        <table className="w-full">
          <thead className="bg-forest text-offwhite">
            <tr>
              <th className="text-left px-6 py-3 text-sm">Name</th>
              <th className="text-left px-6 py-3 text-sm">Mobile</th>
              <th className="text-left px-6 py-3 text-sm">Address</th>
              <th className="text-left px-6 py-3 text-sm">Dues</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, idx) => (
              <tr
                key={s.id}
                className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}
              >
                <td className="px-6 py-3 text-forest font-medium">{s.name}</td>
                <td className="px-6 py-3 text-sage">{s.mobile}</td>
                <td className="px-6 py-3 text-sage">{s.address}</td>
                <td className="px-6 py-3 text-forest">₹{s.outstanding_dues}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-sm border border-burgundy text-burgundy px-3 py-1 rounded hover:bg-burgundy hover:text-offwhite transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sage">
                  No suppliers yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}