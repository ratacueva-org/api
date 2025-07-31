  import { Request, Response } from "express";
  import { AuthenticatedRequest } from "../../core/middlewares/auth.middleware";
  import { BadRequestError } from "../../core/errors/custom-errors";
  import * as productService from "../../modules/products/product.service";

  export const getProductById = async (req: Request, res: Response) => {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  };

  export const getAllProducts = async (_req: Request, res: Response) => {
    const products = await productService.getAllProducts();
    res.json(products);
  };

  export const addProduct = async (req: AuthenticatedRequest, res: Response) => {
    const filesObj = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (!filesObj || !filesObj.images || filesObj.images.length === 0) {
      throw new BadRequestError("No se recibieron imágenes del producto.");
    }

    // Unir imágenes y videos (videos opcionales)
    const allFiles = [...filesObj.images, ...(filesObj.videos ?? [])];

    const mediaFiles = allFiles.map((file) => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    }));

    const product = await productService.addProduct(req.body, mediaFiles);
    res.status(201).json({ message: "Producto creado exitosamente", product });
  };

  export const updateProduct = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const filesObj = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    // Unir imágenes y videos, si hay archivos
    const allFiles = [...(filesObj?.images ?? []), ...(filesObj?.videos ?? [])];

    // Mapear solo si hay archivos nuevos, sino undefined para que no sobreescriba
    const mediaFiles =
      allFiles.length > 0
        ? allFiles.map((file) => ({
            buffer: file.buffer,
            originalname: file.originalname,
            mimetype: file.mimetype,
          }))
        : undefined;

    try {
      const updatedProduct = await productService.updateProduct(
        req.params.id,
        req.body,
        mediaFiles
      );

      res.json({
        message: "Producto actualizado exitosamente",
        product: updatedProduct,
      });
    } catch (error) {
      // Manejo básico de errores, puedes mejorarlo con tu middleware de errores
      res.status(500).json({ message: "Error actualizando producto", error });
    }
  };

  export const updateStockProduct = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { stock } = req.body;
    if (typeof stock !== "number")
      throw new BadRequestError("El stock debe ser un número.");
    const product = await productService.updateStockProduct(req.params.id, stock);
    res.json({ message: "Stock actualizado", product });
  };

  export const updateDiscountProduct = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { discountPercentage } = req.body;
    if (typeof discountPercentage !== "number")
      throw new BadRequestError("El descuento debe ser un número.");
    const product = await productService.updateDiscountProduct(
      req.params.id,
      discountPercentage
    );
    res.json({ message: "Descuento actualizado", product });
  };

  export const updateIsFeaturedProduct = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { isFeatured } = req.body;
    if (typeof isFeatured !== "boolean")
      throw new BadRequestError("El valor de destacado debe ser booleano.");
    const product = await productService.updateIsFeaturedProduct(
      req.params.id,
      isFeatured
    );
    res.json({ message: "Estado de destacado actualizado", product });
  };

  export const updateIsNewProduct = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { isNew } = req.body;
    if (typeof isNew !== "boolean")
      throw new BadRequestError("El valor de nuevo debe ser booleano.");
    const product = await productService.updateIsNewProduct(req.params.id, isNew);
    res.json({ message: "Estado de nuevo actualizado", product });
  };

  export const deleteProduct = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Producto eliminado exitosamente" });
  };