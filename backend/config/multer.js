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
    if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
      cb(null, true);
    } else {
      const err = new Error("Only PDF and DOCXallowed");
      err.status = 400;
      cb(err, false);
    }
  },
});