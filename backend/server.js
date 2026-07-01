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
  const { customer_id, customer_name, items, gst_type } = req.body;

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer and at least one item are required' });
  }

  // 1. Calculate totals with GST
  let taxable_amount = 0;
  let total_gst = 0;

  const itemsWithGst = items.map((item) => {
    const subtotal = item.quantity * item.price;
    const gst_amount = parseFloat(((subtotal * item.gst_percentage) / 100).toFixed(2));
    taxable_amount += subtotal;
    total_gst += gst_amount;
    return { ...item, subtotal, gst_amount };
  });

  taxable_amount = parseFloat(taxable_amount.toFixed(2));
  total_gst = parseFloat(total_gst.toFixed(2));
  const grand_total = parseFloat((taxable_amount + total_gst).toFixed(2));

  let cgst_amount = 0;
  let sgst_amount = 0;
  let igst_amount = 0;

  if (gst_type === 'CGST_SGST') {
    cgst_amount = parseFloat((total_gst / 2).toFixed(2));
    sgst_amount = parseFloat((total_gst / 2).toFixed(2));
  } else {
    igst_amount = total_gst;
  }

  const invoice_number = `INV-${Date.now()}`;

  // 2. Create voucher header
  const { data: voucher, error: voucherError } = await supabase
    .from('sales_vouchers')
    .insert([{
      invoice_number,
      customer_id,
      customer_name,
      total_amount: taxable_amount,
      gst_type,
      taxable_amount,
      gst_amount: total_gst,
      cgst_amount,
      sgst_amount,
      igst_amount,
      grand_total,
    }])
    .select()
    .single();

  if (voucherError) return res.status(500).json({ error: voucherError.message });

  // 3. Insert line items and reduce stock
  for (const item of itemsWithGst) {
    const { error: lineError } = await supabase
      .from('sales_voucher_items')
      .insert([{
        voucher_id: voucher.id,
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        gst_amount: item.gst_amount,
      }]);

    if (lineError) return res.status(500).json({ error: lineError.message });

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

    const { error: stockError } = await supabase
      .from('stock_items')
      .update({ quantity: stockItem.quantity - item.quantity })
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

// CREATE a purchase voucher
app.post('/api/purchase-vouchers', async (req, res) => {
  const { supplier_id, supplier_name, items } = req.body;

  if (!supplier_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Supplier and at least one item are required' });
  }

  // 1. Calculate total and generate voucher number
  const total_amount = items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
  const voucher_number = `PUR-${Date.now()}`;

  // 2. Create the purchase voucher header
  const { data: voucher, error: voucherError } = await supabase
    .from('purchase_vouchers')
    .insert([{ voucher_number, supplier_id, supplier_name, total_amount }])
    .select()
    .single();

  if (voucherError) return res.status(500).json({ error: voucherError.message });

  // 3. Insert each line item AND increase stock quantity
  for (const item of items) {
    const subtotal = item.quantity * item.price;

    const { error: lineError } = await supabase
      .from('purchase_voucher_items')
      .insert([{
        voucher_id: voucher.id,
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        subtotal,
      }]);

    if (lineError) return res.status(500).json({ error: lineError.message });

    // Fetch current stock quantity then increase it
    const { data: stockItem, error: fetchError } = await supabase
      .from('stock_items')
      .select('quantity')
      .eq('id', item.item_id)
      .single();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    const newQuantity = stockItem.quantity + item.quantity;

    const { error: stockError } = await supabase
      .from('stock_items')
      .update({ quantity: newQuantity })
      .eq('id', item.item_id);

    if (stockError) return res.status(500).json({ error: stockError.message });
  }

  res.status(201).json(voucher);
});

// GET all purchase vouchers with line items
app.get('/api/purchase-vouchers', async (req, res) => {
  const { data: vouchers, error } = await supabase
    .from('purchase_vouchers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  for (const v of vouchers) {
    const { data: lineItems } = await supabase
      .from('purchase_voucher_items')
      .select('*')
      .eq('voucher_id', v.id);
    v.items = lineItems;
  }

  res.json(vouchers);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});