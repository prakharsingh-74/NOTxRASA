"use client";

import { useState } from "react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { CategoryType, colors, ProductFormSchema, sizes } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { X, Loader2 } from "lucide-react";

// const categories = [
//   "T-shirts",
//   "Shoes",
//   "Accessories",
//   "Bags",
//   "Dresses",
//   "Jackets",
//   "Gloves",
// ] as const;

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories!");
  }

  return await res.json();
};

const AddProduct = () => {
  const [uploadingColor, setUploadingColor] = useState<string | null>(null);
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema) as any,
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      stock: 10,
      categorySlug: "",
      sizes: [],
      colors: [],
      images: {},
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create product!");
      }
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(
                  (data) => mutation.mutate(data),
                  (errors) => {
                    console.log("Validation errors:", errors);
                    const errorMessages = Object.values(errors)
                      .map((err) => err.message)
                      .filter(Boolean);
                    if (errorMessages.length > 0) {
                      toast.error(errorMessages[0]?.toString());
                    } else {
                      toast.error("Please fill in all required fields!");
                    }
                  }
                )}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the short description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Pieces (Stock)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter total available pieces (stock) for this product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categorySlug"
                  render={({ field }) => {
                    const categoryList: CategoryType[] =
                      data && Array.isArray(data) && data.length > 0
                        ? data
                        : [
                            { id: 1, name: "T-Shirts", slug: "t-shirts" },
                            { id: 2, name: "Hoodies", slug: "hoodies" },
                            { id: 3, name: "Shoes", slug: "shoes" },
                            { id: 4, name: "Accessories", slug: "accessories" },
                            { id: 5, name: "Bags", slug: "bags" },
                            { id: 6, name: "Dresses", slug: "dresses" },
                          ];

                    return (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryList.map((cat: CategoryType) => (
                                <SelectItem key={cat.id || cat.slug} value={cat.slug}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select the category of the product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                id={`size-${size}`}
                                checked={field.value?.includes(size)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, size]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== size)
                                    );
                                  }
                                }}
                              />
                              <label htmlFor={`size-${size}`} className="text-xs">
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the available sizes for the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 my-2">
                            {colors.map((color) => (
                              <div
                                className="flex items-center gap-2"
                                key={color}
                              >
                                <Checkbox
                                  id={`color-${color}`}
                                  checked={field.value?.includes(color)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, color]);
                                    } else {
                                      field.onChange(
                                        currentValues.filter((v) => v !== color)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`color-${color}`}
                                  className="text-xs flex items-center gap-2"
                                >
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  {color}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the available colors for the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Images (Multiple allowed per color)</FormLabel>
                      <FormControl>
                        <div className="space-y-6">
                          {form.watch("colors")?.length === 0 && (
                            <p className="text-xs text-muted-foreground italic">
                              Select colors above to upload images for each variant.
                            </p>
                          )}
                          {form.watch("colors")?.map((color) => {
                            const imagesMap = form.watch("images") || {};
                            const rawImages = imagesMap[color];
                            const colorImages: string[] = Array.isArray(rawImages)
                              ? rawImages
                              : rawImages
                              ? [rawImages]
                              : [];
                            const isUploading = uploadingColor === color;

                            const removeImage = (indexToRemove: number) => {
                              const updated = colorImages.filter(
                                (_, idx) => idx !== indexToRemove
                              );
                              const currentMap = form.getValues("images") || {};
                              form.setValue(
                                "images",
                                {
                                  ...currentMap,
                                  [color]: updated,
                                },
                                { shouldValidate: true, shouldDirty: true, shouldTouch: true }
                              );
                            };

                            return (
                              <div
                                className="p-3 border border-border rounded-lg bg-secondary/20 space-y-3"
                                key={color}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                      style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm font-semibold capitalize">
                                      {color} Variant
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {colorImages.length} {colorImages.length === 1 ? "image" : "images"} uploaded
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={isUploading}
                                    onChange={async (e) => {
                                      const files = Array.from(e.target.files || []);
                                      if (files.length === 0) return;

                                      setUploadingColor(color);
                                      try {
                                        const cloudName =
                                          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                                        if (!cloudName) {
                                          throw new Error(
                                            "Cloudinary cloud name is missing in environment!"
                                          );
                                        }

                                        const newUrls: string[] = [];

                                        for (const file of files) {
                                          const formData = new FormData();
                                          formData.append("file", file);
                                          formData.append(
                                            "upload_preset",
                                            "NOTxRASA"
                                          );

                                          const res = await fetch(
                                            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                                            {
                                              method: "POST",
                                              body: formData,
                                            }
                                          );
                                          const data = await res.json();

                                          if (data.secure_url) {
                                            newUrls.push(data.secure_url);
                                          } else {
                                            console.warn("Cloudinary upload error:", data);
                                            toast.error(
                                              data.error?.message ||
                                                "Upload failed for file " + file.name
                                            );
                                          }
                                        }

                                        if (newUrls.length > 0) {
                                          const currentMap =
                                            form.getValues("images") || {};
                                          const existingList = Array.isArray(
                                            currentMap[color]
                                          )
                                            ? (currentMap[color] as string[])
                                            : currentMap[color]
                                            ? [currentMap[color] as string]
                                            : [];
                                          const updatedList = [
                                            ...existingList,
                                            ...newUrls,
                                          ];

                                          form.setValue(
                                            "images",
                                            {
                                              ...currentMap,
                                              [color]: updatedList,
                                            },
                                            {
                                              shouldValidate: true,
                                              shouldDirty: true,
                                              shouldTouch: true,
                                            }
                                          );
                                          toast.success(
                                            `Uploaded ${newUrls.length} image(s) for ${color}`
                                          );
                                        }
                                      } catch (error: any) {
                                        console.error(error);
                                        toast.error(
                                          error.message || "Upload failed!"
                                        );
                                      } finally {
                                        setUploadingColor(null);
                                        e.target.value = "";
                                      }
                                    }}
                                  />
                                </div>

                                {isUploading && (
                                  <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Uploading images for {color}...
                                  </div>
                                )}

                                {/* THUMBNAILS GRID */}
                                {colorImages.length > 0 && (
                                  <div className="grid grid-cols-4 gap-2 pt-1">
                                    {colorImages.map((url, idx) => (
                                      <div
                                        key={idx}
                                        className="relative group w-full aspect-square rounded-md overflow-hidden border border-border bg-background"
                                      >
                                        <img
                                          src={url}
                                          alt={`${color} preview ${idx + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeImage(idx)}
                                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-all cursor-pointer"
                                          title="Remove image"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {colorImages.length === 0 && !isUploading && (
                                  <span className="text-xs text-red-500 font-medium block">
                                    At least 1 image is required for {color}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
