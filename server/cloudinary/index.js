const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'thecodingpanda',
  api_key: '316945621772829',
  api_secret: 'cFoMHfW8ALs4x4MVUppD9ztcx5A',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'survey-app',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

module.exports = {
  cloudinary,
  storage,
};
