import mongoose from "mongoose";
import Product, { IProduct } from "../../modules/products/product.model"; // Ajusta la ruta a tu modelo
import * as fileUploadService from "../../services/file-upload.service";
import { NotFoundError } from "../../core/errors/custom-errors";

interface ImageFile {
  buffer: Buffer;
  originalname: string;
}

// Helper para generar publicId con carpeta para Cloudinary
const getPublicIdForProductImage = (productId: string | null, originalname: string) => {
  const fileNameWithoutExt = originalname.split('.').slice(0, -1).join('.');
  if (productId) {
    return `ratacueva/products/${productId}/${fileNameWithoutExt}`;
  } else {
    return `ratacueva/products/temp/${fileNameWithoutExt}`;
  }
};

export const getProductById = async (id: string): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError("Producto no encontrado.");
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  return product;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  return await Product.find();
};

export const addProduct = async (
  productData: Partial<IProduct>,
  imageFiles: ImageFile[]
): Promise<IProduct> => {
  // Subir imágenes a carpeta temporal
  const uploadedUrls: string[] = [];
  for (const file of imageFiles) {
    const publicId = getPublicIdForProductImage(null, file.originalname);
    const url = await fileUploadService.uploadImage(file.buffer, file.originalname, publicId);
    uploadedUrls.push(url);
  }

  const newProduct = new Product({
    ...productData,
    images: uploadedUrls,
  });

  await newProduct.save();

  // Opcional: podrías reubicar imágenes aquí si quieres

  return newProduct;
};

export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>,
  newImageFiles?: ImageFile[]
): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError("Producto no encontrado.");
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");

  if (newImageFiles && newImageFiles.length > 0) {
    // Eliminar imágenes viejas
    for (const imageUrl of product.images) {
      try {
        const segments = imageUrl.split("/");
        const folderIndex = segments.findIndex(s => s === "upload") + 1;
        const publicIdWithExtension = segments.slice(folderIndex).join("/");
        const publicId = publicIdWithExtension.split(".")[0];
        await fileUploadService.deleteFile(publicId);
      } catch (err) {
        console.warn("No se pudo eliminar imagen anterior:", imageUrl, err);
      }
    }

    // Subir nuevas imágenes con carpeta producto/id
    const uploadedUrls: string[] = [];
    for (const file of newImageFiles) {
      const publicId = getPublicIdForProductImage(id, file.originalname);
      const url = await fileUploadService.uploadImage(file.buffer, file.originalname, publicId);
      uploadedUrls.push(url);
    }

    updateData.images = uploadedUrls;
  }

  Object.assign(product, updateData);
  await product.save();

  return product;
};

export const updateStockProduct = async (id: string, stock: number): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.stock = stock;
  await product.save();
  return product;
};

export const updateDiscountProduct = async (id: string, discountPercentage: number): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.discountPercentage = discountPercentage;
  await product.save();
  return product;
};

export const updateIsFeaturedProduct = async (id: string, isFeatured: boolean): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.isFeatured = isFeatured;
  await product.save();
  return product;
};

export const updateIsNewProduct = async (id: string, isNew: boolean): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.isNew = isNew;
  await product.save();
  return product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");

  // Eliminar imágenes en Cloudinary
  for (const imageUrl of product.images) {
    try {
      const segments = imageUrl.split("/");
      const folderIndex = segments.findIndex(s => s === "upload") + 1;
      const publicIdWithExtension = segments.slice(folderIndex).join("/");
      const publicId = publicIdWithExtension.split(".")[0];
      await fileUploadService.deleteFile(publicId);
    } catch (err) {
      console.warn("No se pudo eliminar imagen al borrar producto:", imageUrl, err);
    }
  }

  await Product.findByIdAndDelete(id);
};
