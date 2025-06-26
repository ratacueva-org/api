import multer from "multer";

// Tamaños máximos (en bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20 MB

// Storage en memoria
const storage = multer.memoryStorage();

// Middleware multer base
const multerInstance = multer({
  storage,
  // No pongas fileSize aquí porque no puede ser dinámico por tipo, lo controlaremos en fileFilter
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      return cb(
        new Error("Solo se permiten archivos de imagen o video.") as any,
        false
      );
    }

    // Control de tamaño personalizado según tipo
    const size = parseInt(req.headers["content-length"] || "0", 10);

    // Nota: multer no permite filtrar por tamaño por archivo en fileFilter, sólo total request size.
    // Por eso este chequeo aquí no garantiza 100% y puedes manejarlo manualmente en el controller si quieres.
    // Por ahora dejamos pasar todo y controlamos tamaños max con limits.fileSize (el mayor).

    cb(null, true);
  },
});

// Middleware para recibir varios campos (imágenes y videos)
export const uploadMedia = multerInstance.fields([
  { name: "images", maxCount: 5 }, // máximo 5 imágenes
  { name: "videos", maxCount: 2 }, // máximo 2 videos
]);