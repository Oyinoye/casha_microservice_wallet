import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWallet, defaultValue } from 'app/shared/model/wallet.model';

export const ACTION_TYPES = {
  FETCH_WALLET_LIST: 'wallet/FETCH_WALLET_LIST',
  FETCH_WALLET: 'wallet/FETCH_WALLET',
  CREATE_WALLET: 'wallet/CREATE_WALLET',
  UPDATE_WALLET: 'wallet/UPDATE_WALLET',
  PARTIAL_UPDATE_WALLET: 'wallet/PARTIAL_UPDATE_WALLET',
  DELETE_WALLET: 'wallet/DELETE_WALLET',
  RESET: 'wallet/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWallet>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type WalletState = Readonly<typeof initialState>;

// Reducer

export default (state: WalletState = initialState, action): WalletState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WALLET_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WALLET):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_WALLET):
    case REQUEST(ACTION_TYPES.UPDATE_WALLET):
    case REQUEST(ACTION_TYPES.DELETE_WALLET):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_WALLET):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WALLET_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WALLET):
    case FAILURE(ACTION_TYPES.CREATE_WALLET):
    case FAILURE(ACTION_TYPES.UPDATE_WALLET):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_WALLET):
    case FAILURE(ACTION_TYPES.DELETE_WALLET):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WALLET_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_WALLET):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_WALLET):
    case SUCCESS(ACTION_TYPES.UPDATE_WALLET):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_WALLET):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_WALLET):
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

const apiUrl = 'api/wallets';

// Actions

export const getEntities: ICrudGetAllAction<IWallet> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_WALLET_LIST,
  payload: axios.get<IWallet>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IWallet> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WALLET,
    payload: axios.get<IWallet>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IWallet> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WALLET,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IWallet> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WALLET,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IWallet> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_WALLET,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWallet> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WALLET,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
