"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const ActionCell = ({ product }: { product: ProductType }) => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setShowConfirmModal(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(product.id.toString())}
            className="cursor-pointer"
          >
            Copy product ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/products/${product.id}`}>View product</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowConfirmModal(true)}
            className="text-red-600 focus:text-red-600 font-medium cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        title={`Delete "${product.name}"?`}
        description="Are you sure you want to delete this product? It will be removed permanently."
        isLoading={isDeleting}
      />
    </>
  );
};

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original;
      const imageUrl =
        (product.images as Record<string, string>)?.[product.colors[0] || ""] ||
        Object.values((product.images as Record<string, string>) || {})[0];

      if (!imageUrl) {
        return (
          <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground">
            <Package className="w-4 h-4" />
          </div>
        );
      }

      return (
        <div className="w-9 h-9 relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <div>Rs. {price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "shortDescription",
    header: "Description",
  },
  {
    accessorKey: "stock",
    header: "Stock (Pieces)",
    cell: ({ row }) => {
      const stock = row.original.stock ?? 0;
      return (
        <span
          className={`font-semibold px-2 py-1 rounded-md text-xs ${
            stock > 0
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {stock > 0 ? `${stock} pcs` : "0 (Out of stock)"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell product={row.original} />,
  },
];
