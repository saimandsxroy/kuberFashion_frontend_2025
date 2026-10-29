import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Star,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { HeroHeader } from '../components/hero';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../components/Notification';

const CATEGORIES = [
  { id: 1, name: "Men's Fashion", slug: 'mens-fashion' },
  { id: 2, name: "Women's Fashion", slug: 'womens-fashion' },
  { id: 3, name: "Kids Fashion", slug: 'kids-fashion' },
  { id: 4, name: "Footwear", slug: 'footwear' },
  { id: 5, name: "Accessories", slug: 'accessories' },
  { id: 6, name: "Sports & Active", slug: 'sports-active' },
  { id: 7, name: "KVision Exclusive", slug: 'kvision' }
];

const COLORS = [
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Black', hex: '#111827' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'White', hex: '#ffffff', border: true },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Gold', hex: '#d97706' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Yellow', hex: '#ca8a04' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Navy', hex: '#1e3a8a' }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', 'FREE'];

const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: 999999 },
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 - ₹3,500', min: 2000, max: 3500 },
  { label: 'Above ₹3,500', min: 3500, max: 999999 }
];

const DISCOUNT_OPTIONS = [
  { label: '50% or more', min: 50 },
  { label: '40% or more', min: 40 },
  { label: '30% or more', min: 30 },
  { label: '20% or more', min: 20 }
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawQuery = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(rawQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State (Flipkart-style)
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [pricePresetIndex, setPricePresetIndex] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Collapsible accordion states
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    color: true,
    size: true,
    discount: true,
    availability: true
  });

  // Mobile filters drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Cart & Wishlist context
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification, NotificationComponent } = useNotification();

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Synchronize search input
  useEffect(() => {
    setInputQuery(rawQuery);
  }, [rawQuery]);

  // Fetch search products from backend
  const fetchProducts = useCallback(async (queryText) => {
    if (!queryText.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.smartSearch(
        { query: queryText.trim() },
        { size: 50 }
      );

      if (response.data?.success && response.data?.data) {
        const fetchedList = response.data.data.products || [];
        setProducts(fetchedList);

        // Pre-populate filters if backend AI detected specific intent
        const intent = response.data.data.intent;
        if (intent) {
          if (intent.category && !selectedCategory) {
            setSelectedCategory(intent.category);
          }
          if (intent.color && !selectedColor) {
            setSelectedColor(intent.color);
          }
          if (intent.size && !selectedSize) {
            setSelectedSize(intent.size);
          }
          if (intent.inStockOnly) {
            setInStockOnly(true);
          }
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Search request error:', err);
      // Fallback to classic keyword search
      try {
        const fallbackRes = await productsAPI.search(queryText.trim(), { size: 50 });
        const list = fallbackRes.data?.data?.content || fallbackRes.data?.data || [];
        setProducts(list);
      } catch (innerErr) {
        setError('Failed to fetch search results. Please try again.');
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(rawQuery);
  }, [rawQuery, fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedColor('');
    setSelectedSize('');
    setPricePresetIndex(0);
    setMinDiscount(0);
    setInStockOnly(false);
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
    selectedColor ||
    selectedSize ||
    pricePresetIndex > 0 ||
    minDiscount > 0 ||
    inStockOnly
  );

  // Client-side filtering across active sidebar filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Category Filter
      if (selectedCategory) {
        const catSlug = (product.category || '').toLowerCase();
        const catName = (product.categoryName || '').toLowerCase();
        const target = selectedCategory.toLowerCase();
        if (!catSlug.includes(target) && !catName.includes(target)) {
          return false;
        }
      }

      // 2. Color Filter
      if (selectedColor) {
        const targetColor = selectedColor.toUpperCase();
        const prodColors = (product.colors || []).map(c => c.toUpperCase());
        const variantColors = (product.variants || []).map(v => (v.color || '').toUpperCase());
        const hasColor = prodColors.includes(targetColor) ||
                         variantColors.includes(targetColor) ||
                         (product.name || '').toUpperCase().includes(targetColor) ||
                         (product.description || '').toUpperCase().includes(targetColor);
        if (!hasColor) return false;
      }

      // 3. Size Filter
      if (selectedSize) {
        const targetSize = selectedSize.toUpperCase();
        const prodSizes = (product.sizes || []).map(s => s.toUpperCase());
        const variantSizes = (product.variants || []).map(v => (v.size || '').toUpperCase());
        const hasSize = prodSizes.includes(targetSize) || variantSizes.includes(targetSize);
        if (!hasSize) return false;
      }

      // 4. Price Preset Filter
      if (pricePresetIndex > 0) {
        const preset = PRICE_PRESETS[pricePresetIndex];
        const price = Number(product.price) || 0;
        if (price < preset.min || price > preset.max) return false;
      }

      // 5. Discount Filter
      if (minDiscount > 0) {
        const discount = Number(product.discount) || 0;
        if (discount < minDiscount) return false;
      }

      // 6. In Stock Filter
      if (inStockOnly) {
        if (!product.inStock || (product.stockQuantity !== undefined && product.stockQuantity <= 0)) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, selectedColor, selectedSize, pricePresetIndex, minDiscount, inStockOnly]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'popularity':
        return list.sort((a, b) => (Number(b.reviews) || 0) - (Number(a.reviews) || 0));
      case 'price-low':
        return list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      case 'price-high':
        return list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      case 'rating':
        return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
      case 'newest':
        return list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
      default:
        // Relevance (original matching order from search engine)
        return list;
    }
  }, [filteredProducts, sortBy]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showNotification('success', `Added "${product.name}" to Bag`);
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const isAdding = !isInWishlist(product.id);
    toggleWishlist(product);
    showNotification(
      isAdding ? 'success' : 'info',
      isAdding ? 'Added to Wishlist' : 'Removed from Wishlist'
    );
  };

  // Reusable Sidebar Component
  const FilterSidebar = () => (
    <div className="bg-white border border-gray-200 rounded-xs shadow-xs text-sm">
      {/* Sidebar Header */}
      <div className="px-4 py-3.5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <span>Filters</span>
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-bold text-[#047BD2] hover:text-[#0369A1] uppercase tracking-wider transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="p-3 bg-gray-50/60 border-b border-gray-200 flex flex-wrap gap-1.5">
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs bg-white text-gray-800 border border-gray-300 shadow-xs">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('')} className="hover:text-red-500 ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedColor && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs bg-white text-gray-800 border border-gray-300 shadow-xs">
              Color: {selectedColor}
              <button onClick={() => setSelectedColor('')} className="hover:text-red-500 ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedSize && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs bg-white text-gray-800 border border-gray-300 shadow-xs">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize('')} className="hover:text-red-500 ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {pricePresetIndex > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs bg-white text-gray-800 border border-gray-300 shadow-xs">
              {PRICE_PRESETS[pricePresetIndex].label}
              <button onClick={() => setPricePresetIndex(0)} className="hover:text-red-500 ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {minDiscount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs bg-white text-gray-800 border border-gray-300 shadow-xs">
              ≥ {minDiscount}% Off
              <button onClick={() => setMinDiscount(0)} className="hover:text-red-500 ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs bg-white text-gray-800 border border-gray-300 shadow-xs">
              In Stock
              <button onClick={() => setInStockOnly(false)} className="hover:text-red-500 ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* 1. CATEGORIES */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50"
        >
          <span>Categories</span>
          {openSections.categories ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>

        {openSections.categories && (
          <div className="px-4 pb-3 space-y-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`w-full text-left text-xs py-1 px-2 rounded transition-colors ${
                !selectedCategory ? 'text-[#047BD2] font-bold bg-blue-50/50' : 'text-gray-700 hover:text-black'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                className={`w-full text-left text-xs py-1 px-2 rounded flex items-center justify-between transition-colors ${
                  selectedCategory === cat.slug ? 'text-[#047BD2] font-bold bg-blue-50/60' : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>{cat.name}</span>
                {selectedCategory === cat.slug && <Check className="h-3.5 w-3.5 text-[#047BD2]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. PRICE */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50"
        >
          <span>Price</span>
          {openSections.price ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>

        {openSections.price && (
          <div className="px-4 pb-3 space-y-1.5">
            {PRICE_PRESETS.map((preset, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2.5 text-xs text-gray-700 hover:text-black cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="pricePreset"
                  checked={pricePresetIndex === idx}
                  onChange={() => setPricePresetIndex(idx)}
                  className="w-3.5 h-3.5 text-[#047BD2] focus:ring-[#047BD2] border-gray-300"
                />
                <span className={pricePresetIndex === idx ? 'font-semibold text-gray-900' : ''}>
                  {preset.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. COLOR */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection('color')}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50"
        >
          <span>Color</span>
          {openSections.color ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>

        {openSections.color && (
          <div className="px-4 pb-3.5 grid grid-cols-2 gap-2">
            {COLORS.map(c => {
              const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(isSelected ? '' : c.name)}
                  className={`flex items-center gap-2 p-1.5 rounded text-xs text-left transition-all ${
                    isSelected ? 'bg-blue-50 text-[#047BD2] font-semibold border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${c.border ? 'border border-gray-300' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. SIZE */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection('size')}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50"
        >
          <span>Size</span>
          {openSections.size ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>

        {openSections.size && (
          <div className="px-4 pb-3.5 grid grid-cols-4 gap-1.5">
            {SIZES.map(s => {
              const isSelected = selectedSize.toUpperCase() === s.toUpperCase();
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(isSelected ? '' : s)}
                  className={`py-1 text-center text-xs font-medium rounded-sm border transition-all ${
                    isSelected
                      ? 'bg-[#047BD2] text-white border-[#047BD2] font-bold'
                      : 'border-gray-300 text-gray-700 hover:border-gray-500 bg-white'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. DISCOUNT */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => toggleSection('discount')}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50"
        >
          <span>Discount</span>
          {openSections.discount ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>

        {openSections.discount && (
          <div className="px-4 pb-3 space-y-1.5">
            <label className="flex items-center gap-2.5 text-xs text-gray-700 hover:text-black cursor-pointer py-1">
              <input
                type="radio"
                name="discountFilter"
                checked={minDiscount === 0}
                onChange={() => setMinDiscount(0)}
                className="w-3.5 h-3.5 text-[#047BD2] focus:ring-[#047BD2] border-gray-300"
              />
              <span>All Discounts</span>
            </label>
            {DISCOUNT_OPTIONS.map(d => (
              <label
                key={d.min}
                className="flex items-center gap-2.5 text-xs text-gray-700 hover:text-black cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="discountFilter"
                  checked={minDiscount === d.min}
                  onChange={() => setMinDiscount(d.min)}
                  className="w-3.5 h-3.5 text-[#047BD2] focus:ring-[#047BD2] border-gray-300"
                />
                <span className={minDiscount === d.min ? 'font-semibold text-gray-900' : ''}>
                  {d.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 6. AVAILABILITY */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('availability')}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50"
        >
          <span>Availability</span>
          {openSections.availability ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>

        {openSections.availability && (
          <div className="px-4 pb-4">
            <label className="flex items-center gap-2.5 text-xs text-gray-700 hover:text-black cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#047BD2] focus:ring-[#047BD2] border-gray-300"
              />
              <span className={inStockOnly ? 'font-semibold text-gray-900' : ''}>
                Include In-Stock Only
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col font-sans">
      <NotificationComponent />

      {/* Main Luxury Header */}
      <HeroHeader />

      {/* Sub-Header Bar: Breadcrumb & Search Bar */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-3 shadow-2xs">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-[#047BD2]">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span>Search</span>
            {rawQuery && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gray-900 font-medium">"{rawQuery}"</span>
              </>
            )}
          </div>

          {/* Quick Search Re-query Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xl flex items-center bg-gray-50 border border-gray-300 rounded-sm focus-within:border-[#047BD2] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#047BD2] transition-all">
              <Search className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search for clothes, brands, and categories..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
              />
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => setInputQuery('')}
                  className="p-1.5 text-gray-400 hover:text-gray-600 mr-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-[#047BD2] hover:bg-[#0369A1] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-2xs"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Flipkart-Style Main Layout: Sidebar on Left, Products on Right */}
      <div className="max-w-[1500px] w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 flex gap-4 flex-1">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 xl:w-72 flex-shrink-0 hidden lg:block sticky top-28 self-start">
          <FilterSidebar />
        </aside>

        {/* Right Main Content Container */}
        <main className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xs p-4 sm:p-5 shadow-xs flex flex-col">
          {/* Header Bar: Result Count & Sort Options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-gray-900">
                {rawQuery ? `Results for "${rawQuery}"` : 'All Products'}
              </h1>
              <span className="text-xs text-gray-500 font-normal">
                (Showing {sortedProducts.length} of {products.length} products)
              </span>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 self-start"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-gray-600" />
              <span>Filters {hasActiveFilters ? '• Active' : ''}</span>
            </button>

            {/* Flipkart-Style Sort Tabs */}
            <div className="hidden sm:flex items-center gap-4 text-xs">
              <span className="font-bold text-gray-900">Sort By</span>
              {[
                { key: 'relevance', label: 'Relevance' },
                { key: 'popularity', label: 'Popularity' },
                { key: 'price-low', label: 'Price -- Low to High' },
                { key: 'price-high', label: 'Price -- High to Low' },
                { key: 'newest', label: 'Newest First' }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSortBy(tab.key)}
                  className={`pb-1 text-xs transition-colors ${
                    sortBy === tab.key
                      ? 'text-[#047BD2] font-bold border-b-2 border-[#047BD2]'
                      : 'text-gray-600 hover:text-black font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-24 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#047BD2] mx-auto mb-4" />
              <p className="text-sm font-semibold text-gray-700">Loading catalog matches...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="py-16 text-center">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => fetchProducts(rawQuery)}
                className="px-4 py-2 bg-[#047BD2] text-white text-xs font-bold rounded-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sortedProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Sorry, no products matched your criteria
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                Try clearing some of your selected filters or searching with different keywords.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-5 py-2 bg-[#047BD2] hover:bg-[#0369A1] text-white text-xs font-bold uppercase rounded-sm tracking-wider"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Flipkart-Inspired Product Cards Grid (3-4 Large Columns) */}
          {!loading && !error && sortedProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pt-4">
              {sortedProducts.map((product) => {
                const wishlisted = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 rounded-xs overflow-hidden relative"
                  >
                    {/* Image Area - Tall Portrait (3/4 Ratio like Flipkart/KuberFashion) */}
                    <Link
                      to={`/products/${product.id}`}
                      className="block relative overflow-hidden bg-gray-50 aspect-[3/4]"
                    >
                      <img
                        src={product.image || 'https://via.placeholder.com/600x800?text=KuberFashion'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Wishlist Heart Icon (Top Right) */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-transform hover:scale-110 z-10 ${
                          wishlisted ? 'bg-white text-red-500' : 'bg-white/90 text-gray-600 hover:text-black'
                        }`}
                        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
                      </button>

                      {/* Discount Tag (Top Left) */}
                      {product.discount > 0 && (
                        <div className="absolute top-2.5 left-2.5 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-2xs uppercase tracking-wider shadow-2xs">
                          {product.discount}% OFF
                        </div>
                      )}

                      {/* Slide-Up Add to Bag Button on Hover */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.inStock}
                        className="hidden lg:flex absolute inset-x-0 bottom-0 bg-black text-white text-xs font-bold uppercase tracking-wider py-2.5 items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-10 disabled:bg-gray-400"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
                      </button>
                    </Link>

                    {/* Product Details Area (Flipkart Style) */}
                    <div className="p-3.5 flex flex-col flex-1">
                      {/* Brand Tag */}
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-0.5">
                        {product.category || 'KuberFashion'}
                      </span>

                      {/* Product Title */}
                      <Link
                        to={`/products/${product.id}`}
                        className="text-xs sm:text-[13px] font-semibold text-gray-900 hover:text-[#047BD2] line-clamp-1 leading-snug mb-1 transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </Link>

                      {/* Flipkart Price Row */}
                      <div className="flex items-baseline gap-2 mt-auto pt-1 flex-wrap">
                        <span className="text-sm sm:text-base font-black text-gray-900">
                          ₹{Number(product.price).toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{Number(product.originalPrice).toLocaleString()}
                          </span>
                        )}
                        {product.discount > 0 && (
                          <span className="text-xs font-bold text-green-700">
                            {product.discount}% off
                          </span>
                        )}
                      </div>

                      {/* Semantic Match or Flipkart Highlight Tag */}
                      {product.similarityScore && product.similarityScore > 0.50 ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-xs">
                            {Math.round(product.similarityScore * 100)}% Match
                          </span>
                          <span className="text-[10px] font-semibold text-green-700">
                            Lowest price in 30 days
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-green-700 mt-1">
                          Lowest price in 30 days
                        </span>
                      )}

                      {/* Available Sizes Row */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="text-[11px] text-gray-500 mt-1 truncate">
                          <span className="font-medium text-gray-700">Size: </span>
                          {product.sizes.join(', ')}
                        </div>
                      )}

                      {/* Mobile Only: Add to Bag Button */}
                      <div className="lg:hidden mt-3">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!product.inStock}
                          className="w-full py-1.5 bg-[#047BD2] text-white text-xs font-bold uppercase rounded-sm flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-2xs"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <span className="font-bold text-sm uppercase">Filters</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-gray-500 hover:text-black"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <FilterSidebar />
              </div>

              <div className="p-3 border-t border-gray-200 bg-white sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-2.5 bg-[#047BD2] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs"
                >
                  Apply Filters ({sortedProducts.length} Items)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
