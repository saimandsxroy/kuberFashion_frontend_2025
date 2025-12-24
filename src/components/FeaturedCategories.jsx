import React from 'react';
import { motion } from 'framer-motion';
import FeaturedCategoryCard from './FeaturedCategoryCard';
import { categories } from '../data/categories';

const FeaturedCategories = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="bg-white pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4 font-sans">
            Shop by <span className="text-[#047BD2]">Category</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#666666] max-w-2xl mx-auto font-light leading-relaxed">
            Discover our curated collections designed for every style and occasion
          </p>
        </motion.div>

        {/* Categories Container */}
        <div className="relative">
          {/* Horizontal Scroll Container for mobile */}
          <div className="lg:hidden overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex gap-4 w-max min-w-full"
            >
              {categories.map((category) => (
                <motion.div 
                  key={category.id} 
                  variants={itemVariants}
                  className="w-64 flex-shrink-0"
                >
                  <FeaturedCategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Grid for larger screens */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <FeaturedCategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-[#047BD2] text-[#047BD2] font-semibold rounded-lg hover:bg-[#047BD2] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View All Categories
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
