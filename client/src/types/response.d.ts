export interface BaseType {
  createdAt: number;
  updatedAt: number;
  __v: number;
}

export interface BaseTypeWithId extends BaseType {
  _id: string;
}

export interface Media {
  url: string;
  filename: string;
}

export interface Option {
  content: string;
  media?: Media;
}

export interface Answer {
  _id: string;
  questionId: string;
  otherAnswer?: string;
  options: Option[];
}

export interface ResponseCommon extends BaseTypeWithId {
  submitted: boolean;
  userId: string;
}

interface ResponseReduxState {
  response: ResponseCommon | {};
  questionIds: string[];
  answerByQuestionIds: Record<string, AnswerDataType>;
  errorByQuestionIds: Record<string, string>;
}
