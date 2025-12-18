'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function BrandStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section bg-black/30 py-32" ref={ref}>
      <div className="container">
        {/* About Us */}
        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="mb-8 text-4xl md:text-5xl">
              About <span className="gradient-text">NOTxRASA</span>
            </h2>
            <div className="glass-card p-8 space-y-5">
              <p className="text-lg text-gray-300 leading-relaxed">
                We are a brand built by the Gen Z to meet the ever-changing styles of the Gen Z. 
                We at <strong className="text-white font-semibold">NOTxRASA</strong> try to end the nothingness of Gen Z fashion 
                with togetherness of our products.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We're on a bond to deliver the best quality products at the most affordable price.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-2xl font-semibold text-white italic bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  "Created by God, Made in Heaven"
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden group border border-white/10 shadow-2xl">
              <Image
                src="/assets/brand-story-1.png"
                alt="NOTxRASA Brand Story"
                width={600}
                height={400}
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-colors duration-500" />
            </div>
          </motion.div>
        </div>

        {/* Why Choose Us & Special Edition */}
        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative order-2 md:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden group border border-white/10 shadow-2xl">
              <Image
                src="/assets/brand-story-2.png"
                alt="Our Service & Products"
                width={600}
                height={400}
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-colors duration-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="order-1 md:order-2 space-y-6"
          >
            <h2 className="mb-8 text-4xl md:text-5xl">
              Why Choose <span className="gradient-text">Our Products?</span>
            </h2>
            <div className="glass-card p-8 space-y-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                We're one stop solution to all your clothing needs from bulk custom clothing orders 
                to make your brand or firm stand out we provide everything under one roof.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mr-4 mt-0.5 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                    ✓
                  </span>
                  <span className="text-gray-300 text-lg leading-relaxed">Latest collection of aesthetic wears in all sizes</span>
                </li>
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mr-4 mt-0.5 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                    ✓
                  </span>
                  <span className="text-gray-300 text-lg leading-relaxed">Premium fabrics engineered for hot summers</span>
                </li>
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mr-4 mt-0.5 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                    ✓
                  </span>
                  <span className="text-gray-300 text-lg leading-relaxed">Wide range of customization options</span>
                </li>
                <li className="flex items-start group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mr-4 mt-0.5 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                    ✓
                  </span>
                  <span className="text-gray-300 text-lg leading-relaxed">Best quality at most affordable prices</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Happy Faces - Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="relative rounded-2xl overflow-hidden max-w-9xl mx-auto border border-white/10 shadow-2xl">
            <Image
              src="/assets/brand-story-3.png"
              alt="Happy Customers - Team NOTxRASA"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10 md:p-12">
              <div className="glass-card p-8 inline-block">
                <h3 className="text-4xl font-bold mb-4 gradient-text">Happy Faces</h3>
                <p className="text-lg text-gray-200 leading-relaxed mb-3">
                  Your smile and you matter most to us and we will do our best to deliver 
                  beautiful smiles with our each product.
                </p>
                <p className="text-base text-gray-400 font-medium">Team NOTxRASA</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
