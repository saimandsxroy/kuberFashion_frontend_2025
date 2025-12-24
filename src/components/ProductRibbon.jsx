import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductRibbon = ({ products, title = "Featured Products", showTitle = true, loading = false, viewAllUrl }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="w-40 sm:w-48 md:w-52 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="aspect-square bg-gray-200 animate-pulse"></div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {showTitle && (
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1a1a] font-sans">
                  {title}
                </h2>
                <p className="text-sm sm:text-base text-[#666666] mt-1">
                  Loading products...
                </p>
              </div>
            </div>
          )}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 sm:gap-4 w-max">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {showTitle && (
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1a1a] font-sans">
                  {title}
                </h2>
                <p className="text-sm sm:text-base text-[#666666] mt-1">
                  No products available
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-6 sm:mb-8"
          >
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1a1a] font-sans">
                {title}
              </h2>
              <p className="text-sm sm:text-base text-[#666666] mt-1">
                Handpicked for you
              </p>
            </div>
            <Link 
              to={
                viewAllUrl ? viewAllUrl : (
                  title === "Top Products" ? "/top-products" :
                  title === "Trending Now" ? "/trending" :
                  title === "Inspired by Your Interest" ? "/interest-products" :
                  "#"
                )
              }
              className="text-[#047BD2] hover:text-[#0369A1] font-medium text-sm sm:text-base transition-colors duration-200"
            >
              View All
            </Link>
          </motion.div>
        )}

        {/* Horizontal Scrollable Products */}
        <div className="relative">
          {/* Gradient fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex gap-3 sm:gap-4 w-max"
            >
              {products.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={itemVariants}
                  className="w-40 sm:w-48 md:w-52 flex-shrink-0"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductRibbon;
