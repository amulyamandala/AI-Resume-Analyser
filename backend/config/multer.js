import multer from "multer";

export const upload = multer({
  //store in RAM
  storage: multer.memoryStorage(),
  //to avoid RAM overflow
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  //for security validation
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png"
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    
    const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
    const isExtAllowed = allowedExtensions.includes(fileExt);
    
    if (isMimeAllowed || isExtAllowed) {
      cb(null, true);
    } else {
      const err = new Error("Only PDF, DOC, DOCX, JPEG, and PNG files are allowed");
      err.status = 400;
      cb(err, false);
    }
  },
});