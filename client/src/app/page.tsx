import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import CustomDesignSection from "@/components/CustomDesignSection";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ProductCategories />
      <CustomDesignSection />
      <BrandStory />
      <Footer />
    </main>
  );
}