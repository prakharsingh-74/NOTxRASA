import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { OrderType, ProductsType } from "@repo/types";
import { auth } from "@clerk/nextjs/server";
import { Package } from "lucide-react";

const CardList = async ({ title }: { title: string }) => {
  let products: ProductsType = [];
  let orders: OrderType[] = [];

  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (title === "Popular Products") {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=5&popular=true`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) products = data;
      }
    } else {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) orders = data;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch ${title}:`, error);
  }

  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "Popular Products"
          ? safeProducts.map((item) => {
              const imageUrl =
                Object.values((item.images as Record<string, string>) || {})[0] ||
                "";

              return (
                <Card
                  key={item.id}
                  className="flex-row items-center justify-between gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-sm relative overflow-hidden bg-secondary border border-border flex items-center justify-center text-muted-foreground shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5" />
                    )}
                  </div>
                  <CardContent className="flex-1 p-0">
                    <CardTitle className="text-sm font-medium">
                      {item.name}
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="p-0 font-semibold text-sm">
                    Rs. {typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                  </CardFooter>
                </Card>
              );
            })
          : safeOrders.map((item) => (
              <Card
                key={item._id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.email}
                  </CardTitle>
                  <Badge variant="secondary">{item.status}</Badge>
                </CardContent>
                <CardFooter className="p-0 font-semibold text-sm">
                  Rs. {(item.amount / 100).toFixed(2)}
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default CardList;
