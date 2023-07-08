import { CollectionAction } from 'src/constants/action';
import { transformReceivedCollection } from '@/utilities/quizHelpers';

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
    case CollectionAction.UPDATE_QUESTION:
    case CollectionAction.DUPLICATE_QUESTION: {
      const collection = action.payload.data;

      return {
        currentCollection: transformReceivedCollection(collection),
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
