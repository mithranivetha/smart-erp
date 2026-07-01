'use client';

import { useState, useEffect } from 'react';
import API_BASE from '@/lib/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const API_URL = `${API_BASE}/api/suppliers`;

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    const res = await fetch(API_URL);
    setSuppliers(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, address, outstanding_dues: 0 }),
    });
    setName(''); setMobile(''); setAddress('');
    fetchSuppliers();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchSuppliers();
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditMobile(s.mobile);
    setEditAddress(s.address);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName(''); setEditMobile(''); setEditAddress('');
  };

  const saveEdit = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, mobile: editMobile, address: editAddress }),
    });
    cancelEdit();
    fetchSuppliers();
  };

  const inputClass = "border border-sage bg-parchment text-forest p-1 rounded text-sm focus:outline-none focus:border-forest w-full";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest font-playfair">Supplier Ledger</h1>
        <p className="text-sage mt-1">Manage your suppliers and outstanding dues</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">Add New Supplier</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Supplier Name" value={name} onChange={(e) => setName(e.target.value)} required className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest" />
          <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest" />
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest" />
          <button type="submit" className="bg-burgundy text-offwhite px-6 py-2 rounded hover:bg-sage transition-colors">
            Add Supplier
          </button>
        </form>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-burgundyu">
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
              <tr key={s.id} className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                {editingId === s.id ? (
                  <>
                    <td className="px-4 py-2"><input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputClass} /></td>
                    <td className="px-4 py-2"><input value={editMobile} onChange={(e) => setEditMobile(e.target.value)} className={inputClass} /></td>
                    <td className="px-4 py-2"><input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className={inputClass} /></td>
                    <td className="px-4 py-2 text-forest">₹{s.outstanding_dues}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button onClick={() => saveEdit(s.id)} className="text-sm bg-sage text-offwhite px-3 py-1 rounded hover:bg-forest transition-colors">Save</button>
                      <button onClick={cancelEdit} className="text-sm border border-sage text-sage px-3 py-1 rounded hover:bg-parchment transition-colors">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3 text-forest font-medium">{s.name}</td>
                    <td className="px-6 py-3 text-sage">{s.mobile}</td>
                    <td className="px-6 py-3 text-sage">{s.address}</td>
                    <td className="px-6 py-3 text-forest">₹{s.outstanding_dues}</td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button onClick={() => startEdit(s)} className="text-sm border border-sage text-sage px-3 py-1 rounded hover:bg-sage hover:text-offwhite transition-colors">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-sm border border-burgundy text-burgundy px-3 py-1 rounded hover:bg-burgundy hover:text-offwhite transition-colors">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sage">No suppliers yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}