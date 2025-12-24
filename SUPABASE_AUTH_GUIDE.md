# Supabase Authentication Configuration Guide

## Required Supabase Dashboard Settings

### 1. Authentication Settings
Navigate to **Authentication > Settings** in your Supabase dashboard:

#### Email Confirmation
- **For Development**: Disable email confirmation
  - Set `Enable email confirmations` to **OFF**
  - This allows immediate login after signup without email verification

- **For Production**: Enable email confirmation
  - Set `Enable email confirmations` to **ON**
  - Configure email templates and SMTP settings

#### Site URL Configuration
- **Site URL**: `http://localhost:5173` (for development)
- **Additional Redirect URLs**: Add all your deployment URLs
  - `http://localhost:5173/**`
  - `https://yourdomain.com/**`
  - `https://yourapp.netlify.app/**`

#### Session Settings
- **JWT expiry**: 3600 seconds (1 hour) - default is fine
- **Refresh token expiry**: 604800 seconds (7 days) - default is fine
- **Enable automatic reuse detection**: ON (recommended)

### 2. Database Setup
Ensure your `users` table exists with proper structure:

```sql
-- Users table (should be created automatically with auth.users trigger)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Environment Variables
Ensure your `.env` file has the correct Supabase configuration:

```env
VITE_SUPABASE_URL=https://hanmurmflpqbfwwvqnsl.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_ENABLE_LOGGING=true  # Enable for debugging
```

## Common Auth Issues & Debugging

### Issue 1: Login processes but doesn't redirect
**Symptoms**: Login appears successful but user stays on login page
**Causes**: 
- Auth state not updating properly
- Race condition between login and navigation
- Session not being established

**Debug Steps**:
1. Open browser console and check for `[AUTH DEBUG]` logs
2. Use the AuthDebugger component (red "AUTH" button in bottom-right)
3. Check if user data appears in localStorage after login
4. Verify Supabase session exists

**Solutions**:
- ✅ **Fixed**: Updated login function with proper state waiting
- ✅ **Fixed**: Added auth state listeners with better error handling
- ✅ **Fixed**: Improved loading states and navigation logic

### Issue 2: User session not persisting
**Symptoms**: User gets logged out on page refresh
**Causes**:
- Supabase client configuration issues
- localStorage not being set properly
- Session expiry

**Debug Steps**:
1. Check `localStorage` for user data and Supabase tokens
2. Verify `persistSession: true` in Supabase client config
3. Check browser network tab for auth requests

**Solutions**:
- ✅ **Fixed**: Supabase client properly configured with `persistSession: true`
- ✅ **Fixed**: Enhanced session loading with retry logic

### Issue 3: User profile not found
**Symptoms**: Login works but user profile is missing
**Causes**:
- Database trigger not working
- Users table doesn't exist
- RLS policies blocking access

**Debug Steps**:
1. Check Supabase logs for database errors
2. Verify users table exists and has proper structure
3. Test database trigger manually

**Solutions**:
- ✅ **Fixed**: Added fallback profile creation using auth metadata
- ✅ **Fixed**: Enhanced error handling for database connection issues

### Issue 4: Route protection not working
**Symptoms**: Can access protected routes without authentication
**Causes**:
- Auth context not properly initialized
- Route guards not checking auth state correctly

**Debug Steps**:
1. Check `isAuthenticated` state in AuthDebugger
2. Verify RequireAuth and RequireRole components are wrapping routes
3. Check for proper loading states

**Solutions**:
- ✅ **Fixed**: Added `authInitialized` state for better loading handling
- ✅ **Fixed**: Enhanced RequireAuth and RequireRole components
- ✅ **Fixed**: Added proper loading spinners

## Testing Your Auth Implementation

### 1. Test User Registration
```javascript
// Test in browser console
const testRegister = async () => {
  const { register } = useAuth();
  const result = await register({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '1234567890'
  });
  console.log('Registration result:', result);
};
```

### 2. Test User Login
```javascript
// Test in browser console
const testLogin = async () => {
  const { login } = useAuth();
  const result = await login({
    email: 'test@example.com',
    password: 'password123'
  });
  console.log('Login result:', result);
};
```

### 3. Test Session Persistence
1. Login to your app
2. Refresh the page
3. Check if you remain logged in
4. Check localStorage for user data

### 4. Test Route Protection
1. Try accessing `/user` or `/admin` without logging in
2. Should redirect to login page
3. After login, should redirect to appropriate dashboard

## Production Checklist

- [ ] Enable email confirmation in Supabase
- [ ] Configure SMTP settings for email delivery
- [ ] Set up proper redirect URLs for your domain
- [ ] Disable debug logging (`VITE_ENABLE_LOGGING=false`)
- [ ] Set up proper error monitoring
- [ ] Test all auth flows in production environment
- [ ] Verify SSL certificates are working
- [ ] Test password reset functionality
- [ ] Verify user profile creation works correctly
- [ ] Test admin role assignment and verification

## Troubleshooting Commands

### Clear All Auth Data
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check Supabase Session
```javascript
// Run in browser console
import { supabase } from './src/lib/supabaseClient';
const session = await supabase.auth.getSession();
console.log('Current session:', session);
```

### Force Session Refresh
```javascript
// Run in browser console
import { supabase } from './src/lib/supabaseClient';
const { data, error } = await supabase.auth.refreshSession();
console.log('Refresh result:', { data, error });
```

## Support

If you continue to experience issues:
1. Check browser console for detailed error logs
2. Use the AuthDebugger component for real-time auth state monitoring
3. Verify Supabase dashboard configuration matches this guide
4. Test with a fresh browser session or incognito mode
5. Check network tab for failed API requests
