const isEmpty = require('lodash/isEmpty');
const { isEqual } = require('lodash');
const { InternalServerError } = require('../constant/errorMessage');
const { StatusCodes } = require('../constant/statusCodes.js');
const { parseSortOption } = require('../helper/utils');
const User = require('../model/user');
const Collection = require('../model/collection');
const AppError = require('../helper/AppError');

const CollaboratorType = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
};

module.exports.createCollection = async (req, res) => {
  const { userData, body } = req;

  const collection = new Collection({ owner: userData._id, title: body.title });

  await collection.save();

  return res.status(StatusCodes.CREATED).send({
    success: true,
    data: { data: collection },
  });
};

module.exports.updateCollection = async (req, res) => {
  const { collectionId } = req.params;
  const body = req.body;

  const updatedLibrary = await Collection.findByIdAndUpdate(collectionId, body, { new: true })
    .populate({ path: 'questions', match: { deleted: false } });

  return res.status(StatusCodes.OK).send({ success: true, data: { data: updatedLibrary } });
};

module.exports.getCollections = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { offset = 1, limit = 10, sort = '', search, fetchAll = false } = req.query;

    const sortOptions = parseSortOption(sort);
    const skipCount = (Number(offset) - 1) * Number(limit);
    const searchOptions = search ? { title: { $regex: search, $options: 'i' } } : {};

    let collections;

    if (fetchAll) {
      collections = (await Collection.find({ owner: _id, deleted: { $ne: true }, ...searchOptions })
        .sort(sortOptions))?.filter(item => !isEmpty(item?.questions));
    } else {
      collections = await Collection.find({ owner: _id, deleted: { $ne: true }, ...searchOptions })
        .sort(sortOptions)
        .skip(skipCount)
        .limit(Number(limit));
    }

    const totalCollections = await Collection.countDocuments({ owner: _id, deleted: { $ne: true }, ...searchOptions });

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
    const collection = await Collection.findById(collectionId).populate({ path: 'questions', match: { deleted: false } });

    return res.status(StatusCodes.OK).send({ success: true, data: collection });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: InternalServerError.INTERNAL_SERVER_ERROR, error });
  }
};

module.exports.deleteCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    await Collection.findByIdAndDelete(collectionId);

    return res.status(StatusCodes.OK).send({
      success: true,
    });
  } catch (error) {
    return next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting collection.'));
  }
};

module.exports.addCollaborator = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const { user, type } = req.body;
    let payload;

    console.log(user);
    const foundCollection = await Collection.findById(collectionId);
    const foundUser = await User.findOne({ $or: [{ email: user }, { studentId: user }] });

    if (!foundUser) {
      return next(new AppError(StatusCodes.NOT_FOUND, 'User is not existed.'));
    }

    if (isEqual(foundUser._id, foundCollection.owner)) {
      return next(new AppError(StatusCodes.BAD_REQUEST, 'Owner can not be a collaborator.'));
    }

    const currentCollaborators = [...foundCollection.viewers, ...foundCollection.editors].map(item => String(item));
    if (currentCollaborators.includes(String(foundUser._id))) {
      return next(new AppError(StatusCodes.BAD_REQUEST, 'This user is currently a collaborator.'));
    }

    if (type === CollaboratorType.VIEWER) {
      payload = {
        viewers: [foundUser._id, ...foundCollection.viewers],
      };
    }

    if (type === CollaboratorType.EDITOR) {
      payload = {
        editors: [foundUser._id, ...foundCollection.editors],
      };
    }

    const updatedLibrary = await Collection.findByIdAndUpdate(collectionId, payload, { new: true })
      .populate({ path: 'questions', match: { deleted: false } });

    return res.status(StatusCodes.OK).send({ success: true, data: { data: updatedLibrary } });
  } catch (error) {
    console.log('first');
    next(error);
  }
};
