import multer from "multer";
import { AppError } from "../utils/AppError";

const allowedExtensions = [".csv", ".txt", ".json", ".pdf", ".png", ".jpg", ".jpeg"];
const maxFileSize = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize },
  fileFilter: (_request, file, callback) => {
    const lower = file.originalname.toLowerCase();
    const valid = allowedExtensions.some((extension) => lower.endsWith(extension));
    if (!valid) return callback(new AppError("Formato de arquivo invalido."));
    return callback(null, true);
  }
});
