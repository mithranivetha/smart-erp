# SmartERP — Business Management System
A full-stack ERP web application for managing business accounting, inventory, billing, and GST — inspired by Tally.

## Live Demo
- **Frontend:** https://smart-erp-eight.vercel.app
- **Backend:** https://smarterp-backend-e9cp.onrender.com

## Features
- Customer and Supplier Ledger with inline editing
- Stock Inventory management with custom low stock thresholds per item
- Low stock alerts on dashboard in real time
- Sales Voucher with automatic GST calculation (CGST+SGST or IGST)
- Purchase Voucher with automatic inventory increase
- Stock validation — prevents overselling with clear error messages
- Reports — sales register, purchase register, stock summary, GST collected

## Tech Stack
### Frontend
- Next.js
- Tailwind CSS
- Font Awesome icons

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- Supabase JS Client

## API Endpoints
### Customers
- GET /api/customers
- GET /api/customers/:id
- POST /api/customers
- PUT /api/customers/:id
- DELETE /api/customers/:id

### Suppliers
- GET /api/suppliers
- POST /api/suppliers
- PUT /api/suppliers/:id
- DELETE /api/suppliers/:id

### Stock Items
- GET /api/stock-items
- GET /api/stock-items/low-stock
- POST /api/stock-items
- PUT /api/stock-items/:id
- DELETE /api/stock-items/:id

### Sales Vouchers
- GET /api/sales-vouchers
- POST /api/sales-vouchers

### Purchase Vouchers
- GET /api/purchase-vouchers
- POST /api/purchase-vouchers

## Running Locally
### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev