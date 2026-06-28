'use client';

import { useState, useEffect } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const API_URL = 'http://localhost:5050/api/customers';

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    const res = await fetch(API_URL);
    setCustomers(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, address, outstanding_balance: 0 }),
    });
    setName(''); setMobile(''); setAddress('');
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchCustomers();
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditMobile(c.mobile);
    setEditAddress(c.address);
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
    fetchCustomers();
  };

  const inputClass = "border border-sage bg-parchment text-forest p-1 rounded text-sm focus:outline-none focus:border-forest w-full";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-forest">Customer Ledger</h1>
        <p className="text-sage mt-1">Manage your customers and outstanding balances</p>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-forest mb-4">Add New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest" />
          <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest" />
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border border-sage bg-parchment text-forest placeholder-sage p-2 w-full rounded focus:outline-none focus:border-forest" />
          <button type="submit" className="bg-burgundy text-offwhite px-6 py-2 rounded hover:bg-sage transition-colors">
            Add Customer
          </button>
        </form>
      </div>

      <div className="bg-offwhite border border-forest rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-parchment">
          <h2 className="text-lg font-semibold text-forest">All Customers</h2>
        </div>
        <table className="w-full">
          <thead className="bg-forest text-offwhite">
            <tr>
              <th className="text-left px-6 py-3 text-sm">Name</th>
              <th className="text-left px-6 py-3 text-sm">Mobile</th>
              <th className="text-left px-6 py-3 text-sm">Address</th>
              <th className="text-left px-6 py-3 text-sm">Balance</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => (
              <tr key={c.id} className={`border-b border-parchment ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-parchment'}`}>
                {editingId === c.id ? (
                  <>
                    <td className="px-4 py-2"><input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputClass} /></td>
                    <td className="px-4 py-2"><input value={editMobile} onChange={(e) => setEditMobile(e.target.value)} className={inputClass} /></td>
                    <td className="px-4 py-2"><input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className={inputClass} /></td>
                    <td className="px-4 py-2 text-forest">₹{c.outstanding_balance}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button onClick={() => saveEdit(c.id)} className="text-sm bg-sage text-offwhite px-3 py-1 rounded hover:bg-forest transition-colors">Save</button>
                      <button onClick={cancelEdit} className="text-sm border border-sage text-sage px-3 py-1 rounded hover:bg-parchment transition-colors">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3 text-forest font-medium">{c.name}</td>
                    <td className="px-6 py-3 text-sage">{c.mobile}</td>
                    <td className="px-6 py-3 text-sage">{c.address}</td>
                    <td className="px-6 py-3 text-forest">₹{c.outstanding_balance}</td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button onClick={() => startEdit(c)} className="text-sm border border-sage text-sage px-3 py-1 rounded hover:bg-sage hover:text-offwhite transition-colors">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-sm border border-burgundy text-burgundy px-3 py-1 rounded hover:bg-burgundy hover:text-offwhite transition-colors">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sage">No customers yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}