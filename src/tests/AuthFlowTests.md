# KuberFashion Authentication Flow Tests

## Test Cases for Signup Flow

### Test 1: Successful Signup
1. Navigate to `/signup`
2. Fill in valid form data:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Phone: "1234567890"
   - Password: "password123"
   - Confirm Password: "password123"
3. Check terms and conditions
4. Click "Create Account"
5. **Expected Results:**
   - Loading spinner appears
   - Success notification shows
   - Button changes to green with checkmark
   - After 2 seconds, redirects to `/login`
   - No infinite spinner

### Test 2: Signup with Invalid Data
1. Navigate to `/signup`
2. Fill in invalid data (e.g., mismatched passwords)
3. Click "Create Account"
4. **Expected Results:**
   - Form validation errors appear
   - No API call made
   - User stays on signup page

### Test 3: Signup with Server Error
1. Navigate to `/signup`
2. Fill in data that causes server error (e.g., existing email)
3. Click "Create Account"
4. **Expected Results:**
   - Error notification appears
   - Loading spinner stops
   - User can retry

## Test Cases for Signin Flow

### Test 4: Successful Signin
1. Navigate to `/login`
2. Enter valid credentials
3. Click "Sign in"
4. **Expected Results:**
   - Loading spinner appears
   - Success notification shows
   - Button changes to green with checkmark
   - After 1 second, redirects to `/user`
   - User sees home page with profile section

### Test 5: Signin with Invalid Credentials
1. Navigate to `/login`
2. Enter invalid credentials
3. Click "Sign in"
4. **Expected Results:**
   - Error notification appears
   - Loading spinner stops
   - User stays on login page

### Test 6: Admin Signin
1. Navigate to `/admin`
2. Enter admin credentials
3. Click "Sign in"
4. **Expected Results:**
   - Redirects to `/admin/dashboard`
   - Admin interface loads

## Test Cases for Session Persistence

### Test 7: Page Refresh After Login
1. Login successfully
2. Refresh the page
3. **Expected Results:**
   - User remains logged in
   - Stays on `/user` route
   - Profile section still visible

### Test 8: Direct URL Access When Logged In
1. Login successfully
2. Navigate directly to `/cart` in address bar
3. **Expected Results:**
   - Page loads successfully
   - User remains authenticated

### Test 9: Direct URL Access When Not Logged In
1. Ensure user is logged out
2. Navigate directly to `/cart` in address bar
3. **Expected Results:**
   - Redirects to `/login`
   - After login, should redirect back to intended page

## Test Cases for Route Navigation

### Test 10: User Route Structure
1. Login as regular user
2. Verify `/user` route shows:
   - KuberFashion home page content
   - Profile dropdown in top-right
   - All original home page sections

### Test 11: Profile Dropdown Functionality
1. Login and go to `/user`
2. Click profile dropdown
3. **Expected Results:**
   - Dropdown opens with menu items
   - Links work correctly
   - Logout button functions

### Test 12: Legacy Route Redirects
1. Login successfully
2. Navigate to `/old-dashboard`
3. **Expected Results:**
   - Redirects to `/user`

## Error Handling Tests

### Test 13: Network Error During Signup
1. Disconnect internet
2. Try to signup
3. **Expected Results:**
   - Appropriate error message
   - Spinner stops
   - User can retry when connection restored

### Test 14: Network Error During Signin
1. Disconnect internet
2. Try to signin
3. **Expected Results:**
   - Appropriate error message
   - Spinner stops
   - User can retry when connection restored

## UI/UX Tests

### Test 15: Loading States
1. Verify all loading spinners appear and disappear correctly
2. Verify success states show properly
3. Verify error states are clear and actionable

### Test 16: Notification System
1. Test all notification types (success, error, warning)
2. Verify notifications auto-dismiss
3. Verify notifications can be manually closed

### Test 17: Responsive Design
1. Test authentication flows on mobile devices
2. Verify profile dropdown works on small screens
3. Verify forms are usable on all screen sizes

## Performance Tests

### Test 18: Auth State Update Speed
1. Time how long it takes from login click to redirect
2. Should be under 2 seconds for successful login
3. Should be immediate for error display

### Test 19: Session Loading
1. Refresh page when logged in
2. Measure time to restore auth state
3. Should show loading state briefly, then authenticated content

## Security Tests

### Test 20: Token Persistence
1. Login successfully
2. Check browser storage for tokens
3. Verify tokens are properly stored and retrieved

### Test 21: Logout Cleanup
1. Login and navigate around
2. Logout
3. Verify all auth state is cleared
4. Verify protected routes redirect to login

## Integration Tests

### Test 22: Supabase Integration
1. Verify signup creates user in Supabase
2. Verify login authenticates against Supabase
3. Verify session management works with Supabase

### Test 23: Backend Integration
1. If using backend APIs, verify they receive proper auth tokens
2. Verify protected API calls work after login
3. Verify API calls fail appropriately when not authenticated
