"use client";

import useCartStore from "@/stores/cartStore";
import { getValidImageUrl, ProductType } from "@repo/types";
import { Package, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [productTypes, setProductTypes] = useState({
    size: product.sizes[0]!,
    color: product.colors[0]!,
  });

  const { addToCart } = useCartStore();

  const handleProductType = ({
    type,
    value,
  }: {
    type: "size" | "color";
    value: string;
  }) => {
    setProductTypes((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: productTypes.size,
      selectedColor: productTypes.color,
    });
    toast.success("Product added to cart")
  };

  const imageUrl = getValidImageUrl(product.images, productTypes.color);

  const stock = product.stock ?? 10;

  return (
    <div className="shadow-lg rounded-lg overflow-hidden relative">
      {/* IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[2/3] bg-gray-100 flex items-center justify-center">
          {stock === 0 && (
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Out of Stock
            </div>
          )}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-cover hover:scale-105 transition-all duration-300 ${stock === 0 ? "opacity-60 grayscale-[30%]" : ""}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 gap-1.5 p-4 text-center">
              <Package className="w-10 h-10 stroke-[1.5]" />
              <span className="text-xs font-medium text-gray-400">No Image Available</span>
            </div>
          )}
        </div>
      </Link>
      {/* PRODUCT DETAIL */}
      <div className="flex flex-col gap-4 p-4">
        <div>
          <h1 className="font-medium">{product.name}</h1>
          {stock > 0 && stock <= 5 && (
            <span className="text-[11px] font-semibold text-amber-600">Only {stock} left in stock!</span>
          )}
        </div>
        <p className="text-sm text-gray-500">{product.shortDescription}</p>
        {/* PRODUCT TYPES */}
        <div className="flex items-center gap-4 text-xs">
          {/* SIZES */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Size</span>
            <select
              name="size"
              id="size"
              className="ring ring-gray-300 rounded-md px-2 py-1"
              onChange={(e) =>
                handleProductType({ type: "size", value: e.target.value })
              }
            >
              {product.sizes.map((size: string) => (
                <option key={size} value={size}>
                  {size.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {/* COLORS */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Color</span>
            <div className="flex items-center gap-2">
              {product.colors.map((color: string) => (
                <div
                  className={`cursor-pointer border-1 ${
                    productTypes.color === color
                      ? "border-gray-400"
                      : "border-gray-200"
                  } rounded-full p-[1.2px]`}
                  key={color}
                  onClick={() =>
                    handleProductType({ type: "color", value: color })
                  }
                >
                  <div
                    className="w-[14px] h-[14px] rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* PRICE AND ADD TO CART BUTTON */}
        <div className="flex items-center justify-between">
          <p className="font-medium">Rs. {product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`ring-1 ring-gray-200 shadow-lg rounded-md px-2.5 py-1 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              stock === 0
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-75 shadow-none"
                : "cursor-pointer hover:text-white hover:bg-black"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
