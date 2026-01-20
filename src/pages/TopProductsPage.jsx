import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { Button } from '../components/Button';
import { getFeaturedProducts } from '../data/products';

const TopProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const data = await getFeaturedProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load top products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="group flex items-center space-x-2 text-gray-500 hover:text-black transition-colors pl-0"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-xs font-bold">Back to Home</span>
            </Button>

            <div className="pl-4 border-l border-gray-200">
              <h1 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter leading-none">
                Top Products
              </h1>
              <p className="text-gray-500 text-sm font-medium tracking-wide mt-1">Our best-selling and highest-rated items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
            {[...Array(10)].map((_, i) => (
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

export default TopProductsPage;
