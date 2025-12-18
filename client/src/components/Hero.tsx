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
      style={{ paddingTop: '196px' }} 
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
              alt="RASA Logo"
              width={180}
              height={180}
              className="w-48 h-48 object-contain"
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
            className="text-lg md:text-xl text-gray-400 max-w-5xl px-14"
          >
            Custom clothing designed for Gen Z. From warehouse to your wardrobe —
            we print your dreams on premium apparel.
          </motion.p>

          <div className="h-5 md:h-6" />

        </motion.div>

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
