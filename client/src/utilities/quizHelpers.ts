import { QuestionType } from '@/constants';

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
