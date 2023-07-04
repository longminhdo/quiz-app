const { InternalServerError } = require('../constant/errorMessage');
const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const Collection = require('../model/collection');

module.exports.createCollection = async (req, res) => {
  const { userData } = req;

  const collection = new Collection({ owner: userData.userId });

  await collection.save();

  return res.status(StatusCodes.CREATED).send({
    success: true,
    data: { data: collection },
  });
};

module.exports.updateCollection = async (req, res) => {
  const { collectionId } = req.params;
  const body = req.body;

  const updatedLibrary = await Collection.findByIdAndUpdate(collectionId, body, {
    new: true,
  })
    .populate('questions');

  return res.status(StatusCodes.OK).send({ success: true, data: { data: updatedLibrary } });
};

module.exports.getCollections = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { offset = 1, limit = 10, sort = '', search } = req.query;

    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = search ? { title: { $regex: search, $options: 'i' } } : {};

    const collections = await Collection.find({ owner: userId, ...searchOptions })
      .sort(sortOptions)
      .skip(skipCount)
      .limit(Number(limit));

    const totalCollections = await Collection.countDocuments({ owner: userId, ...searchOptions });

    return res.status(StatusCodes.OK).send({
      success: true,
      data: {
        data: collections.map(c => ({ ...c._doc, ownerData: req.userData })),
        pagination: {
          total: totalCollections,
          offset: Number(offset),
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: InternalServerError.INTERNAL_SERVER_ERROR, error });
  }
};

module.exports.getCollectionById = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findById(collectionId).populate('questions');

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: InternalServerError.INTERNAL_SERVER_ERROR, error });
  }
};

module.exports.deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    await Collection.findByIdAndDelete(collectionId);

    return res.status(StatusCodes.OK).send({
      success: true,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting user', error });
  }
};
