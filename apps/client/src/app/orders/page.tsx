import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@repo/types";
import OrdersListClient from "@/components/OrdersListClient";

const fetchOrders = async (): Promise<any[]> => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) return [];

    // 1. Fetch user orders
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Fetch orders failed:", res.status, res.statusText);
      return [];
    }

    const ordersData: OrderType[] = await res.json();
    if (!Array.isArray(ordersData)) return [];

    // 2. Fetch catalog products to enrich any legacy orders missing product images
    let catalogProducts: any[] = [];
    try {
      const prodRes = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        { cache: "no-store" }
      );
      if (prodRes.ok) {
        catalogProducts = await prodRes.json();
      }
    } catch (e) {
      console.warn("Could not fetch catalog products for image enrichment:", e);
    }

    // 3. Enrich products in orders with exact catalog images
    const enrichedOrders = ordersData.map((order) => ({
      ...order,
      products: order.products?.map((prod: any) => {
        let imageUrl = prod.image || prod.img || "";

        if (!imageUrl && catalogProducts.length > 0) {
          const match = catalogProducts.find(
            (p) => p.name?.toLowerCase().trim() === prod.name?.toLowerCase().trim()
          );
          if (match && match.images) {
            if (typeof match.images === "string") {
              imageUrl = match.images;
            } else if (typeof match.images === "object") {
              imageUrl = (Object.values(match.images)[0] as string) || "";
            }
          }
        }

        return {
          ...prod,
          image: imageUrl,
        };
      }),
    }));

    return enrichedOrders;
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
};

const OrdersPage = async () => {
  const orders = await fetchOrders();

  return <OrdersListClient orders={orders} />;
};

export default OrdersPage;
