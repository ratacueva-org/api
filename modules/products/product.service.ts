import mongoose from "mongoose";
import Product, { IProduct } from "../../modules/products/product.model"; // Ajusta la ruta a tu modelo
import * as fileUploadService from "../../services/file-upload.service";
import { NotFoundError } from "../../core/errors/custom-errors";

interface ImageFile {
  buffer: Buffer;
  originalname: string;
}

// Helper para generar publicId con carpeta para Cloudinary
const getPublicIdForProductImage = (
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
  imageFiles: ImageFile[]
): Promise<IProduct> => {
  // Subir imágenes a carpeta temporal
  const uploadedUrls: string[] = [];
  for (const file of imageFiles) {
    const publicId = getPublicIdForProductImage(null, file.originalname);
    const url = await fileUploadService.uploadImage(
      file.buffer,
      file.originalname,
      publicId
    );
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError("Producto no encontrado.");
  }

  // Si hay archivos nuevos, primero borramos imágenes viejas y subimos las nuevas
  if (newImageFiles && newImageFiles.length > 0) {
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError("Producto no encontrado.");

    // Eliminar imágenes anteriores
    for (const imageUrl of product.images) {
      try {
        const segments = imageUrl.split("/");
        const uploadIndex = segments.findIndex((s) => s === "upload");
        const versionIndex = uploadIndex + 1;

        const publicIdSegments = segments.slice(versionIndex + 1);
        const publicIdWithExt = publicIdSegments.join("/");
        const publicId = publicIdWithExt.split(".")[0];

        await fileUploadService.deleteFile(publicId);
      } catch (err) {
        console.warn("No se pudo eliminar imagen anterior:", imageUrl, err);
      }
    }

    // Subir nuevas imágenes y obtener URLs
    const uploadedUrls: string[] = [];
    for (const file of newImageFiles) {
      const publicId = getPublicIdForProductImage(id, file.originalname);
      const url = await fileUploadService.uploadImage(
        file.buffer,
        file.originalname,
        publicId
      );
      uploadedUrls.push(url);
    }
    updateData.images = uploadedUrls;
  }

  // Actualizar sólo los campos necesarios con findByIdAndUpdate y new:true para devolver el documento actualizado
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

// Función utilitaria para extraer el publicId de la URL de Cloudinary
function getPublicIdFromUrl(url: string): string {
  const segments = url.split("/");
  const uploadIndex = segments.findIndex((s) => s === "upload");
  if (uploadIndex === -1) throw new Error("URL inválida de Cloudinary");

  // Excluir 'upload' y la versión 'vXXXXX'
  const publicIdSegments = segments.slice(uploadIndex + 2);
  const publicIdWithExtension = publicIdSegments.join("/");

  // Eliminar extensión (.png, .jpg, etc)
  return publicIdWithExtension.split(".").slice(0, -1).join(".");
}

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");

  for (const imageUrl of product.images) {
    try {
      const publicId = getPublicIdFromUrl(imageUrl);
      await fileUploadService.deleteFile(publicId);
    } catch (err) {
      // Solo un warning para que no rompa el flujo si la imagen no existe
      console.warn(
        "No se pudo eliminar imagen al borrar producto:",
        imageUrl,
        err
      );
    }
  }

  await Product.findByIdAndDelete(id);
};