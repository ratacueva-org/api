import multer from 'multer';

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            const error = new Error("Solo se permiten archivos de imagen.");
            cb(error as unknown as null, false);
        }
    }
});
