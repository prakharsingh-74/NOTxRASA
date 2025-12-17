'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '🎨',
    title: 'Upload Your Design',
    description: 'Have a design? Upload it and see it come to life on premium apparel.',
  },
  {
    icon: '✨',
    title: 'Work With Designers',
    description: 'Our creative team will help bring your vision to reality.',
  },
  {
    icon: '🏆',
    title: 'Premium Quality',
    description: 'We use only the best materials and printing techniques.',
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    description: 'Quick turnaround without compromising on quality.',
  },
];

export default function CustomDesignSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="custom" className="section relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-600 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="mb-6">
            <span className="gradient-text">Create Your Own Story</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-7xl mx-auto px-4 whitespace-nowrap">
            We don't just print designs - we print YOUR dreams. Upload your own artwork or collaborate with our designers to create something truly unique.
          </p>
        </motion.div>

        {/* Main CTA Cards */}
        <div className="grid md:grid-cols-2 gap-10 mb-56">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="text-6xl mb-6">📤</div>
              <h3 className="text-3xl font-bold mb-4 text-white">Upload Your Design</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Got the perfect design? Upload it and we'll handle the rest. 
                Easy drag-and-drop interface with instant previews.
              </p>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upload Now
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-8 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-3xl font-bold mb-4 text-white">Work With Our Designers</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Need help bringing your idea to life? Our talented designers 
                will work with you to create something amazing.
              </p>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div
          className="grid md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-lg font-semibold mb-2 text-white">{feature.title}</h4>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
