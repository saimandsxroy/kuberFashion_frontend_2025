import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, SlidersHorizontal, Search } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { Button } from '../components/Button';
import { productsAPI } from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        setFilteredResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Searching for products:', query);
        const response = await productsAPI.search(query);
        
        if (response.data?.success) {
          const searchResults = response.data.data?.content || response.data.data || [];
          console.log('✅ Search results:', searchResults.length);
          setResults(searchResults);
          setFilteredResults(searchResults);
        } else {
          console.warn('⚠️ No search results found for:', query);
          setResults([]);
          setFilteredResults([]);
        }
      } catch (error) {
        console.error('❌ Error searching products:', error);
        setError('Failed to search products. Please try again.');
        setResults([]);
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  useEffect(() => {
    let filtered = [...results];

    // Apply price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredResults(filtered);
  }, [results, sortBy, priceRange]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Error</h2>
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
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] flex items-center">
                  <Search className="h-6 w-6 mr-2 text-[#047BD2]" />
                  Search Results
                </h1>
                <p className="text-gray-600 mt-1">
                  {query ? `Results for "${query}"` : 'Enter a search term to find products'}
                </p>
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
                  <option value="relevance">Relevance</option>
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
                    max="500"
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
                  setSortBy('relevance');
                  setPriceRange([0, 500]);
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {query ? (
                  <>
                    Showing {filteredResults.length} of {results.length} results for "{query}"
                  </>
                ) : (
                  'Enter a search term to find products'
                )}
              </p>
            </div>

            {/* Results Grid */}
            {!query ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
                <p className="text-gray-600">Use the search bar above to find products</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">
                  No products found matching "{query}". Try different keywords or check your spelling.
                </p>
              </div>
            ) : (
              <ProductGrid 
                products={filteredResults} 
                showTitle={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
