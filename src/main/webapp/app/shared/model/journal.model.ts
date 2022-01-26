import dayjs from 'dayjs';
import { IJournalLine } from 'app/shared/model/journal-line.model';

export interface IJournal {
  id?: number;
  journalID?: string | null;
  dateOfEntry?: string | null;
  description?: string | null;
  journalLines?: IJournalLine[] | null;
}

export const defaultValue: Readonly<IJournal> = {};
