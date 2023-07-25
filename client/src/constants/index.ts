export const QuestionType = {
  TEXT: 'text',
  MULTIPLE_CHOICE: 'multiple_choice',
};

export const QuestionTypeEnums = {
  text: 'Text',
  multiple_choice: 'Multiple choice',
};

export const QuestionLevel = {
  REMEMBER: { value: 1, label: 'Remember' },
  UNDERSTAND: { value: 2, label: 'Understand' },
  APPLY: { value: 3, label: 'Apply' },
  CRITICALLY_APPLY: { value: 4, label: 'Critically Apply' },
};

export const QuestionLevelEnums = {
  1: 'Remember',
  2: 'Understand',
  3: 'Apply',
  4: 'Critically Apply',
};

export const LevelColorEnums = {
  1: 'default',
  2: 'green',
  3: 'gold',
  4: 'volcano',
};

export const BuilderType = {
  CREATE: 'create',
  UPDATE: 'update',
};

export const QUIZ_CREATE_MODE = {
  MANUAL: 'manual',
  RANDOM: 'random',
};

export const QuizType = {
  ASSIGNMENT: 'assignment',
  TEST: 'test',
};

export const DATE_FORMAT = {
  DATE_TIME: 'YYYY/MM/DD HH:mm:ss',
  DATE: 'YYYY/MM/DD',
  DATE_CALENDAR: 'MMM DD, YYYY',
};

export const TIME_SELECT_AFTER = {
  MINUTES: 'minutes',
  DAYS: 'days',
  HOURS: 'hours',
};

export const MINUTE_TO_MINUTE = 1;
export const HOUR_TO_MINUTE = 60;
export const DAY_TO_MINUTE = 1440;

export const QuizStatus = {
  DOING: 'doing',
  OPEN: 'open',
  DONE: 'done',
};
