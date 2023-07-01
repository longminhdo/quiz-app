const express = require('express');
const multer = require('multer');
const media = require('../controller/media.controller');
const { storage } = require('../cloudinary');
const AppError = require('../helper/AppError');

const router = express.Router({ mergeParams: true });

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1GB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png'
      || file.mimetype === 'image/jpg'
      || file.mimetype === 'image/jpeg'
      || file.mimetype === 'image/webp'
      || file.mimetype === 'image/bmp'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new AppError(400, 'Only .png, .jpg and .jpeg format allowed!'));
    }

    return null;
  },
});

router.post(
  '',
  upload.any(),
  media.upload,
);

module.exports = router;
