import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RASA",
  description: "Premium custom clothing brand offering hoodies, t-shirts, shirts, and more. Upload your design or work with our designers. Created by God, Made in Heaven.",
  keywords: "custom clothing, hoodies, t-shirts, Gen Z fashion, custom prints, RASA, apparel",
  authors: [{ name: "RASA" }],
  openGraph: {
    title: "RASA - We Inspire Your Style",
    description: "Custom clothing designed for Gen Z. Your design, your story.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
