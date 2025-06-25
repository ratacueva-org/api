import mongoose from "mongoose";
import Product, { IProduct } from "../../modules/products/product.model";
import * as fileUploadService from "../../services/file-upload.service";
import { NotFoundError } from "../../core/errors/custom-errors";

interface MediaFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string; // Para saber si es image o video
}

// Helper para generar publicId con carpeta para Cloudinary
const getPublicIdForProductFile = (
  productId: string | null,
  originalname: string
) => {
  const fileNameWithoutExt = originalname.split(".").slice(0, -1).join(".");
  if (productId) {
    return `ratacueva/products/${productId}/${fileNameWithoutExt}`;
  } else {
    return `ratacueva/products/temp/${fileNameWithoutExt}`;
  }
};

// Helper para extraer publicId desde url de Cloudinary (imágenes o videos)
const getPublicIdFromUrl = (url: string): string => {
  const segments = url.split("/");
  const uploadIndex = segments.findIndex((s) => s === "upload");
  if (uploadIndex === -1) throw new Error("URL inválida de Cloudinary");

  // Saltar "upload" y la versión (p.ej. v1234567)
  const publicIdSegments = segments.slice(uploadIndex + 2);
  const publicIdWithExtension = publicIdSegments.join("/");
  // Quitar extensión
  return publicIdWithExtension.split(".").slice(0, -1).join(".");
};

export const getProductById = async (id: string): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new NotFoundError("Producto no encontrado.");
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  return product;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  return await Product.find();
};

export const addProduct = async (
  productData: Partial<IProduct>,
  mediaFiles: MediaFile[]
): Promise<IProduct> => {
  const imageUrls: string[] = [];
  const videoUrls: string[] = [];

  for (const file of mediaFiles) {
    const publicId = getPublicIdForProductFile(null, file.originalname);
    const resourceType = file.mimetype.startsWith("video") ? "video" : "image";

    const url = await (resourceType === "image"
      ? fileUploadService.uploadImage(file.buffer, file.originalname, publicId)
      : fileUploadService.uploadVideo(
          file.buffer,
          file.originalname,
          publicId
        ));

    if (resourceType === "image") {
      imageUrls.push(url);
    } else {
      videoUrls.push(url);
    }
  }

  const newProduct = new Product({
    ...productData,
    images: imageUrls,
    videos: videoUrls, // <-- asigna aquí el arreglo de videos
  });

  await newProduct.save();
  return newProduct;
};

export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>,
  newMediaFiles?: MediaFile[]
): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError("Producto no encontrado.");
  }

  if (newMediaFiles && newMediaFiles.length > 0) {
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError("Producto no encontrado.");

    // Eliminar archivos anteriores (imágenes o videos)
    for (const url of product.images) {
      try {
        const publicId = getPublicIdFromUrl(url);
        await fileUploadService.deleteFile(publicId);
      } catch (err) {
        console.warn("No se pudo eliminar archivo anterior:", url, err);
      }
    }

    // Subir nuevos archivos
    const uploadedUrls: string[] = [];
    for (const file of newMediaFiles) {
      const publicId = getPublicIdForProductFile(id, file.originalname);
      const resourceType = file.mimetype.startsWith("video")
        ? "video"
        : "image";
      const url = await (resourceType === "image"
        ? fileUploadService.uploadImage(
            file.buffer,
            file.originalname,
            publicId
          )
        : fileUploadService.uploadVideo(
            file.buffer,
            file.originalname,
            publicId
          ));
      uploadedUrls.push(url);
    }

    updateData.images = uploadedUrls;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) throw new NotFoundError("Producto no encontrado.");

  return updatedProduct;
};

export const updateStockProduct = async (
  id: string,
  stock: number
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.stock = stock;
  product.updatedAt = new Date();
  product.markModified("updatedAt");
  await product.save();
  return product;
};

export const updateDiscountProduct = async (
  id: string,
  discountPercentage: number
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.discountPercentage = discountPercentage;
  product.updatedAt = new Date();
  product.markModified("updatedAt");
  await product.save();
  return product;
};

export const updateIsFeaturedProduct = async (
  id: string,
  isFeatured: boolean
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.isFeatured = isFeatured;
  product.updatedAt = new Date();
  product.markModified("updatedAt");
  await product.save();
  return product;
};

export const updateIsNewProduct = async (
  id: string,
  isNew: boolean
): Promise<IProduct> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  product.isNew = isNew;
  product.updatedAt = new Date();
  product.markModified("updatedAt");
  await product.save();
  return product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");

  for (const url of product.images) {
    try {
      const publicId = getPublicIdFromUrl(url);
      await fileUploadService.deleteFile(publicId);
    } catch (err) {
      console.warn("No se pudo eliminar archivo al borrar producto:", url, err);
    }
  }

  await Product.findByIdAndDelete(id);
};