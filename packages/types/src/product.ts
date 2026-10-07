import type { Product, Category } from "@repo/product-db";
import z from "zod";

export type ProductType = Product;

export type ProductsType = ProductType[];

export type RazorpayProductType = {
  id: string;
  name: string;
  price: number;
};

export const colors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
  "white",
] as const;

export const sizes = [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
] as const;

export const ProductFormSchema = z
  .object({
    name: z
      .string({ message: "Product name is required!" })
      .min(1, { message: "Product name is required!" }),
    shortDescription: z
      .string({ message: "Short description is required!" })
      .min(1, { message: "Short description is required!" })
      .max(60),
    description: z
      .string({ message: "Description is required!" })
      .min(1, { message: "Description is required!" }),
    price: z
      .number({ message: "Price is required!" })
      .min(1, { message: "Price is required!" }),
    stock: z
      .number({ message: "Stock quantity is required!" })
      .min(0, { message: "Stock quantity cannot be negative!" })
      .default(10),
    categorySlug: z
      .string({ message: "Category is required!" })
      .min(1, { message: "Category is required!" }),
    sizes: z
      .array(z.enum(sizes))
      .min(1, { message: "At least one size is required!" }),
    colors: z
      .array(z.enum(colors))
      .min(1, { message: "At least one color is required!" }),
    images: z.record(
      z.string(),
      z.union([z.string(), z.array(z.string())]),
      {
        message: "Image for each color is required!",
      }
    ),
  })
  .refine(
    (data) => {
      const missingImages = data.colors.filter((color: string) => {
        const val = data.images?.[color];
        if (!val) return true;
        if (Array.isArray(val) && val.length === 0) return true;
        return false;
      });
      return missingImages.length === 0;
    },
    {
      message: "At least one image is required for each selected color!",
      path: ["images"],
    }
  );

export type CategoryType = Category;

export const CategoryFormSchema = z.object({
  name: z
    .string({ message: "Name is Required!" })
    .min(1, { message: "Name is Required!" }),
  slug: z
    .string({ message: "Slug is Required!" })
    .min(1, { message: "Slug is Required!" }),
});

export function getValidImageUrl(images: any, color?: string): string | null {
  if (!images) return null;

  if (typeof images === "string") {
    const trimmed = images.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof images === "object") {
    let targetVal: any = undefined;

    if (!Array.isArray(images)) {
      if (color && images[color] !== undefined) {
        targetVal = images[color];
      } else {
        const values = Object.values(images);
        targetVal = values.length > 0 ? values[0] : undefined;
      }
    } else {
      targetVal = images;
    }

    if (typeof targetVal === "string") {
      const trimmed = targetVal.trim();
      return trimmed.length > 0 ? trimmed : null;
    }

    if (Array.isArray(targetVal)) {
      const found = targetVal.find(
        (item) => typeof item === "string" && item.trim().length > 0
      );
      return found ? (found as string).trim() : null;
    }
  }

  return null;
}
