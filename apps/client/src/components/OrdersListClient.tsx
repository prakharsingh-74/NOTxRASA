"use client";

import { useState } from "react";
import { OrderType } from "@repo/types";
import Link from "next/link";
import {
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Truck,
  Download,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export default function OrdersListClient({ orders }: { orders: OrderType[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "success" | "pending">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter orders by search and status
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "success"
        ? order.status.toLowerCase() === "success" || order.status.toLowerCase() === "complete"
        : order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "processing";

    const matchesSearch =
      searchQuery.trim() === "" ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products?.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const totalSpent = orders.reduce(
    (acc, order) => (order.status === "success" ? acc + order.amount : acc),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-medium text-black">My Orders</span>
        </nav>

        {/* Brand Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Overview</span>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Order History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Check the status of your recent orders, manage returns, and download invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                {orders.length}
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Total Orders
                </span>
                <span className="text-sm font-bold text-gray-900">Items Purchased</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                ₹
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Lifetime Value
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  ₹{(totalSpent / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Toolbar (Amazon / Myntra Toolbar) */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Package className="w-4 h-4 text-black" />
            <span>Showing all ({orders.length}) orders</span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID or Product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Orders List / Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No matching orders found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              We couldn&apos;t find any orders matching your current search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Top Info Banner (Amazon / Flipkart Header) */}
                  <div className="bg-gray-100/70 border-b border-gray-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2">
                      <div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                          ORDER PLACED
                        </span>
                        <span className="font-semibold text-gray-700">{formattedDate}</span>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                          TOTAL AMOUNT
                        </span>
                        <span className="font-bold text-gray-900">
                          ₹{(order.amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                          PAYMENT METHOD
                        </span>
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                          Razorpay Online
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                          ORDER # {order._id.substring(0, 8)}...
                        </span>
                        <button
                          onClick={() => handleCopyId(order._id)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-600 hover:text-black transition-colors underline cursor-pointer"
                        >
                          {copiedId === order._id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Full ID
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status.toLowerCase() === "success" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Processing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delivery Timeline Stepper Bar (Ecommerce Standard) */}
                  <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-bold text-gray-800 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        Estimated Delivery: Standard Shipping (3-5 Business Days)
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        On Schedule
                      </span>
                    </div>

                    {/* Stepper Dots */}
                    <div className="relative flex items-center justify-between max-w-xl my-2">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                      <div className="absolute top-1/2 left-0 w-2/3 h-0.5 bg-emerald-500 -translate-y-1/2 z-0" />

                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                        <span className="text-[10px] font-semibold text-gray-800">Placed</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                        <span className="text-[10px] font-semibold text-gray-800">Confirmed</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-4 ring-emerald-100">
                          📦
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">In Transit</span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-gray-300 text-white flex items-center justify-center text-[10px]">
                          •
                        </div>
                        <span className="text-[10px] font-medium text-gray-400">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Products & Action Section */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Products List */}
                      <div className="flex-1 space-y-4">
                        {order.products?.map((product, idx) => {
                          const productImage =
                            (product as any).image ||
                            (product as any).img ||
                            (typeof (product as any).images === "string"
                              ? (product as any).images
                              : (product as any).images
                              ? Object.values((product as any).images)[0]
                              : "");

                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 transition-all"
                            >
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative flex items-center justify-center shadow-xs">
                                {productImage ? (
                                  <img
                                    src={productImage as string}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-gray-700 font-bold">
                                    <Package className="w-6 h-6 text-gray-700" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 hover:text-black">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span>
                                    Quantity: <strong className="text-gray-800">{product.quantity}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Price per unit: <strong className="text-gray-800">₹{product.price.toLocaleString("en-IN")}</strong>
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-sm font-bold text-gray-900 block">
                                  ₹{(product.price * product.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Side Action Buttons (Amazon / Flipkart Style) */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 shrink-0 min-w-[200px]">
                        <button
                          onClick={() => alert(`Tracking details for Order #${order._id}`)}
                          className="w-full bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Track Shipment
                        </button>

                        <button
                          onClick={() => alert(`Downloading Invoice for Order #${order._id}`)}
                          className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-600" />
                          Download Invoice
                        </button>

                        <Link
                          href="/"
                          className="w-full text-center text-xs font-semibold text-gray-500 hover:text-black py-1 transition-colors flex items-center justify-center gap-1"
                        >
                          Buy Again
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
