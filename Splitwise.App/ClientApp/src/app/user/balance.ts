export interface Balance {
  BalanceId: number,
  UserId: number,
  ExpenseId: number,
  PaidShare: number,
  OwedShare: number,
  NetBalance: number,
  Modified: string,
  CreatedAt: string,
  IsActive: boolean,
  IsPaid: boolean
}
