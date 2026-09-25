import { RazorpayProductType } from "@repo/types";

export const createRazorpayProduct = async (item: RazorpayProductType) => {
  try {
    console.log("Product created notification received for Razorpay:", item);
    return { status: "success", id: item.id };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const deleteRazorpayProduct = async (productId: number) => {
  try {
    console.log("Product deleted notification received for Razorpay:", productId);
    return { status: "success", id: productId };
  } catch (error) {
    console.error(error);
    return error;
  }
};
