import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Tag,
  Palette,
  Ruler,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { Button } from '../components/Button';
import { productsAPI } from '../services/api';

const EXAMPLE_QUERIES = [
  "Black kurta under ₹1500",
  "Blue shirts in size M",
  "Traditional clothes for a wedding",
  "Casual wear under ₹2000",
  "Show products in stock in black"
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawQuery = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(rawQuery);
  const [results, setResults] = useState([]);
  const [parsedIntent, setParsedIntent] = useState(null);
  const [manualOverrides, setManualOverrides] = useState({});
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSmartSearch, setUseSmartSearch] = useState(true);

  // Sync inputQuery when URL query changes
  useEffect(() => {
    setInputQuery(rawQuery);
    setManualOverrides({});
  }, [rawQuery]);

  const executeSearch = useCallback(async (queryText, overrides = {}, smartMode = true) => {
    if (!queryText.trim()) {
      setResults([]);
      setParsedIntent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (smartMode) {
        // AI Smart Search
        const payload = {
          query: queryText.trim(),
          ...overrides
        };

        const response = await productsAPI.smartSearch(payload);
        if (response.data?.success && response.data?.data) {
          const data = response.data.data;
          setParsedIntent(data.intent || null);
          const productsList = data.products || [];
          setResults(productsList);
        } else {
          setResults([]);
          setParsedIntent(null);
        }
      } else {
        // Classic Keyword Search
        const response = await productsAPI.search(queryText.trim());
        if (response.data?.success) {
          const list = response.data.data?.content || response.data.data || [];
          setResults(list);
          setParsedIntent(null);
        } else {
          setResults([]);
          setParsedIntent(null);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      // If smart search had an unexpected failure, try falling back to classic search
      if (smartMode) {
        try {
          const fallbackRes = await productsAPI.search(queryText.trim());
          const list = fallbackRes.data?.data?.content || fallbackRes.data?.data || [];
          setResults(list);
          setParsedIntent({
            rawQuery: queryText,
            aiInterpreted: false,
            fallbackReason: 'Direct fallback to keyword matching'
          });
          return;
        } catch (innerErr) {
          setError('Failed to fetch search results. Please try again.');
        }
      } else {
        setError('Failed to fetch search results. Please try again.');
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search on query or override changes
  useEffect(() => {
    executeSearch(rawQuery, manualOverrides, useSmartSearch);
  }, [rawQuery, manualOverrides, useSmartSearch, executeSearch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setManualOverrides({});
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  const handleSelectExample = (example) => {
    setInputQuery(example);
    setManualOverrides({});
    setSearchParams({ q: example });
  };

  const handleRemoveChip = (chipKey) => {
    setManualOverrides(prev => {
      const next = { ...prev };
      // Explicitly nullify or clear in overrides
      if (chipKey === 'maxPrice' || chipKey === 'minPrice') {
        next[chipKey] = 0;
      } else if (chipKey === 'inStockOnly') {
        next.inStockOnly = false;
      } else {
        next[chipKey] = '';
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setManualOverrides({});
  };

  // Sort results client-side for immediate responsiveness
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  // Effective intent combines AI parsed intent with manual overrides
  const effectiveIntent = parsedIntent ? {
    ...parsedIntent,
    ...manualOverrides
  } : null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">

      {/* Hero Search Header */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white pt-24 pb-14 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="mx-auto max-w-5xl">

          {/* Navigation Back */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </button>

          {/* Title & Badge */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-400/40 text-amber-300">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  AI Natural-Language Search
                </span>
                <span className="text-[11px] text-gray-400 hidden sm:inline">• Powered by Google Gemini</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                Find exactly what you want
              </h1>
            </div>

            {/* Smart Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-800/80 p-1.5 rounded-full border border-gray-700 text-xs">
              <button
                type="button"
                onClick={() => setUseSmartSearch(true)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  useSmartSearch ? 'bg-white text-black font-bold shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                ✨ AI Smart Mode
              </button>
              <button
                type="button"
                onClick={() => setUseSmartSearch(false)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  !useSmartSearch ? 'bg-white text-black font-bold shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                Classic Search
              </button>
            </div>
          </div>

          {/* Natural Language Search Input Form */}
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-gray-200">
              <div className="pl-4 text-gray-400">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask in natural language (e.g. 'Black kurta under 1500 in size M' or 'Blue shirts in stock')..."
                className="w-full px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
              />
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => setInputQuery('')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Button
                type="submit"
                className="rounded-xl px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 flex-shrink-0"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </form>

          {/* Example Query Pills */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Try:
            </span>
            {EXAMPLE_QUERIES.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(example)}
                className="text-xs bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-all duration-200"
              >
                "{example}"
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">

        {/* AI Interpretation & Filter Chips Section */}
        {useSmartSearch && effectiveIntent && rawQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {effectiveIntent.aiInterpreted ? '✨ AI Query Interpretation:' : '⚡ Heuristic Query Interpretation:'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {effectiveIntent.interpretationSummary || `Results for "${rawQuery}"`}
                </span>
              </div>

              {effectiveIntent.fallbackReason && (
                <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                  {effectiveIntent.fallbackReason}
                </span>
              )}
            </div>

            {/* Interpreted Filter Chips */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Active Filters:</span>

              {/* Keywords Chip */}
              {effectiveIntent.keywords && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                  <Tag className="h-3 w-3 text-gray-500" />
                  Keyword: {effectiveIntent.keywords}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('keywords')}
                    className="hover:text-red-500 ml-1"
                    title="Remove keyword filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Category Chip */}
              {effectiveIntent.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  <Layers className="h-3 w-3 text-blue-500" />
                  Category: {effectiveIntent.category}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('category')}
                    className="hover:text-red-500 ml-1"
                    title="Remove category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Color Chip */}
              {effectiveIntent.color && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                  <Palette className="h-3 w-3 text-purple-500" />
                  Color: {effectiveIntent.color}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('color')}
                    className="hover:text-red-500 ml-1"
                    title="Remove color filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Size Chip */}
              {effectiveIntent.size && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Ruler className="h-3 w-3 text-emerald-600" />
                  Size: {effectiveIntent.size}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('size')}
                    className="hover:text-red-500 ml-1"
                    title="Remove size filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Max Price Chip */}
              {effectiveIntent.maxPrice && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Price: ≤ ₹{Number(effectiveIntent.maxPrice).toLocaleString()}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('maxPrice')}
                    className="hover:text-red-500 ml-1"
                    title="Remove price filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* In-Stock Only Chip */}
              {effectiveIntent.inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-800 border border-green-200">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  In-Stock Only
                  <button
                    type="button"
                    onClick={() => handleRemoveChip('inStockOnly')}
                    className="hover:text-red-500 ml-1"
                    title="Remove in-stock filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Reset All Chips */}
              {Object.keys(manualOverrides).length > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black font-semibold ml-2 underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset to Original AI Interpretation
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Results Bar: Counts & Sorting */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {results.length} {results.length === 1 ? 'Product Found' : 'Products Found'}
            </h2>
            <p className="text-xs text-gray-500">Real-time inventory from catalog and active variants</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-black/5 mb-4 animate-spin">
              <Sparkles className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-base font-bold text-gray-900">AI is understanding your query...</h3>
            <p className="text-xs text-gray-500 mt-1">Filtering products by size, color, price and inventory availability.</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center my-8">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-red-800">Search Error</h3>
            <p className="text-xs text-red-600 mt-1 mb-4">{error}</p>
            <Button
              onClick={() => executeSearch(rawQuery, manualOverrides, useSmartSearch)}
              className="bg-black hover:bg-gray-800 text-white text-xs uppercase"
            >
              Retry Search
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedResults.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
              {rawQuery ? <Search className="h-8 w-8" /> : <Sparkles className="h-8 w-8 text-amber-500" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {rawQuery ? 'No products matched your search' : 'Start your search with AI'}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-2">
              {rawQuery
                ? "We couldn't find any available products matching your specific combination of filters. Try clearing some filters or searching for broader terms."
                : "Describe what you're looking for in plain language — like colors, sizes, categories, or price ranges."}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              {rawQuery && (
                <Button
                  onClick={handleResetFilters}
                  className="bg-black text-white text-xs uppercase tracking-wider font-bold rounded-xl px-5"
                >
                  Clear Filters
                </Button>
              )}
              <Button
                onClick={() => handleSelectExample(EXAMPLE_QUERIES[0])}
                variant={rawQuery ? 'outline' : 'default'}
                className={`text-xs uppercase tracking-wider font-bold rounded-xl px-5 ${
                  rawQuery ? 'border-gray-200' : 'bg-black text-white'
                }`}
              >
                Try "{EXAMPLE_QUERIES[0]}"
              </Button>
            </div>
          </div>
        )}

        {/* Product Grid Results */}
        {!loading && !error && sortedResults.length > 0 && (
          <div className="mt-4">
            <ProductGrid products={sortedResults} showTitle={false} />
          </div>
        )}

      </main>

    </div>
  );
};

export default SearchResults;
