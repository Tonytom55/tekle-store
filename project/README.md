# DropShip Store - Complete E-commerce Platform

A modern, full-featured e-commerce dropshipping platform built with React, TypeScript, and Supabase.

## Features

### Customer Features
- 🛍️ Browse products by category
- 🔍 Search and filter products
- 🛒 Shopping cart with persistent storage
- 👤 User authentication (login/register)
- 💳 Cash on Delivery payment
- 📱 Fully responsive design
- ⭐ Product ratings and reviews
- 📦 Order tracking

### Admin Features
- 📊 Admin dashboard with analytics
- 📦 Product management (add/edit/delete)
- 🏪 Order management
- ⚙️ Store settings
- 📈 Sales reporting
- 🔐 Secure admin authentication

### Technical Features
- ⚡ Built with Vite + React + TypeScript
- 🎨 Styled with Tailwind CSS
- 🗄️ Supabase backend integration
- 🔄 State management with Zustand
- 📱 Progressive Web App ready
- 🔒 Secure authentication
- 📊 Real-time data updates

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dropship-store
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   - Add your Supabase credentials

4. Set up the database
   - Run the SQL migrations in your Supabase dashboard
   - Enable Row Level Security (RLS)
   - Set up authentication

5. Start the development server
```bash
npm run dev
```

## Supabase Setup

### Database Schema

Create the following tables in your Supabase dashboard:

#### Products Table
```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price decimal not null,
  original_price decimal,
  images text[] not null,
  category text not null,
  brand text not null,
  in_stock boolean default true,
  stock_quantity integer default 0,
  rating decimal default 4.5,
  review_count integer default 0,
  tags text[],
  profit_margin decimal default 30,
  specifications jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Orders Table
```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address jsonb not null,
  items jsonb not null,
  total_amount decimal not null,
  payment_method text default 'cod',
  payment_status text default 'pending',
  order_status text default 'placed',
  delivery_notes text,
  tracking_number text,
  estimated_delivery timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Row Level Security

Enable RLS and create policies for secure data access:

```sql
-- Enable RLS
alter table products enable row level security;
alter table orders enable row level security;

-- Products policies (public read access)
create policy "Products are viewable by everyone" on products
  for select using (true);

create policy "Products are insertable by authenticated users" on products
  for insert with check (auth.role() = 'authenticated');

-- Orders policies (restricted access)
create policy "Orders are viewable by authenticated users" on orders
  for select using (auth.role() = 'authenticated');

create policy "Orders are insertable by authenticated users" on orders
  for insert with check (auth.role() = 'authenticated');
```

## Demo Credentials

For testing purposes, use these demo accounts:

**Admin Account:**
- Email: admin@store.com
- Password: admin123

**Customer Account:**
- Email: customer@example.com  
- Password: customer123

## Payment Integration

Currently supports:
- ✅ Cash on Delivery (COD)
- 🔄 PayFast (Coming Soon)
- 🔄 PayPal (Coming Soon)
- 🔄 SnapScan (Coming Soon)

## Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Set environment variables for Supabase

### Backend (Supabase)
- Database and authentication are handled by Supabase
- No additional backend deployment needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@dropshipstore.com

## Roadmap

- [ ] PayFast payment integration
- [ ] PayPal payment integration
- [ ] SnapScan QR code payments
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Supplier management
- [ ] Inventory tracking
- [ ] Multi-language support
- [ ] PWA features