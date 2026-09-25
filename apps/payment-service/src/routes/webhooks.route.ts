import { Hono } from "hono";
import crypto from "node:crypto";
import { producer } from "../utils/kafka.js";

const webhookRoute = new Hono();

webhookRoute.get("/", (c) => {
  return c.json({
    status: "ok webhook",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

webhookRoute.post("/razorpay", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "dummy_webhook_secret";

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("Razorpay webhook signature verification failed!");
      return c.json({ error: "Webhook signature verification failed!" }, 400);
    }

    const payload = JSON.parse(body);

    if (payload.event === "payment.captured" || payload.event === "order.paid") {
      const payment = payload.payload.payment.entity;
      const notes = payment.notes || {};

      producer.send("payment.successful", {
        value: {
          userId: notes.userId || "anonymous",
          email: payment.email || "customer@example.com",
          amount: payment.amount,
          status: "success",
          products: [],
        },
      });
    }

    return c.json({ status: "ok", received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return c.json({ error: "Webhook processing error" }, 500);
  }
});

export default webhookRoute;
