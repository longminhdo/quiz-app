import { QuestionAction } from '@/constants/action';
import { Question } from '@/types/question';
import { DELETE, POST, PUT } from '@/utilities/request';

export const deleteQuestion = ({ collectionId, questionId }: { collectionId: string; questionId: string }) => ({
  type: QuestionAction.DELETE_QUESTION,
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
    type: QuestionAction.CREATE_QUESTION,
    promise: POST(`/collections/${collectionId}/questions`, {
      body: data,
    }),
  };
};

export const updateQuestion = ({ newQuestion, collectionId }: { newQuestion: Question; collectionId: string }) => {
  const questionId = newQuestion._id;
  const data = {
    title: newQuestion?.title?.trim(),
    keys: newQuestion?.keys?.map((k) => String(k).trim()),
    level: newQuestion?.level,
    options: newQuestion?.options,
    type: newQuestion?.type,
    questionMedia: newQuestion?.questionMedia,
  };

  return {
    type: QuestionAction.UPDATE_QUESTION,
    promise: PUT(`/collections/${collectionId}/questions/${questionId}`, {
      body: data,
    }),
  };
};

export const updateFlushQuestion = ({ newQuestion, collectionId }: { newQuestion: Question; collectionId: string }) => {
  const questionId = newQuestion._id;
  const data = {
    title: newQuestion?.title?.trim(),
    keys: newQuestion?.keys?.map((k) => String(k).trim()),
    level: newQuestion?.level,
    options: newQuestion?.options,
    type: newQuestion?.type,
    questionMedia: newQuestion?.questionMedia,
  };

  return {
    type: QuestionAction.UPDATE_FLUSH_QUESTION,
    promise: PUT(`/collections/${collectionId}/questions/${questionId}`, {
      body: data,
    }),
  };
};

export const duplicateQuestion = ({ formId, pageId, questionId }: { formId: string; pageId: string; questionId: string }) => ({
  type: QuestionAction.DUPLICATE_QUESTION,
  promise: POST(`/forms/${formId}/pages/${pageId}/questions/${questionId}/duplicate`),
});
