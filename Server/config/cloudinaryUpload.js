const streamifier = require("streamifier");
const cloudinary = require("./cloudinary");

/**
 * Upload a file buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{secure_url:string, public_id:string}>}
 */
function uploadBuffer(buffer, folder = "ecommerce/products") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports = { uploadBuffer };
