import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IJournalLine, defaultValue } from 'app/shared/model/journal-line.model';

export const ACTION_TYPES = {
  FETCH_JOURNALLINE_LIST: 'journalLine/FETCH_JOURNALLINE_LIST',
  FETCH_JOURNALLINE: 'journalLine/FETCH_JOURNALLINE',
  CREATE_JOURNALLINE: 'journalLine/CREATE_JOURNALLINE',
  UPDATE_JOURNALLINE: 'journalLine/UPDATE_JOURNALLINE',
  PARTIAL_UPDATE_JOURNALLINE: 'journalLine/PARTIAL_UPDATE_JOURNALLINE',
  DELETE_JOURNALLINE: 'journalLine/DELETE_JOURNALLINE',
  RESET: 'journalLine/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IJournalLine>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type JournalLineState = Readonly<typeof initialState>;

// Reducer

export default (state: JournalLineState = initialState, action): JournalLineState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_JOURNALLINE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_JOURNALLINE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_JOURNALLINE):
    case REQUEST(ACTION_TYPES.UPDATE_JOURNALLINE):
    case REQUEST(ACTION_TYPES.DELETE_JOURNALLINE):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_JOURNALLINE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_JOURNALLINE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_JOURNALLINE):
    case FAILURE(ACTION_TYPES.CREATE_JOURNALLINE):
    case FAILURE(ACTION_TYPES.UPDATE_JOURNALLINE):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_JOURNALLINE):
    case FAILURE(ACTION_TYPES.DELETE_JOURNALLINE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_JOURNALLINE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_JOURNALLINE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_JOURNALLINE):
    case SUCCESS(ACTION_TYPES.UPDATE_JOURNALLINE):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_JOURNALLINE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_JOURNALLINE):
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

const apiUrl = 'api/journal-lines';

// Actions

export const getEntities: ICrudGetAllAction<IJournalLine> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_JOURNALLINE_LIST,
  payload: axios.get<IJournalLine>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IJournalLine> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_JOURNALLINE,
    payload: axios.get<IJournalLine>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IJournalLine> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_JOURNALLINE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IJournalLine> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_JOURNALLINE,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IJournalLine> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_JOURNALLINE,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IJournalLine> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_JOURNALLINE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
