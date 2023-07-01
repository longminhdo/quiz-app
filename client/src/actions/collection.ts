import { CollectionAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';

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

export const createCollection = () => ({
  type: CollectionAction.CREATE_COLLECTION,
  promise: POST('/collections'),
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
    promise: PUT(`/forms/${newCollection._id}`, {
      body: data,
    }),
  };
};

export const deleteQuestion = ({ formId, pageId, questionId }: { formId: string; pageId: string; questionId: string }) => ({
  type: CollectionAction.DELETE_QUESTION,
  promise: DELETE(`/forms/${formId}/pages/${pageId}/questions/${questionId}`),
});

export const updateQuestion = ({ newQuestion, formId, pageId }) => {
  const data = {
    title: newQuestion.title,
    description: newQuestion.description,
    type: newQuestion.type,
    required: newQuestion.required,
    otherAnswerAccepted: newQuestion.otherAnswerAccepted,
    options: [...newQuestion.options],
    questionMedia: newQuestion?.questionMedia,
  };

  return {
    type: CollectionAction.UPDATE_QUESTION,
    promise: PUT(`/forms/${formId}/pages/${pageId}/questions/${newQuestion._id}`, {
      body: data,
    }),
  };
};
