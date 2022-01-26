import { IWallet } from 'app/shared/model/wallet.model';

export interface IBiller {
  id?: number;
  name?: string | null;
  description?: string | null;
  wallet?: IWallet | null;
}

export const defaultValue: Readonly<IBiller> = {};
