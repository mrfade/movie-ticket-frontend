import { Session } from './movie'
import { Seat } from './theather'

export interface Ticket {
  id: number;
  session: Session;
  seats: Seat[],
  totalPrice: number,
  created: string,
}
