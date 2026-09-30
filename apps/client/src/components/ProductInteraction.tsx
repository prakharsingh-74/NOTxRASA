"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: ProductType;
  selectedSize: string;
  selectedColor: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartStore();

  const handleTypeChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const stock = product.stock ?? 10;

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      if (quantity < stock) {
        setQuantity((prev) => prev + 1);
      } else {
        toast.info(`Only ${stock} pieces available in stock`);
      }
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    if (stock === 0) {
      toast.error("This product is currently out of stock!");
      return;
    }
    addToCart({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });
    toast.success("Product added to cart");
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* STOCK STATUS BADGE */}
      <div>
        {stock === 0 ? (
          <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md border border-red-200">
            Out of Stock (0 pieces)
          </span>
        ) : stock <= 5 ? (
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
            Hurry! Only {stock} piece(s) left in stock
          </span>
        ) : (
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200">
            In Stock ({stock} available)
          </span>
        )}
      </div>

      {/* SIZE */}
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-gray-500">Size</span>
        <div className="flex items-center gap-2">
          {product.sizes.map((size: string) => (
            <div
              className={`cursor-pointer border-1 p-[2px] ${
                selectedSize === size ? "border-gray-600" : "border-gray-300"
              }`}
              key={size}
              onClick={() => handleTypeChange("size", size)}
            >
              <div
                className={`w-6 h-6 text-center flex items-center justify-center ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {size.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* COLOR */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-500">Color</span>
        <div className="flex items-center gap-2">
          {product.colors.map((color: string) => (
            <div
              className={`cursor-pointer border-1 p-[2px] ${
                selectedColor === color ? "border-gray-300" : "border-white"
              }`}
              key={color}
              onClick={() => handleTypeChange("color", color)}
            >
              <div className={`w-6 h-6`} style={{ backgroundColor: color }} />
            </div>
          ))}
        </div>
      </div>
      {/* QUANTITY */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-500">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            disabled={stock === 0 || quantity <= 1}
            className="cursor-pointer border-1 border-gray-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span>{stock === 0 ? 0 : quantity}</span>
          <button
            disabled={stock === 0 || quantity >= stock}
            className="cursor-pointer border-1 border-gray-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* BUTTONS */}
      <button
        onClick={handleAddToCart}
        disabled={stock === 0}
        className={`px-4 py-2.5 rounded-md shadow-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
          stock === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
            : "bg-black hover:bg-gray-800 text-white cursor-pointer"
        }`}
      >
        <Plus className="w-4 h-4" />
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductInteraction;
