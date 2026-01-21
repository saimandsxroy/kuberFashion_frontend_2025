import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { Button } from '../components/Button';
import { fetchProducts } from '../data/products';

const TrendingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const allProducts = await fetchProducts();
        // Get products sorted by reviews/rating for "trending"
        const sorted = [...allProducts].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        setProducts(sorted.slice(0, 8));
      } catch (error) {
        console.error("Failed to load trending products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="flex items-center space-x-2 text-[#047BD2] hover:text-[#0369A1]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
                Trending Now
              </h1>
              <p className="text-gray-600 mt-1">Discover what's popular right now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/5] bg-gray-200 rounded-[2px]"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            showTitle={false}
          />
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
