import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAppTransact, defaultValue } from 'app/shared/model/app-transact.model';

export const ACTION_TYPES = {
  FETCH_APPTRANSACT_LIST: 'appTransact/FETCH_APPTRANSACT_LIST',
  FETCH_APPTRANSACT: 'appTransact/FETCH_APPTRANSACT',
  CREATE_APPTRANSACT: 'appTransact/CREATE_APPTRANSACT',
  UPDATE_APPTRANSACT: 'appTransact/UPDATE_APPTRANSACT',
  PARTIAL_UPDATE_APPTRANSACT: 'appTransact/PARTIAL_UPDATE_APPTRANSACT',
  DELETE_APPTRANSACT: 'appTransact/DELETE_APPTRANSACT',
  RESET: 'appTransact/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAppTransact>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type AppTransactState = Readonly<typeof initialState>;

// Reducer

export default (state: AppTransactState = initialState, action): AppTransactState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_APPTRANSACT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_APPTRANSACT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_APPTRANSACT):
    case REQUEST(ACTION_TYPES.UPDATE_APPTRANSACT):
    case REQUEST(ACTION_TYPES.DELETE_APPTRANSACT):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_APPTRANSACT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_APPTRANSACT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_APPTRANSACT):
    case FAILURE(ACTION_TYPES.CREATE_APPTRANSACT):
    case FAILURE(ACTION_TYPES.UPDATE_APPTRANSACT):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_APPTRANSACT):
    case FAILURE(ACTION_TYPES.DELETE_APPTRANSACT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_APPTRANSACT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_APPTRANSACT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_APPTRANSACT):
    case SUCCESS(ACTION_TYPES.UPDATE_APPTRANSACT):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_APPTRANSACT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_APPTRANSACT):
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

const apiUrl = 'api/app-transacts';

// Actions

export const getEntities: ICrudGetAllAction<IAppTransact> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_APPTRANSACT_LIST,
  payload: axios.get<IAppTransact>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IAppTransact> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_APPTRANSACT,
    payload: axios.get<IAppTransact>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAppTransact> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_APPTRANSACT,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAppTransact> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_APPTRANSACT,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IAppTransact> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_APPTRANSACT,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAppTransact> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_APPTRANSACT,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
