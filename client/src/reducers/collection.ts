import { CollectionAction, QuestionAction } from 'src/constants/action';

interface CollectionState {
  currentCollection?: any;
}

const INITIAL_STATE: any = {
  collection: null,
};

export const collectionReducer = (state = INITIAL_STATE, action: any): CollectionState => {
  switch (action.type) {
    case CollectionAction.GET_COLLECTION_BY_ID:
    case CollectionAction.UPDATE_COLLECTION:
    case CollectionAction.ADD_COLLABORATOR:
    case QuestionAction.UPDATE_QUESTION:
    case QuestionAction.CREATE_QUESTION:
    case QuestionAction.DELETE_QUESTION:
    case QuestionAction.DUPLICATE_QUESTION: {
      const collection = action.payload.data;

      return {
        currentCollection: collection,
      };
    }

    case CollectionAction.FLUSH_COLLECTION: {
      return INITIAL_STATE;
    }

    default:
      break;
  }

  return state;
};
