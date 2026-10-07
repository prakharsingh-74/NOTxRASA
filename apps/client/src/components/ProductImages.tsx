"use client";

import { ChevronLeft, ChevronRight, Package, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductImagesProps {
  images: any;
  selectedColor: string;
  name: string;
}

const ProductImages = ({ images, selectedColor, name }: ProductImagesProps) => {
  const imagesMap = (images as Record<string, string | string[]>) || {};
  const colorVal = imagesMap[selectedColor] ?? Object.values(imagesMap)[0];

  const imageList: string[] = Array.isArray(colorVal)
    ? colorVal.filter(Boolean)
    : typeof colorVal === "string" && colorVal
    ? [colorVal]
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset selected image index when selected color changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [selectedColor]);

  // Auto-scroll images every 3.5 seconds
  useEffect(() => {
    if (imageList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [imageList.length, isPaused]);

  const activeImage = imageList[selectedIndex] || imageList[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="flex flex-col gap-4 w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* MAIN IMAGE PREVIEW CONTAINER */}
      <div className="relative aspect-[2/3] w-full bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden group shadow-sm">
        {activeImage ? (
          <>
            <Image
              src={activeImage}
              alt={`${name} - preview ${selectedIndex + 1}`}
              fill
              priority
              className="object-contain transition-all duration-500 ease-in-out group-hover:scale-105"
            />

            {/* NAVIGATION ARROWS & CONTROLS (When multiple images exist) */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* PAUSE / PLAY & COUNT BADGE OVERLAY */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm z-10">
                  <button
                    type="button"
                    onClick={() => setIsPaused((prev) => !prev)}
                    className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                    title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                  >
                    {isPaused ? (
                      <Play className="w-3 h-3 fill-white" />
                    ) : (
                      <Pause className="w-3 h-3 fill-white" />
                    )}
                  </button>
                  <span className="w-px h-3 bg-white/30" />
                  <span>
                    {selectedIndex + 1} / {imageList.length}
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-2 p-6 text-center">
            <Package className="w-12 h-12 stroke-[1.5]" />
            <span className="text-sm font-medium text-gray-400">
              No Image Available
            </span>
          </div>
        )}
      </div>

      {/* THUMBNAILS GALLERY STRIP & AUTO SCROLL PROGRESS INDICATOR */}
      {imageList.length > 1 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {imageList.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === selectedIndex
                    ? "border-black ring-2 ring-black/20 scale-105 shadow-sm"
                    : "border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={url}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* DOT INDICATORS */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === selectedIndex
                    ? "w-6 bg-black"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
