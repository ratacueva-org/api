import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { InternalServerError } from "../core/errors/custom-errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Función genérica para subir un archivo a Cloudinary.
 * @param buffer Buffer del archivo a subir.
 * @param originalname Nombre original del archivo para generar el public_id.
 * @param folder Carpeta destino en Cloudinary.
 * @param resourceType Tipo de recurso: "image" o "video".
 * @returns URL segura del archivo subido.
 */
const uploadFile = async (
  buffer: Buffer,
  originalname: string,
  folder: string,
  resourceType: "image" | "video"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const publicId = originalname.split(".").slice(0, -1).join(".");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error(`Cloudinary ${resourceType} upload error:`, error);
          return reject(
            new InternalServerError(
              `Error al subir el ${resourceType} al servicio de almacenamiento.`
            )
          );
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(
            new InternalServerError(
              `Error: La subida de ${resourceType} a Cloudinary no devolvió una URL.`
            )
          );
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Subir imagen a Cloudinary (wrapper de uploadFile).
 */
export const uploadImage = (
  buffer: Buffer,
  originalname: string,
  folder: string = "ratacueva"
): Promise<string> => uploadFile(buffer, originalname, folder, "image");

/**
 * Subir video a Cloudinary (wrapper de uploadFile).
 */
export const uploadVideo = (
  buffer: Buffer,
  originalname: string,
  folder: string = "ratacueva"
): Promise<string> => uploadFile(buffer, originalname, folder, "video");

/**
 * Eliminar archivo de Cloudinary por publicId.
 * @param publicId ID pública del archivo en Cloudinary (incluyendo carpetas).
 */
export const deleteFile = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "not found") {
      console.warn(
        `Cloudinary delete warning: archivo no encontrado para publicId: ${publicId}`
      );
      return;
    }
    if (result.result !== "ok") {
      console.warn("Cloudinary delete warning:", result);
      throw new InternalServerError(
        `No se pudo eliminar el archivo en Cloudinary con ID: ${publicId}`
      );
    }
    console.log(`Archivo ${publicId} eliminado de Cloudinary.`);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new InternalServerError(
      `Error al eliminar el archivo ${publicId} del servicio de almacenamiento.`
    );
  }
};