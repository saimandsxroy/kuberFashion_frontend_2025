import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FeaturedCategoryCard = ({ category }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Link to={`/categories/${category.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
          
          {/* Product Count Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#047BD2] px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
            {category.productCount}+ items
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-sans group-hover:text-[#00B4D8] transition-colors duration-300">
              {category.name}
            </h3>
            <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed">
              {category.description}
            </p>
          </div>
          
          {/* Arrow Icon */}
          <motion.div
            className="mt-4 flex items-center space-x-2 text-white/80 group-hover:text-white transition-colors duration-300"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm font-medium">Shop Now</span>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#047BD2]/30 transition-colors duration-300" />
      </Link>
    </motion.div>
  );
};

export default FeaturedCategoryCard;
