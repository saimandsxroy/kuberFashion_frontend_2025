# Database Setup and RLS Policies

## 1. Users Table Setup

First, ensure your users table has the correct structure with a role column:

```sql
-- Add role column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update existing users to have proper roles
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Set specific users as admin (replace with your admin emails)
UPDATE users SET role = 'admin' WHERE email IN (
  'admin@kuberfashion.com',
  'your-admin-email@example.com'
);

-- Verify the structure
SELECT id, email, first_name, last_name, role, created_at FROM users LIMIT 5;
```

## 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on other user-related tables
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## 3. Create RLS Policies

### Users Table Policies

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can access their own data" ON users;
DROP POLICY IF EXISTS "Admin can access all users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admin can update all users" ON users;

-- Users can view their own profile
CREATE POLICY "Users can access their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admin can view all users
CREATE POLICY "Admin can access all users" ON users
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update all users
CREATE POLICY "Admin can update all users" ON users
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Wishlist Table Policies

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can access their own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can modify their own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Admin can access all wishlists" ON wishlist;

-- Users can view their own wishlist
CREATE POLICY "Users can access their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

-- Users can modify their own wishlist
CREATE POLICY "Users can modify their own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Admin can view all wishlists
CREATE POLICY "Admin can access all wishlists" ON wishlist
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Orders Table Policies

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can access their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Admin can access all orders" ON orders;

-- Users can view their own orders
CREATE POLICY "Users can access their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can access all orders
CREATE POLICY "Admin can access all orders" ON orders
  FOR ALL USING (
    EXISTS(
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### User Addresses Table Policies

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can access their own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can modify their own addresses" ON user_addresses;

-- Users can access their own addresses
CREATE POLICY "Users can access their own addresses" ON user_addresses
  FOR SELECT USING (auth.uid() = user_id);

-- Users can modify their own addresses
CREATE POLICY "Users can modify their own addresses" ON user_addresses
  FOR ALL USING (auth.uid() = user_id);
```

## 4. Create Database Trigger for New Users

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'user'  -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 5. Test Queries

### Load User Profile (React Code)
```javascript
// In your React components, use these queries:

// Load current user's profile
const loadUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

// Load user's wishlist
const loadUserWishlist = async (userId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('user_id', userId);
  
  return { data, error };
};

// Load user's orders
const loadUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          image_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};
```

### Admin Queries (React Code)
```javascript
// Admin can load all users
const loadAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Admin can load all orders
const loadAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        email,
        first_name,
        last_name
      ),
      order_items (
        *,
        products (
          name,
          image_url
        )
      )
    `)
    .order('created_at', { ascending: false });
  
  return { data, error };
};
```

## 6. Verify RLS is Working

Test these queries in the Supabase SQL editor:

```sql
-- This should only return the current user's data
SELECT * FROM users WHERE auth.uid() = id;

-- This should only return the current user's wishlist
SELECT * FROM wishlist WHERE auth.uid() = user_id;

-- This should only return the current user's orders
SELECT * FROM orders WHERE auth.uid() = user_id;
```

## 7. Grant Admin Role to Specific Users

```sql
-- Method 1: By email
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';

-- Method 2: By user ID (get ID from auth.users table)
UPDATE users 
SET role = 'admin' 
WHERE id = 'user-uuid-here';

-- Verify admin users
SELECT id, email, first_name, last_name, role 
FROM users 
WHERE role = 'admin';
```

## 8. Environment Configuration

Make sure your `.env` file has email confirmation disabled for development:

```env
# In your Supabase dashboard, go to Authentication > Settings
# Set "Enable email confirmations" to OFF for development
# Set "Enable email confirmations" to ON for production

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 9. Testing the Setup

1. **Create a new user account** - should automatically get 'user' role
2. **Try accessing admin routes** - should be denied
3. **Manually set a user as admin** using the SQL above
4. **Try admin login** - should now work
5. **Check data isolation** - users should only see their own data
6. **Test admin access** - admin should see all data

This setup ensures proper data isolation and role-based access control throughout your application.
