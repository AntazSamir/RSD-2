# Supabase Database Setup Instructions

This document provides instructions on how to set up your Supabase database for the restaurant dashboard application.

## Files Included

1. `supabase-schema.sql` - Contains the database schema (table definitions)
2. `supabase-sample-data.sql` - Contains sample data to populate the tables

## Setup Instructions

### Step 1: Create Tables

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to the "SQL Editor" section
4. Copy the contents of `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the script

This will create all the necessary tables for your restaurant dashboard:
- users
- menu_items
- restaurant_tables
- orders
- order_items
- inventory
- staff
- reservations
- customers
- payments
- categories

### Step 2: Insert Sample Data

1. In the same SQL Editor, copy the contents of `supabase-sample-data.sql`
2. Paste it into the SQL editor
3. Click "Run" to execute the script

This will populate your tables with sample data including:
- Sample users (manager, chef, waiter, customer)
- Sample menu items (pizza, salad, salmon, etc.)
- Sample restaurant tables with different statuses
- Sample orders with order items
- Sample inventory items
- Sample staff records
- Sample reservations
- Sample customers
- Sample payments

## Table Descriptions

### users
Stores user information including email, full name, and role (manager, chef, waiter, customer)

### menu_items
Contains information about menu items including name, description, price, category, and availability

### restaurant_tables
Represents physical tables in the restaurant with number, capacity, and status

### orders
Stores order information including table reference, customer name, status, and total amount

### order_items
Detailed information about items in each order including menu item reference, quantity, and price

### inventory
Tracks inventory items with name, quantity, unit, reorder level, and supplier information

### staff
Information about restaurant staff including position, schedule, and current status

### reservations
Customer reservations with date, time, party size, and status

### customers
Customer information including contact details and loyalty points

### payments
Payment information linked to orders with amount, method, and status

### categories
Menu categories for organizing menu items

## Customization

You can modify the sample data in `supabase-sample-data.sql` to match your specific needs:
1. Change names, prices, or other values
2. Add more records to any table
3. Modify the sample data to reflect your restaurant's actual menu and setup

## Troubleshooting

### "Relation already exists" errors
If you see errors about relations already existing, it means the tables have already been created. You can either:
1. Skip the schema creation step and just run the sample data script
2. Modify the schema script to use `CREATE TABLE IF NOT EXISTS` (already done in the provided script)

### Permission errors
Make sure you're running these scripts as a user with sufficient privileges to create tables and insert data.

### Data conflicts
The sample data scripts use `ON CONFLICT` clauses to prevent duplicate data. If you want to refresh the data, you may need to delete existing records first.

## Next Steps

After setting up the database:
1. Ensure your `.env.local` file has the correct Supabase URL and API key
2. Test the connection using the `/test-supabase` page
3. Start using the restaurant dashboard application