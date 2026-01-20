import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const FeaturedCategoryCard = ({ category }) => {
  return (
    <Link to={`/categories/${category.slug}`} className="block h-full w-full group relative overflow-hidden rounded-none cursor-pointer">
      {/* Background Image with Parallax-like Zoom */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          loading="lazy"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-40" />
      </div>

      {/* Floating Badge (Top Right) */}
      <div className="absolute top-6 right-6 z-20">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transform rotate-45 group-hover:rotate-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-10 w-full">
        <div className="transform transition-transform duration-700 group-hover:-translate-y-2">

          {/* Product Count Tag */}
          <div className="overflow-hidden mb-3">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 border border-white/30 backdrop-blur-sm"
            >
              {category.productCount} Items
            </motion.span>
          </div>

          {/* Category Title */}
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-[0.85] tracking-tighter uppercase mb-4 drop-shadow-2xl">
            {category.name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h3>

          {/* Hidden Description Reveal */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]">
            <div className="overflow-hidden">
              <div className="pt-2">
                <p className="text-base text-gray-300 font-light max-w-sm leading-relaxed border-l-2 border-white/30 pl-4">
                  {category.description}
                </p>

                <div className="mt-6 flex items-center space-x-3 text-white font-medium group/btn">
                  <span className="uppercase tracking-widest text-xs border-b border-transparent group-hover/btn:border-white transition-all pb-1">Shop Collection</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCategoryCard;
