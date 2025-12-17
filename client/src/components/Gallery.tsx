'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import Image from 'next/image';

const galleryImages = [
  {
    src: '/assets/gallery/slide1.png',
    alt: 'Design Concept 1',
  },
  {
    src: '/assets/gallery/slide2.png',
    alt: 'Design Concept 2',
  },
  {
    src: '/assets/gallery/slide3.png',
    alt: 'Design Concept 3',
  },
  {
    src: '/assets/gallery/slide4.png',
    alt: 'Design Concept 4',
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="gallery" className="section bg-black/20 overflow-hidden" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-32"
        >
          <h2 className="mb-6">
            Our <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Explore our design concepts and creative journey
          </p>
        </motion.div>

        {/* Auto-scrolling slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -100 * galleryImages.length + '%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 20,
                  ease: 'linear',
                },
              }}
            >
              {/* Render images twice for seamless loop */}
              {[...galleryImages, ...galleryImages].map((image, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-[600px] h-[400px] relative rounded-lg overflow-hidden glass-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-semibold text-lg">{image.alt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
