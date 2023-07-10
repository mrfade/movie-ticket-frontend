import type { Model } from './model';
import type { Session } from './movie'
import type { Seat } from './theater'
import type { User } from './user';

export interface Ticket extends Model {
  UserId: number;
  User?: User;
  SessionId: number;
  Session?: Session;
  Seats: Seat[];
  TotalPrice: number;
}
