import { QuestionDataType } from '@/constants/dataType';

export const handleQuestionBeforeSubmit = (data: QuestionDataType) => {
  const res = {
    type: data.type,
    required: data.required,
    otherAnswerAccepted: data.otherAnswerAccepted,
    options: [...data.options].map((o) => {
      return { ...o, content: o.content.trim() };
    }),
    title: data?.title.trim(),
    description: data?.description?.trim(),
  };

  return res;
};
