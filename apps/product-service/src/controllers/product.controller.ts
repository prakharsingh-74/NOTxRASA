import { Request, Response, NextFunction } from "express";
import { prisma, Prisma } from "@repo/product-db";
import { producer } from "../utils/kafka";
import { RazorpayProductType } from "@repo/types";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Prisma.ProductCreateInput = req.body;

    const { colors, images } = data;
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({ message: "Colors array is required!" });
    }

    if (!images || typeof images !== "object") {
      return res.status(400).json({ message: "Images object is required!" });
    }

    const missingColors = colors.filter((color) => !(color in images));

    if (missingColors.length > 0) {
      return res
        .status(400)
        .json({ message: "Missing images for colors!", missingColors });
    }

    const product = await prisma.product.create({ data });

    const razorpayProduct: RazorpayProductType = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
    };

    try {
      await producer.send("product.created", { value: razorpayProduct });
    } catch (kafkaError) {
      console.warn("Kafka event notification warning:", kafkaError);
    }

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.ProductUpdateInput = req.body;

  const updatedProduct = await prisma.product.update({
    where: { id: Number(id) },
    data,
  });

  return res.status(200).json(updatedProduct);
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });

    try {
      await producer.send("product.deleted", { value: Number(id) });
    } catch (kafkaError) {
      console.warn("Kafka event error (non-fatal):", kafkaError);
    }

    return res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { sort, category, search, limit } = req.query;

  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
      case "desc":
        return { price: Prisma.SortOrder.desc };
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
      default:
        return { createdAt: Prisma.SortOrder.desc };
    }
  })();

  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category as string,
      },
      name: {
        contains: search as string,
        mode: "insensitive",
      },
    },
    orderBy,
    take: limit ? Number(limit) : undefined,
  });

  res.status(200).json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  return res.status(200).json(product);
};
