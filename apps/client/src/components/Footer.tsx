import Image from "next/image";
import Link from "next/link";
import { FooterBackgroundGradient, TextHoverEffect } from "./TextHoverEffect";

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden rounded-2xl bg-neutral-950 p-8 md:p-12 text-white border border-neutral-800">
      <FooterBackgroundGradient />

      <div className="relative z-10 flex flex-col gap-12">
        {/* Navigation & Links */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="NOTxRASA" width={36} height={36} />
              <p className="text-lg font-bold tracking-wider text-white">
                NOTXRASA.
              </p>
            </Link>
            <p className="text-sm text-neutral-400">© 2026 NOTxRASA.</p>
            <p className="text-sm text-neutral-400">All rights reserved.</p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-neutral-400 items-center md:items-start">
            <p className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</p>
            <Link href="/" className="hover:text-white transition-colors">Homepage</Link>
            <Link href="/" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex flex-col gap-3 text-sm text-neutral-400 items-center md:items-start">
            <p className="text-sm font-semibold text-white uppercase tracking-wider">Shop</p>
            <Link href="/" className="hover:text-white transition-colors">All Products</Link>
            <Link href="/" className="hover:text-white transition-colors">New Arrivals</Link>
            <Link href="/" className="hover:text-white transition-colors">Best Sellers</Link>
            <Link href="/" className="hover:text-white transition-colors">Sale</Link>
          </div>

          <div className="flex flex-col gap-3 text-sm text-neutral-400 items-center md:items-start">
            <p className="text-sm font-semibold text-white uppercase tracking-wider">Company</p>
            <Link href="/" className="hover:text-white transition-colors">About</Link>
            <Link href="/" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/" className="hover:text-white transition-colors">Affiliate Program</Link>
          </div>
        </div>

        {/* Text Hover Effect Display */}
        <div className="h-[12rem] w-full flex items-center justify-center">
          <TextHoverEffect text="NOTxRASA" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
