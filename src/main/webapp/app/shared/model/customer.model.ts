import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface ICustomer {
  id?: number;
  customerID?: string;
  phoneNumber?: string;
  nationality?: string | null;
  address?: string | null;
  bvn?: number | null;
  dateOfBirth?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ICustomer> = {};
