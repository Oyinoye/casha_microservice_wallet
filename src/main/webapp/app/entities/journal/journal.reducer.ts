import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IJournal, defaultValue } from 'app/shared/model/journal.model';

export const ACTION_TYPES = {
  FETCH_JOURNAL_LIST: 'journal/FETCH_JOURNAL_LIST',
  FETCH_JOURNAL: 'journal/FETCH_JOURNAL',
  CREATE_JOURNAL: 'journal/CREATE_JOURNAL',
  UPDATE_JOURNAL: 'journal/UPDATE_JOURNAL',
  PARTIAL_UPDATE_JOURNAL: 'journal/PARTIAL_UPDATE_JOURNAL',
  DELETE_JOURNAL: 'journal/DELETE_JOURNAL',
  RESET: 'journal/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IJournal>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type JournalState = Readonly<typeof initialState>;

// Reducer

export default (state: JournalState = initialState, action): JournalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_JOURNAL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_JOURNAL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_JOURNAL):
    case REQUEST(ACTION_TYPES.UPDATE_JOURNAL):
    case REQUEST(ACTION_TYPES.DELETE_JOURNAL):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_JOURNAL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_JOURNAL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_JOURNAL):
    case FAILURE(ACTION_TYPES.CREATE_JOURNAL):
    case FAILURE(ACTION_TYPES.UPDATE_JOURNAL):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_JOURNAL):
    case FAILURE(ACTION_TYPES.DELETE_JOURNAL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_JOURNAL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_JOURNAL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_JOURNAL):
    case SUCCESS(ACTION_TYPES.UPDATE_JOURNAL):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_JOURNAL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_JOURNAL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/journals';

// Actions

export const getEntities: ICrudGetAllAction<IJournal> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_JOURNAL_LIST,
  payload: axios.get<IJournal>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IJournal> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_JOURNAL,
    payload: axios.get<IJournal>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IJournal> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_JOURNAL,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IJournal> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_JOURNAL,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IJournal> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_JOURNAL,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IJournal> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_JOURNAL,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
