'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const categories = [
  {
    title: 'Hoodies',
    emoji: '🧥',
    description: 'Premium hoodies with custom prints',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    title: 'T-Shirts',
    emoji: '👕',
    description: 'Comfortable tees for everyday wear',
    gradient: 'from-red-600 to-pink-500',
  },
  {
    title: 'Shirts',
    emoji: '👔',
    description: 'Professional shirts with style',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    title: 'Accessories',
    emoji: '🎨',
    description: 'Complete your look',
    gradient: 'from-red-700 to-red-500',
  },
];

export default function ProductCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section id="products" className="section bg-black/20" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-[250px]"
        >
          <h2 className="mb-16">
            Our <span className="gradient-text">Collections</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-7xl mx-auto px-4 whitespace-nowrap">
            Explore our best-selling products. From hoodies to tees, we've got your style covered.
          </p>
        </motion.div>

        <div className="h-7" />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <div className="glass-card h-full cursor-pointer overflow-hidden flex flex-col">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center py-10 px-8 flex-1">
                  <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {category.title}
                  </h3>
                  <p className="text-gray-400 mb-8 flex-1">{category.description}</p>
                  
                  <motion.button
                    className="btn btn-secondary text-sm py-2 px-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore
                  </motion.button>
                </div>

                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${category.gradient} rounded-lg opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-300 -z-10`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
