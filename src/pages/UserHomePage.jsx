import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/hero';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductRibbon from '../components/ProductRibbon';
import { getFeaturedProducts, fetchProducts } from '../data/products';

const UserHomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        // Load featured products
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured || []);

        // Load all products for other sections
        const allProducts = await fetchProducts();

        // Random products for "Inspired by Your Interest"
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setLikedProducts(shuffled.slice(0, 6));

        // Products sorted by reviews for "Trending"
        const sorted = [...allProducts].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        setTrendingProducts(sorted.slice(0, 8));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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
          loading={loading}
        />

        <ProductRibbon
          products={likedProducts}
          title="Inspired by Your Interest"
          showTitle={true}
          loading={loading}
        />

        <ProductRibbon
          products={trendingProducts}
          title="Trending Now"
          showTitle={true}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UserHomePage;
