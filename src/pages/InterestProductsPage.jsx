import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { Button } from '../components/Button';
import { products } from '../data/products';

const InterestProductsPage = () => {
  const navigate = useNavigate();
  const interestProducts = products.slice(0, 6); // Mock interest products

  useEffect(() => {
    window.scrollTo(0, 0);
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
                Inspired by Your Interest
              </h1>
              <p className="text-gray-600 mt-1">Curated picks based on your preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid 
          products={interestProducts} 
          showTitle={false}
        />
      </div>
    </div>
  );
};

export default InterestProductsPage;
