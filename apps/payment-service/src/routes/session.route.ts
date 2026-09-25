import { Hono } from "hono";
import razorpay from "../utils/razorpay.js";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { CartItemsType } from "@repo/types";
import crypto from "node:crypto";
import { producer } from "../utils/kafka.js";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get("userId");

  const totalAmountInPaise = Math.round(
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100
  );

  try {
    const order = await razorpay.orders.create({
      amount: totalAmountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
      },
    });

    return c.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID as string,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return c.json({ error: "Failed to create Razorpay order" }, 500);
  }
});

sessionRoute.post("/verify-payment", shouldBeUser, async (c) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cart,
  }: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    cart: CartItemsType;
  } = await c.req.json();

  const userId = c.get("userId");
  const keySecret = process.env.RAZORPAY_KEY_SECRET as string;

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    console.error("Invalid Razorpay payment signature!");
    return c.json({ status: "failed", error: "Invalid payment signature" }, 400);
  }

  const totalAmountInPaise = Math.round(
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100
  );

  // Send payment success event to Kafka for order creation
  try {
    await producer.send("payment.successful", {
      value: {
        userId,
        email: "customer@example.com",
        amount: totalAmountInPaise,
        status: "success",
        products: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  } catch (err) {
    console.error("Error sending Kafka payment event:", err);
  }

  return c.json({
    status: "success",
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();

  try {
    const payment = await razorpay.payments.fetch(session_id as string);

    return c.json({
      status: payment.status === "captured" ? "complete" : payment.status,
      paymentStatus: payment.status,
    });
  } catch (error) {
    console.error("Error fetching Razorpay payment:", error);
    return c.json({ status: "unknown", paymentStatus: "unknown" });
  }
});

export default sessionRoute;
