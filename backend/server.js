require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get('/', (req, res) => {
  res.send('SmartERP backend is running!');
});

const PORT = process.env.PORT || 5000;
// GET all customers
app.get('/api/customers', async (req, res) => {
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET single customer by id
app.get('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Customer not found' });
  res.json(data);
});

// CREATE a new customer
app.post('/api/customers', async (req, res) => {
  const { name, mobile, address, outstanding_balance } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const { data, error } = await supabase
    .from('customers')
    .insert([{ name, mobile, address, outstanding_balance: outstanding_balance || 0 }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// UPDATE a customer
app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, mobile, address, outstanding_balance } = req.body;

  const { data, error } = await supabase
    .from('customers')
    .update({ name, mobile, address, outstanding_balance })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE a customer
app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Customer deleted' });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});