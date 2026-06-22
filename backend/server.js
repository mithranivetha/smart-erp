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

// GET all suppliers
app.get('/api/suppliers', async (req, res) => {
  const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CREATE supplier
app.post('/api/suppliers', async (req, res) => {
  const { name, mobile, address, outstanding_dues } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const { data, error } = await supabase
    .from('suppliers')
    .insert([{ name, mobile, address, outstanding_dues: outstanding_dues || 0 }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// UPDATE supplier
app.put('/api/suppliers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, mobile, address, outstanding_dues } = req.body;

  const { data, error } = await supabase
    .from('suppliers')
    .update({ name, mobile, address, outstanding_dues })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE supplier
app.delete('/api/suppliers/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('suppliers').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Supplier deleted' });
});

// GET all stock items
app.get('/api/stock-items', async (req, res) => {
  const { data, error } = await supabase.from('stock_items').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CREATE stock item
app.post('/api/stock-items', async (req, res) => {
  const { item_name, sku, unit, purchase_price, selling_price, quantity, gst_percentage } = req.body;
  if (!item_name) return res.status(400).json({ error: 'Item name is required' });

  const { data, error } = await supabase
    .from('stock_items')
    .insert([{
      item_name,
      sku,
      unit,
      purchase_price: purchase_price || 0,
      selling_price: selling_price || 0,
      quantity: quantity || 0,
      gst_percentage: gst_percentage || 0,
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// UPDATE stock item
app.put('/api/stock-items/:id', async (req, res) => {
  const { id } = req.params;
  const { item_name, sku, unit, purchase_price, selling_price, quantity, gst_percentage } = req.body;

  const { data, error } = await supabase
    .from('stock_items')
    .update({ item_name, sku, unit, purchase_price, selling_price, quantity, gst_percentage })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE stock item
app.delete('/api/stock-items/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('stock_items').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Stock item deleted' });
});

// CREATE a sales voucher
app.post('/api/sales-vouchers', async (req, res) => {
  const { customer_id, customer_name, items } = req.body;
  // items = [{ item_id, item_name, quantity, price }, ...]

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer and at least one item are required' });
  }

  // 1. Calculate total and generate invoice number
  const total_amount = items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
  const invoice_number = `INV-${Date.now()}`;

  // 2. Create the voucher header
  const { data: voucher, error: voucherError } = await supabase
    .from('sales_vouchers')
    .insert([{ invoice_number, customer_id, customer_name, total_amount }])
    .select()
    .single();

  if (voucherError) return res.status(500).json({ error: voucherError.message });

  // 3. Insert each line item AND reduce stock quantity
  for (const item of items) {
    const subtotal = item.quantity * item.price;

    const { error: lineError } = await supabase
      .from('sales_voucher_items')
      .insert([{
        voucher_id: voucher.id,
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        subtotal,
      }]);

    if (lineError) return res.status(500).json({ error: lineError.message });

    // Fetch current stock quantity, then reduce it
    const { data: stockItem, error: fetchError } = await supabase
      .from('stock_items')
      .select('quantity')
      .eq('id', item.item_id)
      .single();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    if (stockItem.quantity < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for "${item.item_name}". Available: ${stockItem.quantity}, Requested: ${item.quantity}`
      });
    }

    const newQuantity = stockItem.quantity - item.quantity;

    const { error: stockError } = await supabase
      .from('stock_items')
      .update({ quantity: newQuantity })
      .eq('id', item.item_id);

    if (stockError) return res.status(500).json({ error: stockError.message });
  }

  res.status(201).json(voucher);
});

// GET all sales vouchers (with their line items)
app.get('/api/sales-vouchers', async (req, res) => {
  const { data: vouchers, error } = await supabase
    .from('sales_vouchers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // attach line items to each voucher
  for (const v of vouchers) {
    const { data: lineItems } = await supabase
      .from('sales_voucher_items')
      .select('*')
      .eq('voucher_id', v.id);
    v.items = lineItems;
  }

  res.json(vouchers);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});