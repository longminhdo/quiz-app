export enum ResponseAction {
  CREATE_NEW_RESPONSE = 'create_new_response',
  GET_RESPONSE = 'get_response',
  UPDATE_ANSWER = 'update_answer',
  SUBMIT_RESPONSE = 'submit_response',
  SET_ERROR = 'set_error',
  CLEAR_ERROR = 'clear_error',
  GET_FULL_RESPONSES = 'get_full_responses',
}

export enum CollectionAction {
  GET_COLLECTIONS = 'get_collections',
  GET_FLUSH_COLLECTIONS = 'get_flush_collections',
  FLUSH_COLLECTION = 'flush_collection',
  GET_COLLECTION_BY_ID = 'get_collection_by_id',
  GET_FLUSH_COLLECTION_BY_ID = 'get_flush_collection_by_id',
  CREATE_COLLECTION = 'create_collection',
  DELETE_COLLECTION = 'delete_collection',
  UPDATE_COLLECTION = 'update_collection',
}

export enum QuestionAction {
  CREATE_QUESTION = 'create_question',
  DELETE_QUESTION = 'delete_question',
  UPDATE_QUESTION = 'update_question',
  UPDATE_FLUSH_QUESTION = 'update_flush_question',
  DUPLICATE_QUESTION = 'duplicate_question',
  GET_QUESTIONS = 'get_question',
}

export enum QuizAction {
  GET_QUIZZES = 'get_quizzes',
  GET_QUIZ_BY_ID = 'get_quiz_by_id',
  DELETE_QUIZ = 'delete_quiz',
  UPDATE_QUIZ = 'update_quiz',
  CREATE_QUIZ = 'create_quiz',
  GENERATE_QUIZ_CODE = 'generate_quiz_code',
  FLUSH_QUIZ = 'flush_quiz',
}

export enum QuizAttemptAction {
  JOIN = 'join',
  GET_ATTEMPTS = 'get_attempts',
  GET_ATTEMPT_BY_ID = 'get_attempt_by_id',
  SUBMIT = 'submit',
  UPDATE_ATTEMPT = 'update_attempt',
}

export enum AuthenticationAction {
  GET_SSO_TOKEN = 'get_sso_token',
  SSO_LOGIN = 'sso_login',
  LOGOUT = 'logout',
}
