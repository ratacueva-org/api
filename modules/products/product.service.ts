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
  const parts = url.split("/upload/");
  if (parts.length < 2) {
    throw new Error("URL inválida de Cloudinary: falta '/upload/'");
  }

  // Extrae la parte después de "/upload/"
  const pathWithVersion = parts[1]; // p.ej. v1234567/ratacueva/products/temp/Video_1.mp4
  const pathParts = pathWithVersion.split("/");

  // Quita el primer segmento que es la versión (v1234567)
  const publicIdParts = pathParts.slice(1);
  const publicIdWithExt = publicIdParts.join("/");

  // Quita la extensión (lo que está después del último punto)
  const lastDot = publicIdWithExt.lastIndexOf(".");
  return lastDot === -1
    ? publicIdWithExt
    : publicIdWithExt.substring(0, lastDot);
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

    // ✅ Eliminar archivos anteriores (imágenes y videos con su tipo correspondiente)
    const allOldFiles = [
      ...(product.images || []).map((url) => ({
        url,
        resourceType: "image" as const,
      })),
      ...(product.videos || []).map((url) => ({
        url,
        resourceType: "video" as const,
      })),
    ];

    for (const file of allOldFiles) {
      try {
        const publicId = getPublicIdFromUrl(file.url);
        await fileUploadService.deleteFile(publicId, file.resourceType);
      } catch (err) {
        console.warn("No se pudo eliminar archivo anterior:", file.url, err);
      }
    }

    // ✅ Subir nuevos archivos y separar URLs por tipo
    const uploadedImagesUrls: string[] = [];
    const uploadedVideosUrls: string[] = [];

    for (const file of newMediaFiles) {
      const resourceType = file.mimetype.startsWith("video")
        ? "video"
        : "image";
      const publicId = getPublicIdForProductFile(id, file.originalname);

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

      if (resourceType === "image") {
        uploadedImagesUrls.push(url);
      } else {
        uploadedVideosUrls.push(url);
      }
    }

    updateData.images = uploadedImagesUrls;
    updateData.videos = uploadedVideosUrls;
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

  // Eliminar imágenes
  for (const url of product.images) {
    try {
      const publicId = getPublicIdFromUrl(url);
      await fileUploadService.deleteFile(publicId, "image");
    } catch (err) {
      console.warn("No se pudo eliminar imagen al borrar producto:", url, err);
    }
  }

  // Eliminar videos
  for (const url of product.videos ?? []) {
    try {
      const publicId = getPublicIdFromUrl(url);
      await fileUploadService.deleteFile(publicId, "video");
    } catch (err) {
      console.warn("No se pudo eliminar video al borrar producto:", url, err);
    }
  }

  await Product.findByIdAndDelete(id);
};
