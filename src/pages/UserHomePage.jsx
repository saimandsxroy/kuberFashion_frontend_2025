import React from 'react';
import { HeroSection } from '../components/hero';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductRibbon from '../components/ProductRibbon';
import { getFeaturedProducts, products } from '../data/products';


const UserHomePage = () => {
  const featuredProducts = getFeaturedProducts();
  const likedProducts = products.slice(0, 6); // Mock liked products
  const trendingProducts = products.slice(2, 8); // Mock trending products

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      {/* Reduced spacing between sections */}
      <div className="space-y-4 sm:space-y-6">
        <FeaturedCategories />
        
        <ProductRibbon 
          products={featuredProducts} 
          title="Top Products"
          showTitle={true}
        />
        
        <ProductRibbon 
          products={likedProducts} 
          title="Inspired by Your Interest"
          showTitle={true}
        />
        
        <ProductRibbon 
          products={trendingProducts} 
          title="Trending Now"
          showTitle={true}
        />
      </div>
    </div>
  );
};

export default UserHomePage;
