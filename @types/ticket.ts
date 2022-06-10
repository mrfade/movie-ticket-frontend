export interface Ticket {
  id: number;
  sessionId: number;
  seats: number[],
  totalPrice: number,
  created: string,
}
