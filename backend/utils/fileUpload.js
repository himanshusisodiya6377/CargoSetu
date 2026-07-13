const multer = require("multer")
const cloudinary = require("../config/cloudinary.js");

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage, fileFilter })

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function deleteCloudinaryImages(images) {
  if (!images || images.length === 0) return;
  for (const img of images) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }
}

module.exports = { upload, uploadToCloudinary, deleteCloudinaryImages }