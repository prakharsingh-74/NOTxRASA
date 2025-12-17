'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 py-20 px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-10">
            <Image
              src="/assets/logo.png"
              alt="NOTxRASA Logo"
              width={200}
              height={200}
              className="w-48 h-48 object-contain"
              priority
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={itemVariants} className="mb-8">
            <span className="text-white">WE INSPIRE </span>
            <span className="gradient-text">YOUR STYLE</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl"
          >
            Created by God, Made in Heaven
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 mb-14 max-w-5xl px-4 whitespace-nowrap"
          >
            Custom clothing designed for Gen Z. From warehouse to your wardrobe - we print your dreams on premium apparel.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 mb-48"
          >
            <a href="#custom" className="btn btn-primary">
              Start Designing
            </a>
            <a href="#products" className="btn btn-secondary">
              Shop Collections
            </a>
          </motion.div>

          {/* Floating Product Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 max-w-4xl mx-auto">
            <motion.div
              variants={floatingVariants}
              animate="float"
              className="glass-card p-4 text-center"
            >
              <div className="text-4xl mb-2">👕</div>
              <p className="text-sm font-semibold">T-Shirts</p>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="float"
              className="glass-card p-4 text-center"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="text-4xl mb-2">🧥</div>
              <p className="text-sm font-semibold">Hoodies</p>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="float"
              className="glass-card p-4 text-center"
              style={{ animationDelay: '1s' }}
            >
              <div className="text-4xl mb-2">👔</div>
              <p className="text-sm font-semibold">Shirts</p>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="float"
              className="glass-card p-4 text-center"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm font-semibold">Custom</p>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center p-2">
              <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
