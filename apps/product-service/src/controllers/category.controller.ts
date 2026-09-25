import { Prisma, prisma } from "@repo/product-db";
import { NextFunction, Request, Response } from "express";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: Prisma.CategoryCreateInput = req.body;
    const category = await prisma.category.create({ data });
    return res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data: Prisma.CategoryUpdateInput = req.body;

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data,
    });

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
