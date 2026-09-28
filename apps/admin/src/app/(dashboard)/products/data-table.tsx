"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/TablePagination";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ProductType } from "@repo/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const { getToken } = useAuth();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const handleDeleteSelected = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedRows.length} selected product(s)?`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const token = await getToken();
      const deletePromises = selectedRows.map((row) => {
        const product = row.original as ProductType;
        return fetch(
          `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${product.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      const responses = await Promise.all(deletePromises);
      const failed = responses.filter((res) => !res.ok);

      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} product(s)`);
      } else {
        toast.success(
          `${selectedRows.length} product(s) deleted successfully!`
        );
      }

      setRowSelection({});
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error deleting products");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-md border">
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 text-sm rounded-md m-4 cursor-pointer transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete Product(s)"}
          </button>
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
