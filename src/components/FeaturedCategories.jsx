import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FeaturedCategoryCard from './FeaturedCategoryCard';
import { categories } from '../data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const FeaturedCategories = () => {
  const scrollContainerRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="bg-white py-16 lg:py-32 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="mx-auto max-w-[1920px] px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-20 px-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 text-primary-500 mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Curated Collections</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-black leading-[0.9] tracking-tighter uppercase relative z-10">
              Shop By <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-400 to-gray-800">Category</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link
              to="/categories"
              className="group flex items-center space-x-3 text-sm font-bold uppercase tracking-widest border border-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-500 rounded-full"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Categories "Ribbon" Container - Mobile Horizontal / Desktop Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="relative"
        >
          {/* Mobile Horizontal Scroll */}
          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className={cn(
                  "flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-auto h-[500px] md:h-[600px] lg:h-[700px] snap-center",
                  // Desktop Grid Spanning Logic
                  category.size === 'large' ? 'md:col-span-2' : '',
                  category.size === 'wide' ? 'lg:col-span-2' : ''
                )}
              >
                <FeaturedCategoryCard category={category} />
              </motion.div>
            ))}
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="md:hidden flex justify-center mt-4 space-x-1">
            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black w-1/3 rounded-full"
                animate={{ x: ["0%", "200%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Mobile View All Button */}
        <div className="mt-12 md:hidden flex justify-center">
          <Link
            to="/categories"
            className="group flex items-center space-x-3 text-xs font-bold uppercase tracking-widest border border-gray-200 px-8 py-4 hover:border-black transition-all duration-300 rounded-full w-full justify-center mx-4"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
