import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, title = "Featured Products", showTitle = true }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (!products || products.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500">No products found</h3>
            <p className="mt-2 text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4 font-sans">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-[#666666] max-w-2xl mx-auto font-light">
              Discover our handpicked selection of premium fashion items
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="h-full">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        {products.length >= 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 sm:mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-[#047BD2] text-white font-semibold rounded-lg hover:bg-[#0369A1] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Load More Products
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
