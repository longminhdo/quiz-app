export interface TimestampDataType {
  createdAt: number;
  updatedAt: number;
}

export type QuestionType = 'short' | 'long' | 'radio' | 'checkbox';

export type QuestionIdType = string;

export type MediaDataType = { url: string; filename: string };

export type PageIdType = string;
export interface OptionDataType {
  content: string;
  media?: MediaDataType;
}

export interface AnswerDataType {
  _id: string;
  questionId: string;
  options: Array<OptionDataType>;
  otherAnswer?: string;
}

export interface LocalAnswer extends AnswerDataType {
  isOtherAnswer?: boolean;
}

export interface ResponseDataType {
  _id: string;
  userId: string;
  submitted: boolean;
  answers: Array<AnswerDataType>;
}

export interface QuestionDataType extends TimestampDataType {
  _id: string;
  title: string;
  type: QuestionType;
  imgUrl?: string | null;
  options: Array<OptionDataType>;
  otherAnswerAccepted: boolean;
  required: boolean;
  __v?: number;
  description?: string;
  questionMedia?: MediaDataType;
}

export interface PageDataType extends TimestampDataType {
  _id?: string;
  description?: string;
  title: string;
  __v?: number;
}

export interface PageGeneralDataType extends PageDataType {
  questions: Array<QuestionIdType>;
}

export interface PageDetailDataType extends PageDataType {
  questions: Array<QuestionDataType>;
}

export interface Config {
  isAcceptResponse?: boolean;
  isAllowAnonymous?: boolean;
  isSubmittable?: boolean;
}

export interface FormDataType extends TimestampDataType {
  _id: string;
  title: string;
  description?: string;
  responses: Array<any>;
  isAcceptResponse: boolean;
  isAllowAnonymous: boolean;
  userId: string;
  config: {
    isAcceptResponse: boolean;
    isAllowAnonymous: boolean;
    isSubmittable: boolean;
    acceptedDepartments: Array<string>;
    acceptedRoles: Array<string>;
  };
  __v?: number;
}

export interface FormDetailedDataType extends Omit<FormDataType, 'responses'> {
  pages: Array<PageDetailDataType>;
  response: ResponseDataType;
}
export interface SubmittedResponse {
  _id: string;
  userId: string;
  submitted: true;
  answers: string[];
}

export interface FormGeneralDataType extends FormDataType {
  pages: Array<PageIdType>;
}

export interface SelectedItemDataType {
  selectedPage: PageIdType;
  selectedQuestion?: QuestionIdType;
}

export interface QuestionsDataType {
  [id: string]: QuestionDataType;
}

export interface PageDictionaryDataType {
  [id: string]: PageGeneralDataType;
}

export interface ISummaryAnalyticsItem {
  answers: Array<{ answer: string; count: number }>;
  totalAnswers: number;
  title: string;
  type: string;
  _id: string;
}

/*******************************/
/** REFACTOR TYPING FROM HERE **/

export interface InitialConfigs {
  createdAt: number;
  updatedAt: number;
  __v: number;
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
  otherAnswer: string;
  options: Array<Option>;
  __v: number;
}

export interface Response extends InitialConfigs {
  _id: string;
  userId: string;
  submitted: boolean;
  answers: Array<Answer>;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  type: string;
  required: boolean;
  otherAnswerAccepted: boolean;
  options: Array<Option>;
  __v: number;
}

export interface Page extends InitialConfigs {
  _id: string;
  title: string;
  description: string;
  questions: Array<Question>;
}

export interface Form extends InitialConfigs {
  _id: string;
  userId: string;
  config: {
    isAcceptResponse: boolean;
    isAllowAnonymous: boolean;
    isSubmittable: boolean;
    acceptedDepartments: Array<string>;
    acceptedRoles: Array<string>;
  };
  responses: Array<Response>;
  pages: Array<any>;
  description: string;
  title: string;
}

export interface SelectedItem {
  selectedQuestion?: string;
  selectedPage: string;
}
