import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
    <div className="w-40 sm:w-48 md:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
        <div className="aspect-[4/5] bg-gray-100 animate-pulse"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse"></div>
            <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {showTitle && (
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-900">
                  {title}
                </h2>
                <p className="text-primary-500 mt-1">Curating the best for you...</p>
              </div>
            </div>
          )}
          <div className="overflow-hidden">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {Array.from({ length: 5 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null; // Don't show empty sections
  }

  const linkUrl = viewAllUrl ? viewAllUrl : (
    title === "Top Products" ? "/top-products" :
      title === "Trending Now" ? "/trending" :
        title === "Inspired by Your Interest" ? "/interest-products" :
          "#"
  );

  return (
    <section className="bg-gray-50 py-12 sm:py-16 border-t border-gray-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-8 sm:mb-10"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black leading-tight tracking-tighter uppercase mb-2">
                {title}
              </h2>
            </div>

            <Link
              to={linkUrl}
              className="group hidden sm:flex items-center space-x-2 text-primary-600 hover:text-action transition-colors duration-300 font-medium"
            >
              <span>View Collection</span>
              <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </motion.div>
        )}


        {/* Horizontal Scrollable Products */}
        <div className="relative group/scroll">

          <div className="overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex gap-4 sm:gap-6 w-max"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="w-44 sm:w-56 md:w-64 flex-shrink-0"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}

              {/* View All Card at the end */}
              <motion.div variants={itemVariants} className="w-44 sm:w-56 md:w-64 flex-shrink-0 flex">
                <Link to={linkUrl} className="flex-1 bg-white rounded-2xl border-2 border-dashed border-primary-200 hover:border-action hover:bg-primary-50 transition-all duration-300 flex flex-col items-center justify-center gap-4 group p-6 text-center cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white group-hover:shadow-md">
                    <ArrowRight className="w-6 h-6 text-primary-600 group-hover:text-action" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-primary-900 text-lg">View All</p>
                    <p className="text-sm text-primary-500">Explore the full collection</p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile View All Button */}
          <div className="sm:hidden mt-4 text-center">
            <Link to={linkUrl} className="inline-flex items-center text-action font-semibold text-sm">
              View All {title} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductRibbon;
