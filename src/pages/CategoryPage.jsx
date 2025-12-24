import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { Button } from '../components/Button';
import { productsAPI } from '../services/api';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [maxPrice, setMaxPrice] = useState(200);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create category data from the URL parameter
  const categoryData = {
    name: category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category',
    slug: category,
    description: `Explore our collection of ${category?.replace(/-/g, ' ')} products`
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!category) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Fetching products for category:', category);
        const response = await productsAPI.getByCategory(category);
        
        if (response.data?.success) {
          const categoryProducts = response.data.data || [];
          console.log('✅ Fetched category products:', categoryProducts.length);
          setProducts(categoryProducts);
          setFilteredProducts(categoryProducts);
          // Derive dynamic price range
          const prices = categoryProducts
            .map(p => Number(p.price))
            .filter(v => !Number.isNaN(v));
          const derivedMax = prices.length ? Math.ceil(Math.max(...prices)) : 200;
          setMaxPrice(derivedMax);
          setPriceRange([0, derivedMax]);
        } else {
          console.warn('⚠️ No products found for category:', category);
          setProducts([]);
          setFilteredProducts([]);
          setMaxPrice(200);
          setPriceRange([0, 200]);
        }
      } catch (error) {
        console.error('❌ Error fetching category products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
      
      // Scroll to top when category changes
      window.scrollTo(0, 0);
    };

    fetchCategoryProducts();
  }, [category]);

  useEffect(() => {
    let filtered = [...products];

    // Apply price filter (numeric)
    filtered = filtered.filter(product => {
      const price = Number(product.price);
      return !Number.isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for featured
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy, priceRange]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {categoryData.name} products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#047BD2] hover:bg-[#0369A1] text-white mr-4">
            Try Again
          </Button>
          <Button onClick={handleBack} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="flex items-center space-x-2 text-[#047BD2] hover:text-[#0369A1]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
                  {categoryData.name}
                </h1>
                <p className="text-gray-600 mt-1">{categoryData.description}</p>
              </div>
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center space-x-2 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#047BD2] focus:border-[#047BD2]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                onClick={() => {
                  setSortBy('featured');
                  setPriceRange([0, maxPrice]);
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products Grid */}
            <ProductGrid 
              products={filteredProducts} 
              showTitle={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
