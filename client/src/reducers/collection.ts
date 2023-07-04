import { CollectionAction } from 'src/constants/action';

interface CollectionState {
  collection?: any;
}

const INITIAL_STATE: any = {
  collection: null,
};

export const collectionReducer = (state = INITIAL_STATE, action: any): CollectionState => {
  switch (action.type) {
    case CollectionAction.CREATE_COLLECTION:
    case CollectionAction.GET_COLLECTION_BY_ID:
    case CollectionAction.UPDATE_COLLECTION:
    case CollectionAction.DUPLICATE_QUESTION:
    case CollectionAction.UPDATE_QUESTION:
    case CollectionAction.DELETE_QUESTION:
    case CollectionAction.CREATE_QUESTION: {
      const collection = action.payload.data;

      return {
        ...collection,
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