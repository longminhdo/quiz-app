import { CollectionAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';

export const getCollections = (query?: { fetchAll?: boolean; search?: string; page?: number; sort?: string; limit?: number }) => ({
  type: CollectionAction.GET_COLLECTIONS,
  promise: GET('/collections', {
    params: query,
  }),
});

export const getFlushCollections = (query?: { fetchAll?: boolean; search?: string; page?: number; sort?: string; limit?: number }) => ({
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

export const getFlushCollectionById = (collectionId: string) => ({
  type: CollectionAction.GET_FLUSH_COLLECTION_BY_ID,
  promise: GET(`/collections/${collectionId}`),
});

export const createCollection = (payload: { title: string }) => ({
  type: CollectionAction.CREATE_COLLECTION,
  promise: POST('/collections', {
    body: payload,
  }),
});

export const updateCollection = (newCollection: any) => {
  const data = { ...newCollection };
  data?._id && delete data?._id;

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

export const addCollaborator = ({ collaborator, collectionId }) => ({
  type: CollectionAction.ADD_COLLABORATOR,
  promise: POST(`/collections/${collectionId}/add-collaborator`, {
    body: collaborator,
  }),
});
