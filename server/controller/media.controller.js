//get all form sorted by recent
module.exports.upload = async (req, res) => {
  const uploadedFileData = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  return res.status(200).send({ data: uploadedFileData });
};
