// Test utility to create admin user
// This is for development/testing only

import { supabase } from '../lib/supabaseClient';

export const createTestAdmin = async () => {
  try {
    // Create admin user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@kuberfashion.com',
      password: 'admin123456',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          phone: '1234567890'
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin user created successfully:', data);
    return { 
      success: true, 
      message: 'Admin user created! Email: admin@kuberfashion.com, Password: admin123456' 
    };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
};

// Function to test admin login
export const testAdminLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@kuberfashion.com',
      password: 'admin123456'
    });

    if (error) {
      console.error('Admin login failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin login successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.createTestAdmin = createTestAdmin;
  window.testAdminLogin = testAdminLogin;
}
