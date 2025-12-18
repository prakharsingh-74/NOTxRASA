'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: ['Hoodies', 'T-Shirts', 'Shirts', 'Accessories'],
    Company: ['About Us', 'Our Story', 'Contact', 'FAQ'],
    Support: ['Size Guide', 'Care Instructions'],
  };

  return (
    <footer id="contact" className="relative bg-black mt-40 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      <div className="h-10" />
      {/* MAIN CONTAINER */}
      <div className="container mx-auto px-8 lg:px-24 pt-32 pb-32">

        {/* ================= TOP FOOTER ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 gap-x-16">

          {/* Brand */}
          <div className="md:col-span-4 space-y-10">
            <div className="space-y-6">
              <h3 className="text-5xl font-bold gradient-text tracking-tight">
                NOTxRASA
              </h3>
              <p className="text-gray-400 text-base max-w-sm tracking-wide">
                Created by God, Made in Heaven.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Connect With Us
              </p>
              <div className="flex gap-4">
                <SocialIcon href="https://instagram.com/notxrasa" icon="instagram" label="Instagram" />
                <SocialIcon href="mailto:notrasa5@gmail.com" icon="email" label="Email" />
                <SocialIcon href="#" icon="twitter" label="Twitter" />
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-14">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-6">
                <h4 className="text-xl font-semibold text-white relative inline-block">
                  {title}
                  <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-red-500 to-transparent" />
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors tracking-wide"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="h-17" />

        {/* ================= NEWSLETTER ================= */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* LEFT: Text */}
            <div className="space-y-4 text-left">
              <h4 className="text-4xl font-bold text-white tracking-tight">
        Stay Updated
      </h4>
      <p className="text-gray-400 text-lg leading-relaxed max-w-md">
        Get exclusive drops, limited offers, and style inspiration —
        straight to your inbox.
      </p>
    </div>

    {/* RIGHT: Form */}
    <form className="flex flex-col sm:flex-row gap-4 justify-end">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full sm:w-[360px] px-6 py-6 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
      />
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-10 py-6 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors whitespace-nowrap"
      >
        Subscribe
      </motion.button>
    </form>

  </div>
        </section>


        {/* ================= SPACER BEFORE BOTTOM ================= */}
        <div className="h-12" />

        {/* ================= BOTTOM BAR ================= */}
        <div className=" pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            <p className="text-gray-500 text-center md:text-left tracking-wide">
              © {currentYear} NOTxRASA. All rights reserved.
              <span className="ml-1">Made with ❤️ for Gen Z</span>
            </p>

            <nav className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-700">•</span>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </a>
            </nav>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* ================= SOCIAL ICON ================= */
function SocialIcon({
  href,
  icon,
  label,
}: {
  href: string;
  icon: 'instagram' | 'email' | 'twitter';
  label: string;
}) {
  const icons = {
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-all duration-300"
    >
      {icons[icon]}
    </motion.a>
  );
}
