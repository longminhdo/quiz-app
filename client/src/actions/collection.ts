import { CollectionAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';
import { Question } from '@/types/question';

export const getCollections = (query?: { title?: string; page?: number; sort?: string; limit?: number }) => ({
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

export const duplicateQuestion = ({ formId, pageId, questionId }: { formId: string; pageId: string; questionId: string }) => ({
  type: CollectionAction.DUPLICATE_QUESTION,
  promise: POST(`/forms/${formId}/pages/${pageId}/questions/${questionId}/duplicate`),
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

export const deleteQuestion = ({ collectionId, questionId }: { collectionId: string; questionId: string }) => ({
  type: CollectionAction.DELETE_QUESTION,
  promise: DELETE(`/collections/${collectionId}/questions/${questionId}`),
});

export const createQuestion = ({ newQuestion, collectionId }: { newQuestion: Question; collectionId: string }) => {
  const data = {
    title: newQuestion?.title,
    keys: newQuestion?.keys,
    level: newQuestion?.level,
    options: newQuestion?.options,
    type: newQuestion?.type,
    questionMedia: newQuestion?.questionMedia,
  };

  return {
    type: CollectionAction.CREATE_QUESTION,
    promise: POST(`/collections/${collectionId}/questions`, {
      body: data,
    }),
  };
};

export const updateQuestion = ({ newQuestion, collectionId }: { newQuestion: Question; collectionId: string }) => {
  const questionId = newQuestion._id;
  const data = {
    title: newQuestion?.title,
    keys: newQuestion?.keys,
    level: newQuestion?.level,
    options: newQuestion?.options,
    type: newQuestion?.type,
    questionMedia: newQuestion?.questionMedia,
  };

  return {
    type: CollectionAction.UPDATE_QUESTION,
    promise: PUT(`/collections/${collectionId}/questions/${questionId}`, {
      body: data,
    }),
  };
};
