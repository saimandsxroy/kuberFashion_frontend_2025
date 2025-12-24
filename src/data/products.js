import { productsAPI } from '../services/api';

// Cache for products to avoid repeated API calls
let productsCache = null;
let featuredCache = null;
let lastFetch = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback static products for offline/development mode
export const fallbackProducts = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-tshirt",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: "mens-fashion",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.5,
    reviews: 128,
    description: "Premium quality cotton t-shirt with comfortable fit. Perfect for casual wear and everyday comfort.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Gray"],
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Elegant Summer Dress",
    slug: "elegant-summer-dress",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: "womens-fashion",
    categoryId: 2,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviews: 89,
    description: "Flowing summer dress perfect for warm weather. Lightweight fabric with beautiful floral patterns.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Blue", "Floral Pink", "Solid White"],
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Premium Sneakers",
    slug: "premium-sneakers",
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    category: "footwear",
    categoryId: 3,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.6,
    reviews: 203,
    description: "High-quality sneakers with superior comfort and style. Perfect for both casual and athletic wear.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray", "Navy"],
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    category: "accessories",
    categoryId: 4,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    reviews: 156,
    description: "Genuine leather crossbody bag with multiple compartments. Stylish and functional for everyday use.",
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "Kids Rainbow Hoodie",
    slug: "kids-rainbow-hoodie",
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    category: "kids-fashion",
    categoryId: 5,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.4,
    reviews: 67,
    description: "Colorful and comfortable hoodie for kids. Soft fabric with fun rainbow design.",
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    colors: ["Rainbow", "Pink Rainbow", "Blue Rainbow"],
    inStock: true,
    featured: false
  },
  {
    id: 6,
    name: "Athletic Running Shorts",
    slug: "athletic-running-shorts",
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    category: "sports-active",
    categoryId: 6,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.3,
    reviews: 94,
    description: "Lightweight running shorts with moisture-wicking technology. Perfect for workouts and outdoor activities.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "Red"],
    inStock: true,
    featured: true
  },
  {
    id: 7,
    name: "Denim Jacket",
    slug: "denim-jacket",
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
    category: "mens-fashion",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.5,
    reviews: 112,
    description: "Classic denim jacket with vintage wash. Timeless style that goes with everything.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: "Silk Blouse",
    slug: "silk-blouse",
    price: 95.99,
    originalPrice: 129.99,
    discount: 26,
    category: "womens-fashion",
    categoryId: 2,
    image: "https://images.unsplash.com/photo-1564257577-4d4c6b5b8b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1564257577-4d4c6b5b8b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviews: 78,
    description: "Luxurious silk blouse perfect for professional and formal occasions. Elegant and comfortable.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Cream", "Navy", "Black"],
    inStock: true,
    featured: true
  }
];

// Check if cache is valid
const isCacheValid = () => {
  return lastFetch && (Date.now() - lastFetch) < CACHE_DURATION;
};

// Fetch all products from API with caching
export const fetchProducts = async () => {
  if (productsCache && isCacheValid()) {
    return productsCache;
  }

  try {
    const response = await productsAPI.getAll();
    productsCache = response.data.data || [];
    lastFetch = Date.now();
    return productsCache;
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    // Return fallback data if API fails
    return fallbackProducts;
  }
};

// Fetch featured products from API with caching
export const getFeaturedProducts = async () => {
  if (featuredCache && isCacheValid()) {
    return featuredCache;
  }

  try {
    const response = await productsAPI.getFeatured();
    featuredCache = response.data.data || [];
    lastFetch = Date.now();
    return featuredCache;
  } catch (error) {
    console.error('Failed to fetch featured products from API:', error);
    // Return fallback featured products
    return fallbackProducts.filter(product => product.featured);
  }
};

// Fetch products by category
export const getProductsByCategory = async (categorySlug) => {
  try {
    const response = await productsAPI.getByCategory(categorySlug);
    return response.data.data || [];
  } catch (error) {
    console.error(`Failed to fetch products for category ${categorySlug}:`, error);
    // Return fallback filtered products
    return fallbackProducts.filter(product => product.category === categorySlug);
  }
};

// Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const response = await productsAPI.getById(id);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    // Return fallback product
    return fallbackProducts.find(product => product.id === parseInt(id));
  }
};

// Fetch single product by slug
export const getProductBySlug = async (slug) => {
  try {
    const response = await productsAPI.getBySlug(slug);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch product with slug ${slug}:`, error);
    // Return fallback product
    return fallbackProducts.find(product => product.slug === slug);
  }
};

// Synchronous access to cached products (for backward compatibility)
export const products = fallbackProducts;

// Clear cache (useful for admin updates)
export const clearProductsCache = () => {
  productsCache = null;
  featuredCache = null;
  lastFetch = null;
};
