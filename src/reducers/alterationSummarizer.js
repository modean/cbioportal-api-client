import {
  SUMMARIZE_ALTERATIONS,
  SUMMARIZE_ALTERATIONS_SUCCESS,
  SUMMARIZE_ALTERATIONS_FAIL
} from '../constants';

const initialState = {
  error: null,
  summary: null,
  loading: false
};

export default function alterationSummarizer (state = initialState, action = {}) {

  switch (action.type) {

    case SUMMARIZE_ALTERATIONS:
      return {
        ...state,
        loading: true,
        summary: null,
        error: null
      };

    case SUMMARIZE_ALTERATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        summary: action.result.summary
      };

    case SUMMARIZE_ALTERATIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };

      default:
        return state;

  }

}
