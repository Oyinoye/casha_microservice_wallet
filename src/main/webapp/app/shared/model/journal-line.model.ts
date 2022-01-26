import { IJournal } from 'app/shared/model/journal.model';
import { IWallet } from 'app/shared/model/wallet.model';
import { TransactionType } from 'app/shared/model/enumerations/transaction-type.model';
import { OperationType } from 'app/shared/model/enumerations/operation-type.model';

export interface IJournalLine {
  id?: number;
  amount?: number | null;
  type?: TransactionType | null;
  narration?: string | null;
  operation?: OperationType | null;
  wallet?: IWallet | null;
  journal?: IJournal | null;
}

export const defaultValue: Readonly<IJournalLine> = {};
