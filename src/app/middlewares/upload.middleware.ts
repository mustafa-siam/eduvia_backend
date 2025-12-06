// upload.middleware.ts
import multer from 'multer';
import path from 'path';

// Memory storage preferred for small-medium files
const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.xlsx' && ext !== '.xls') {
    cb(new Error('Only Excel files are allowed'), false);
  } else {
    cb(null, true);
  }
};

export const uploadExcel = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
