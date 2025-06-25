import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { InternalServerError } from "../core/errors/custom-errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen (buffer) a Cloudinary.
 * @param buffer El buffer del archivo de imagen.
 * @param originalname El nombre original del archivo (para usar como public_id base).
 * @param folder La carpeta en Cloudinary donde se guardará la imagen (opcional, por defecto 'ratacueva').
 * @returns La URL segura de la imagen subida en Cloudinary.
 */
export const uploadImage = async (
  buffer: Buffer,
  originalname: string,
  folder: string = "ratacueva"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Elimina la extensión del archivo para usar solo el nombre como public_id
    const publicId = originalname.split(".").slice(0, -1).join(".");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(
            new InternalServerError(
              "Error al subir la imagen al servicio de almacenamiento."
            )
          );
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(
            new InternalServerError(
              "Error: La subida de imagen a Cloudinary no devolvió una URL."
            )
          );
        }
      }
    );

    // Convertir el buffer del archivo a un Readable stream y pasarlo a Cloudinary
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Indica el final del stream
    readableStream.pipe(uploadStream);
  });
};

/**
 * Elimina un archivo de Cloudinary.
 * @param publicId La ID pública del archivo en Cloudinary (incluyendo la carpeta si se especificó al subirlo).
 */
export const deleteFile = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "not found") {
      console.warn(
        `Cloudinary delete warning: archivo no encontrado para publicId: ${publicId}`
      );
      return; // No lanzamos error, solo avisamos
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

/**
 * (Opcional) Sube un video a Cloudinary.
 * @param buffer El buffer del archivo de video.
 * @param originalname El nombre original del archivo.
 * @param folder La carpeta en Cloudinary.
 * @returns La URL segura del video subido.
 */
export const uploadVideo = async (
  buffer: Buffer,
  originalname: string,
  folder: string = "ratacueva"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const publicId = originalname.split(".").slice(0, -1).join(".");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "video", // Especifica que es un video
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary video upload error:", error);
          return reject(
            new InternalServerError(
              "Error al subir el video al servicio de almacenamiento."
            )
          );
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(
            new InternalServerError(
              "Error: La subida de video a Cloudinary no devolvió una URL."
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
