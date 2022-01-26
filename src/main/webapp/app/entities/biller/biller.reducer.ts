import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IBiller, defaultValue } from 'app/shared/model/biller.model';

export const ACTION_TYPES = {
  FETCH_BILLER_LIST: 'biller/FETCH_BILLER_LIST',
  FETCH_BILLER: 'biller/FETCH_BILLER',
  CREATE_BILLER: 'biller/CREATE_BILLER',
  UPDATE_BILLER: 'biller/UPDATE_BILLER',
  PARTIAL_UPDATE_BILLER: 'biller/PARTIAL_UPDATE_BILLER',
  DELETE_BILLER: 'biller/DELETE_BILLER',
  RESET: 'biller/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IBiller>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type BillerState = Readonly<typeof initialState>;

// Reducer

export default (state: BillerState = initialState, action): BillerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BILLER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_BILLER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_BILLER):
    case REQUEST(ACTION_TYPES.UPDATE_BILLER):
    case REQUEST(ACTION_TYPES.DELETE_BILLER):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_BILLER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_BILLER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_BILLER):
    case FAILURE(ACTION_TYPES.CREATE_BILLER):
    case FAILURE(ACTION_TYPES.UPDATE_BILLER):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_BILLER):
    case FAILURE(ACTION_TYPES.DELETE_BILLER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_BILLER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_BILLER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_BILLER):
    case SUCCESS(ACTION_TYPES.UPDATE_BILLER):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_BILLER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_BILLER):
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

const apiUrl = 'api/billers';

// Actions

export const getEntities: ICrudGetAllAction<IBiller> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BILLER_LIST,
  payload: axios.get<IBiller>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IBiller> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BILLER,
    payload: axios.get<IBiller>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IBiller> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BILLER,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IBiller> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BILLER,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IBiller> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_BILLER,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IBiller> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BILLER,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
