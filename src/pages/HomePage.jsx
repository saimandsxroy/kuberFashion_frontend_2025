import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/hero';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductRibbon from '../components/ProductRibbon';
import { getFeaturedProducts, fetchProducts } from '../data/products';
import { productsAPI } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [kvisionProducts, setKvisionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919179193970';
  const WHATSAPP_TEXT = encodeURIComponent(import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE || 'Hi! I have a question about KuberFashion.');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load personalized recommendations
        try {
          const recRes = await productsAPI.getPersonalizedRecommendations({ limit: 8 });
          setRecommendedProducts(recRes.data.data || []);
        } catch (e) {
          console.warn("Could not load personalized recommendations", e);
        }

        // Load featured products
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured);

        // Load all products for other sections
        const allProducts = await fetchProducts();

        // Get top-rated products for "Inspired by Your Interest"
        try {
          const topRatedResponse = await productsAPI.getTopRated();
          setLikedProducts(topRatedResponse.data.data?.slice(0, 6) || allProducts.slice(0, 6));
        } catch (err) {
          setLikedProducts(allProducts.slice(0, 6));
        }

        // Get newest products for "Trending Now"
        try {
          const newestResponse = await productsAPI.getNewest();
          setTrendingProducts(newestResponse.data.data?.slice(0, 6) || allProducts.slice(2, 8));
        } catch (err) {
          setTrendingProducts(allProducts.slice(2, 8));
        }

        // Get Offer products
        try {
          const offersRes = await productsAPI.getOffers();
          setOfferProducts(offersRes.data.data || []);
        } catch (err) {
          console.error("Failed to load offers", err);
        }

        // KVision Products
        try {
          const kRes = await productsAPI.getAll({ category: 'kvision', limit: 4 });
          setKvisionProducts(kRes.data.data?.items || kRes.data.data || []);
        } catch (e) {
          console.error("Failed to load KVision", e);
        }

      } catch (err) {
        console.error('Error loading homepage products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      {/* Reduced spacing between sections */}
      <div className="space-y-4 sm:space-y-6">
        <FeaturedCategories />

        {/* Special Offers Ribbon */}
        {offerProducts.length > 0 && (
          <ProductRibbon
            products={offerProducts}
            title="Special Offers"
            showTitle={true}
            loading={loading}
          />
        )}

        {/* KVision Membership Section - Below Shop by Category */}
        {kvisionProducts.length > 0 && (
          <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-12 sm:py-16 border-y border-gray-100/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8 sm:mb-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-black leading-tight tracking-tighter uppercase mb-2">
                    KVision Membership
                  </h2>
                  <p className="text-primary-500 mt-1">Purchase specific products to unlock premium membership.</p>
                </div>
                <a
                  href="/categories/kvision"
                  className="group hidden sm:flex items-center space-x-2 text-primary-600 hover:text-action transition-colors duration-300 font-medium"
                >
                  <span>View All</span>
                  <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:translate-x-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </a>
              </div>
              <ProductRibbon products={kvisionProducts} title="" showTitle={false} loading={loading} viewAllUrl="/categories/kvision" />
            </div>
          </section>
        )}

        {/* Recommended for You Ribbon */}
        {recommendedProducts.length > 0 && (
          <ProductRibbon
            products={recommendedProducts}
            title="Recommended for You"
            showTitle={true}
            loading={loading}
          />
        )}

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

      {/* Floating WhatsApp Button */}
      {WHATSAPP_NUMBER && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.59 5.98L0 24l6.17-1.62A11.96 11.96 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22a9.96 9.96 0 01-5.07-1.41l-.36-.21-3.62.95.97-3.53-.23-.37A9.96 9.96 0 012 12C2 6.49 6.49 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.96 9.96 0 0122 12c0 5.51-4.49 10-10 10zm5.15-7.66c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.62.14-.19.28-.72.89-.88 1.07-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.48.14-.16.18-.27.28-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.44-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.28s.98 2.64 1.12 2.83c.14.18 1.93 2.95 4.68 4.04.65.28 1.15.45 1.55.58.65.21 1.25.18 1.72.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.2-.53-.34z" />
          </svg>
        </a>
      )}
    </div>
  );
};

export default HomePage;
