"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ShippingFormInputs } from "@repo/types";
import useCartStore from "@/stores/cartStore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart, clearCart } = useCartStore();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getToken().then((tok) => setToken(tok));
  }, [getToken]);

  const handleRazorpayPayment = async () => {
    if (!token) {
      setError("User authentication token is missing. Please sign in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Razorpay order from backend payment-service
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart }),
        }
      );

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId) as string,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "NOTxRASA",
        description: "Purchase Order Payment",
        order_id: orderData.orderId,
        prefill: {
          name: shippingForm.name,
          email: shippingForm.email,
          contact: shippingForm.phone || "",
        },
        theme: {
          color: "#09090b",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Get fresh auth token before verification request
            const freshToken = await getToken();

            // 3. Verify payment signature on backend
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${freshToken}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  cart,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            console.log("Payment verification response:", verifyData);

            if (verifyRes.ok && verifyData.status === "success") {
              clearCart();
              router.push(`/return?session_id=${response.razorpay_payment_id}`);
            } else {
              setError(
                verifyData.error ||
                  verifyData.message ||
                  "Payment verification failed. Please contact support."
              );
            }
          } catch (err: any) {
            console.error("Payment verification error:", err);
            setError("Error verifying payment.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK failed to load. Check internet connection.");
      }
    } catch (err: any) {
      console.error("Razorpay Checkout Error:", err);
      setError(err.message || "Failed to initiate payment.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Razorpay Secure Payment</span>
          <span className="text-xs bg-black text-white px-2 py-1 rounded">UPI / Cards / NetBanking</span>
        </div>
        <p className="text-xs text-gray-500">
          Click below to complete your order using Razorpay&apos;s secure checkout.
        </p>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={handleRazorpayPayment}
          disabled={loading || !scriptLoaded}
          className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 shadow-md flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now with Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default RazorpayPaymentForm;
