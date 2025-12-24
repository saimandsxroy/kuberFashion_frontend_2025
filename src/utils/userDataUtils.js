import { supabase } from '../lib/supabaseClient';

/**
 * Load user's profile data
 */
export const loadUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception loading user profile:', error);
    return { data: null, error };
  }
};

/**
 * Load user's wishlist with product details
 */
export const loadUserWishlist = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          category,
          brand
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading user wishlist:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Exception loading user wishlist:', error);
    return { data: [], error };
  }
};

/**
 * Add item to user's wishlist
 */
export const addToWishlist = async (userId, productId) => {
  try {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return { success: false, error: 'Item already in wishlist' };
    }

    const { data, error } = await supabase
      .from('wishlist')
      .insert([
        {
          user_id: userId,
          product_id: productId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception adding to wishlist:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove item from user's wishlist
 */
export const removeFromWishlist = async (userId, productId) => {
  try {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception removing from wishlist:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Load user's orders with details
 */
export const loadUserOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url,
            price
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading user orders:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Exception loading user orders:', error);
    return { data: [], error };
  }
};

/**
 * Load user's addresses
 */
export const loadUserAddresses = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error loading user addresses:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Exception loading user addresses:', error);
    return { data: [], error };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception updating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin Functions - Only accessible by admin users
 */

/**
 * Load all users (admin only)
 */
export const loadAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading all users:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Exception loading all users:', error);
    return { data: [], error };
  }
};

/**
 * Load all orders (admin only)
 */
export const loadAllOrders = async () => {
  try {
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
            image_url,
            price
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading all orders:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Exception loading all orders:', error);
    return { data: [], error };
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception updating user role:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Real-time subscription for product updates (for admin changes)
 */
export const subscribeToProductUpdates = (callback) => {
  const subscription = supabase
    .channel('product-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products'
      },
      callback
    )
    .subscribe();

  return subscription;
};

/**
 * Real-time subscription for order updates
 */
export const subscribeToOrderUpdates = (userId, callback) => {
  const subscription = supabase
    .channel(`order-updates-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();

  return subscription;
};
