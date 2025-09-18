alter table users enable row level security;
alter table menu_items enable row level security;
alter table restaurant_tables enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table inventory enable row level security;
alter table staff enable row level security;
alter table reservations enable row level security;
alter table customers enable row level security;
alter table payments enable row level security;
alter table categories enable row level security;

create policy "read_menu_items_public"
  on menu_items for select
  to public
  using (true);

create policy "read_categories_public"
  on categories for select
  to public
  using (true);

create policy "select_own_orders"
  on orders for select
  to authenticated
  using (auth.uid() = customer_id);

create policy "insert_own_orders"
  on orders for insert
  to authenticated
  with check (auth.uid() = customer_id);

create policy "update_own_orders"
  on orders for update
  to authenticated
  using (auth.uid() = customer_id);

create policy "manage_items_of_own_orders"
  on order_items for all
  to authenticated
  using (exists (
    select 1 from orders o
    where o.id = order_id and o.customer_id = auth.uid()
  ))
  with check (exists (
    select 1 from orders o
    where o.id = order_id and o.customer_id = auth.uid()
  ));

create policy "read_own_customer"
  on customers for select
  to authenticated
  using (id = auth.uid());

create policy "update_own_customer"
  on customers for update
  to authenticated
  using (id = auth.uid());

-- Example: managers only (if roles in users table)
-- create policy "manage_inventory_managers"
--   on inventory for all
--   to authenticated
--   using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'manager'))
--   with check (exists (select 1 from users u where u.id = auth.uid() and u.role = 'manager'));
