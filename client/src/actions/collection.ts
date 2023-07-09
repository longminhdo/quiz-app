import { CollectionAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';

export const getCollections = (query?: { search?: string; page?: number; sort?: string; limit?: number }) => ({
  type: CollectionAction.GET_COLLECTIONS,
  promise: GET('/collections', {
    params: query,
  }),
});

export const deleteCollection = (collectionId: string) => ({
  type: CollectionAction.DELETE_COLLECTION,
  promise: DELETE(`/collections/${collectionId}`),
});

export const getCollectionById = (collectionId: string) => ({
  type: CollectionAction.GET_COLLECTION_BY_ID,
  promise: GET(`/collections/${collectionId}`),
});

export const createCollection = (payload: { title: string }) => ({
  type: CollectionAction.CREATE_COLLECTION,
  promise: POST('/collections', {
    body: payload,
  }),
});

export const updateCollection = (newCollection: { _id: string; title: string }) => {
  const data = {
    title: newCollection?.title,
  };
  return {
    type: CollectionAction.UPDATE_COLLECTION,
    promise: PUT(`/collections/${newCollection._id}`, {
      body: data,
    }),
  };
};

export const flushCollection = () => ({
  type: CollectionAction.FLUSH_COLLECTION,
});
