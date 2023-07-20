const express = require('express');
const collection = require('../controller/collection.controller');
const catchAsync = require('../helper/catchAsync');
const validateAuthentication = require('../middleware/validateAuthentication');
const { validateCollectionId } = require('../middleware/validateId');
const validateAuthorization = require('../middleware/validateAuthorization');

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
  validateAuthorization,
  validateCollectionId,
  catchAsync(collection.updateCollection),
);

// GET /collections
router.get('/', catchAsync(collection.getCollections));

// GET /collections/:collectionId
router.get('/:collectionId',
  validateAuthorization,
  validateCollectionId,
  catchAsync(collection.getCollectionById),
);

// DELETE /collections/:collectionId
router.delete(
  '/:collectionId',
  validateAuthorization,
  validateCollectionId,
  catchAsync(collection.deleteCollection),
);

router.post(
  '/:collectionId/add-collaborator',
  // validateAuthorization,
  // validateCollectionId,
  catchAsync(collection.addCollaborator),
);

module.exports = router;
