const { cloudinary } = require('.');

const deleteImg = async (filename) => {
  const res = await cloudinary.uploader.destroy(filename);
  return res;
};

const uploadImg = async (url) => {
  const res = await cloudinary.uploader.upload(url, {
    folder: 'survey-app',
  });
  return res;
};

module.exports = {
  deleteImg,
  uploadImg,
};
