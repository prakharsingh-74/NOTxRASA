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
    hidden: { opacity: 0, y: 40 },
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
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ paddingTop: '96px' }} // navbar-safe offset
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-32 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center pt-24"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-12">
            <Image
              src="/assets/logo.png"
              alt="NOTxRASA Logo"
              width={120}
              height={120}
              className="w-32 h-32 object-contain"
              priority
            />
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="mb-8">
            <span className="text-white">WE INSPIRE </span>
            <span className="gradient-text">YOUR STYLE</span>
          </motion.h1>

          {/* Text */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl"
          >
            Created by God, Made in Heaven
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-5xl px-4"
          >
            Custom clothing designed for Gen Z. From warehouse to your wardrobe —
            we print your dreams on premium apparel.
          </motion.p>

          {/* ✅ REAL SPACER — MOVES CTA DOWN */}
          <div className="h-18 md:h-6" />

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6"
          >
            <a href="#custom" className="btn btn-primary">
              Start Designing
            </a>
            <a href="#products" className="btn btn-secondary">
              Shop Collections
            </a>
          </motion.div>
        </motion.div>

        {/* ✅ SPACER BETWEEN CTA & CARDS */}
        <div className="h-32 md:h-9" />

        {/* Product Cards */}
        <div className="mt-32 pb-40 flex justify-center lg:pl-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {[
              { icon: '👕', label: 'T-Shirts', delay: 0 },
              { icon: '🧥', label: 'Hoodies', delay: 0.3 },
              { icon: '👔', label: 'Shirts', delay: 0.6 },
              { icon: '🎨', label: 'Custom', delay: 0.9 },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={floatingVariants}
                animate="float"
                style={{ animationDelay: `${item.delay}s` }}
                className="glass-card p-7 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="text-sm font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 translate-y-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </motion.div>


      </div>
    </section>
  );
}
