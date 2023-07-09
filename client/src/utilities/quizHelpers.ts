import { QuestionType } from '@/constants/constants';

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
