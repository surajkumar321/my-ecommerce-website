const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: "ecommerce/products",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname.split(".").shift()}`,
    format: undefined, // auto
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  }),
});

const upload = multer({ storage });

module.exports = upload;

