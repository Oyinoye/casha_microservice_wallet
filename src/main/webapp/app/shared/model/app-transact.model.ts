import dayjs from 'dayjs';
import { ICustomer } from 'app/shared/model/customer.model';
import { TransactionType } from 'app/shared/model/enumerations/transaction-type.model';

export interface IAppTransact {
  id?: number;
  type?: TransactionType | null;
  transactionDate?: string | null;
  transactionRef?: string | null;
  description?: string | null;
  customer?: ICustomer | null;
}

export const defaultValue: Readonly<IAppTransact> = {};
