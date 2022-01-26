import dayjs from 'dayjs';
import { ICustomer } from 'app/shared/model/customer.model';
import { WalletType } from 'app/shared/model/enumerations/wallet-type.model';
import { WalletStatus } from 'app/shared/model/enumerations/wallet-status.model';

export interface IWallet {
  id?: number;
  walletID?: string | null;
  nuban?: string | null;
  accountNumber?: string | null;
  balance?: number | null;
  expiryDate?: string | null;
  type?: WalletType | null;
  status?: WalletStatus | null;
  customer?: ICustomer | null;
}

export const defaultValue: Readonly<IWallet> = {};
