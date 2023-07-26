import { isEmpty, isEqual } from 'lodash';
import { QuestionType } from '@/constants';
import { Question } from '@/types/question';
import { findDuplicates } from '@/utilities/helpers';

export const transformSendingQuestion = (question) => {
  const { type, options } = JSON.parse(JSON.stringify(question));
  let transformedKeys;
  let transformedOptions;

  if ([QuestionType.TEXT].includes(type)) {
    transformedKeys = question.keys;
    transformedOptions = [{ content: 'Option 1' }];
  }

  if ([QuestionType.MULTIPLE_CHOICE].includes(type)) {
    transformedKeys = [];
    options.forEach((option) => {
      if (option?.isCorrectAnswer) {
        transformedKeys.push(option?.content);
      }

      delete option.isCorrectAnswer;
      delete option.id;
      !option?.media && delete option?.media;
    });

    transformedOptions = options;
  }

  return { ...question, keys: transformedKeys, options: transformedOptions };
};

export const formatCode = (code: number) => {
  const result = code.toString().padStart(6, '0');

  return result;
};

const getFailure = (message) => ({ message, isValid: false });

export const validateQuestion = (question: Question) => {
  const { title, type, level, options, keys } = question;

  if (!title) {
    return getFailure('Empty question title');
  }

  if (!type) {
    return getFailure('Empty question type');
  }

  if (!level) {
    return getFailure('Empty question level');
  }

  if (isEmpty(options)) {
    return getFailure('Empty question options');
  }

  if (isEmpty(keys)) {
    return getFailure('Empty question keys');
  }

  if (!isEmpty(findDuplicates(keys))) {
    return getFailure('Keys are duplicated');
  }

  if (![1, 2, 3, 4].includes(Number(level))) {
    return getFailure('Question level must be in range of 1-4');
  }

  if (![QuestionType.MULTIPLE_CHOICE, QuestionType.TEXT].includes(type)) {
    return getFailure('Question type must be either multiple_choice or text');
  }

  if (isEqual(QuestionType.TEXT, type) && keys.length !== 1) {
    return getFailure('Text question can not have more than one key');
  }

  if (isEqual(QuestionType.MULTIPLE_CHOICE, type)) {
    const plainOptions = options.map((o) => o.content);

    if (!isEmpty(findDuplicates(plainOptions))) {
      return getFailure('Options must be unique');
    }

    let flag;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];

      if (!plainOptions.includes(k)) {
        flag = k;
        break;
      }
    }

    if (flag) {
      return getFailure(`Key "${flag}" is not in the option list`);
    }
  }

  return { isValid: true, message: '' };
};
