import mongoose from "mongoose";
import Review, { IReview } from "../../modules/reviews/review.model";
import Product from "../../modules/products/product.model";
import * as fileUploadService from "../../services/file-upload.service";
import { NotFoundError } from "../../core/errors/custom-errors";

interface MediaFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string; // Para saber si es image o video
}

// Helper para generar publicId con carpeta para Cloudinary (ajustado a reviews)
const getPublicIdForReviewFile = (
  reviewId: string | null,
  originalname: string
) => {
  const fileNameWithoutExt = originalname.split(".").slice(0, -1).join(".");
  if (reviewId) {
    return `ratacueva/reviews/${reviewId}/${fileNameWithoutExt}`;
  } else {
    return `ratacueva/reviews/temp/${fileNameWithoutExt}`;
  }
};

// Helper para extraer publicId desde url de Cloudinary (imágenes o videos)
const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split("/upload/");
  if (parts.length < 2) {
    throw new Error("URL inválida de Cloudinary: falta '/upload/'");
  }
  const pathWithVersion = parts[1];
  const pathParts = pathWithVersion.split("/");
  const publicIdParts = pathParts.slice(1);
  const publicIdWithExt = publicIdParts.join("/");
  const lastDot = publicIdWithExt.lastIndexOf(".");
  return lastDot === -1
    ? publicIdWithExt
    : publicIdWithExt.substring(0, lastDot);
};

export const getReviewById = async (id: string): Promise<IReview> => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new NotFoundError("Reseña no encontrada.");
  const review = await Review.findById(id);
  if (!review) throw new NotFoundError("Reseña no encontrada.");
  return review;
};

export const getAllReviews = async (): Promise<IReview[]> => {
  return await Review.find();
};

export const createReview = async (
  reviewData: Partial<IReview>,
  mediaFiles: MediaFile[]
): Promise<IReview> => {
  // Primero subimos las imágenes y videos a Cloudinary, guardamos URLs
  const imageUrls: string[] = [];
  const videoUrls: string[] = [];

  for (const file of mediaFiles) {
    const publicId = getPublicIdForReviewFile(null, file.originalname);
    const resourceType = file.mimetype.startsWith("video") ? "video" : "image";

    const url = await (resourceType === "image"
      ? fileUploadService.uploadImage(file.buffer, file.originalname, publicId)
      : fileUploadService.uploadVideo(
          file.buffer,
          file.originalname,
          publicId
        ));

    if (resourceType === "image") imageUrls.push(url);
    else videoUrls.push(url);
  }

  // Creamos la review con las URLs guardadas
  const newReview = new Review({
    ...reviewData,
    images: imageUrls,
    videos: videoUrls,
  });

  await newReview.save();
  // Actualizamos el rating del producto
  await updateProductRating(newReview.product.toString())
  return newReview;
};

export const updateReview = async (
  id: string,
  updateData: Partial<IReview>,
  newMediaFiles?: MediaFile[]
): Promise<IReview> => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new NotFoundError("Reseña no encontrada.");

  const review = await Review.findById(id);
  if (!review) throw new NotFoundError("Reseña no encontrada.");

  if (newMediaFiles && newMediaFiles.length > 0) {
    // Eliminar archivos multimedia antiguos
    const allOldFiles = [
      ...(review.images || []).map((url) => ({
        url,
        resourceType: "image" as const,
      })),
      ...(review.videos || []).map((url) => ({
        url,
        resourceType: "video" as const,
      })),
    ];

    for (const file of allOldFiles) {
      try {
        const publicId = getPublicIdFromUrl(file.url);
        await fileUploadService.deleteFile(publicId, file.resourceType);
      } catch (err) {
        console.warn(
          "No se pudo eliminar archivo multimedia anterior:",
          file.url,
          err
        );
      }
    }

    // Subir nuevos archivos multimedia
    const uploadedImagesUrls: string[] = [];
    const uploadedVideosUrls: string[] = [];

    for (const file of newMediaFiles) {
      const resourceType = file.mimetype.startsWith("video")
        ? "video"
        : "image";
      const publicId = getPublicIdForReviewFile(id, file.originalname);

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

      if (resourceType === "image") uploadedImagesUrls.push(url);
      else uploadedVideosUrls.push(url);
    }

    updateData.images = uploadedImagesUrls;
    updateData.videos = uploadedVideosUrls;
  }

  const updatedReview = await Review.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedReview) throw new NotFoundError("Reseña no encontrada.");
  // ✅ Recalcular el rating del producto
  await updateProductRating(updatedReview.product.toString());
  return updatedReview;
};

export const deleteReview = async (id: string): Promise<void> => {
  const review = await Review.findById(id);
  if (!review) throw new NotFoundError("Reseña no encontrada.");

  // Eliminar imágenes
  for (const url of review.images ?? []) {
    try {
      const publicId = getPublicIdFromUrl(url);
      await fileUploadService.deleteFile(publicId, "image");
    } catch (err) {
      console.warn("No se pudo eliminar imagen al borrar reseña:", url, err);
    }
  }

  // Eliminar videos
  for (const url of review.videos ?? []) {
    try {
      const publicId = getPublicIdFromUrl(url);
      await fileUploadService.deleteFile(publicId, "video");
    } catch (err) {
      console.warn("No se pudo eliminar video al borrar reseña:", url, err);
    }
  }

  // ✅ Guardar el productId ANTES de borrar la review
  const productId = review.product.toString();

  await Review.findByIdAndDelete(id);

  // ✅ Recalcular el rating del producto con el productId correcto
  await updateProductRating(productId);
};

const updateProductRating = async (productId: string): Promise<void> => {
  // Suma y cuenta todas las reviews para ese producto
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    // No hay reviews, seteamos rating a 0 (o null si quieres)
    await Product.findByIdAndUpdate(productId, { rating: 0 });
    return;
  }

  const { avgRating } = result[0];

  // Actualizamos el rating del producto con el promedio (redondeando a 0.5)
  const roundedRating = Math.round(avgRating * 2) / 2;

  await Product.findByIdAndUpdate(productId, { rating: roundedRating });
};
