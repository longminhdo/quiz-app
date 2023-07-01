const express = require('express');
const collection = require('../controller/collection.controller');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');
const { validateCollectionId } = require('../middleware/validateId');

const router = express.Router();

router.use(validateAuthentication);

// POST /collections
router.post(
  '/',
  catchAsync(collection.createCollection),
);

// PUT /collections/:collectionId
router.put(
  '/:collectionId',
  validateCollectionId,
  catchAsync(collection.updateCollection),
);

// GET /collections
router.get('/', catchAsync(collection.getCollections));

// GET /collections/:collectionId
router.get('/:collectionId',
  validateCollectionId,
  catchAsync(collection.getCollectionById),
);

// DELETE /collections/:collectionId
router.delete(
  '/:collectionId',
  validateCollectionId,
  catchAsync(collection.deleteCollection),
);

module.exports = router;
