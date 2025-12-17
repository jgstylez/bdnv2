
import { Request, Response } from 'express';
import * as productService from './products.service';

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.updateProduct(id, req.body);
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await productService.deleteProduct(id);
  res.status(204).send();
};
