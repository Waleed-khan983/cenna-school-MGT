import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/lectures";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".jpg",
        ".jpeg",
        ".png",
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOC, PPT, and image files are allowed"), false);
    }
};

const uploadLecture = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

export default uploadLecture;