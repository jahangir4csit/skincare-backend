
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const upload = async (file) => {
    const image = await cloudinary.uploader.upload(
        file,
        (result) => result
    );
    return image;
};

module.exports = { upload };
