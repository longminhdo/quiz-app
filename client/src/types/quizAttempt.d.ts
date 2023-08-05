export interface CompletedQuestion {
  question: string;
  response?: Array<string>;
  correct?: boolean;
}

export interface QuizAttempt {
  _id?: string;
  completedQuestions?: Array<CompletedQuestion>;
  submitted: boolean;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
  __v: number;
}
