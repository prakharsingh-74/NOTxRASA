"use client";

import { Suspense } from "react";
import { Glasses, Shirt, ShoppingBasket } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  {
    name: "All",
    icon: <ShoppingBasket className="w-4 h-4" />,
    slug: "all",
  },
  {
    name: "T-shirts",
    icon: <Shirt className="w-4 h-4" />,
    slug: "t-shirts",
  },
  {
    name: "Hoodies",
    icon: <Shirt className="w-4 h-4" />,
    slug: "hoodies",
  },
  {
    name: "Oversized",
    icon: <Shirt className="w-4 h-4" />,
    slug: "oversized",
  },
  {
    name: "Accessories",
    icon: <Glasses className="w-4 h-4" />,
    slug: "accessories",
  },
];

const CategoriesContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category");

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value || "all");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-5 gap-2 bg-gray-100 p-2 rounded-lg mb-4 text-sm overflow-x-auto">
      {categories.map((category) => (
        <div
          className={`flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md whitespace-nowrap ${
            category.slug === selectedCategory ? "bg-white" : "text-gray-500"
          }`}
          key={category.name}
          onClick={() => handleChange(category.slug)}
        >
          {category.icon}
          {category.name}
        </div>
      ))}
    </div>
  );
};

const Categories = () => {
  return (
    <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg mb-4 animate-pulse" />}>
      <CategoriesContent />
    </Suspense>
  );
};

export default Categories;
