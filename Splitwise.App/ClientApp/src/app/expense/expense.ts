export interface Expense {
  ExpenseId: number,
  GroupId: number,
  PaidBy: number,
  ExpenseName: string,
  ExpenseAmount: number,
  Currency: string,
  ExpenseDate: string,
  Notes: string,
  SplitType: string,
  CreatedBy: number,
  IsSettlement: boolean,
  Modified: string,
  IsActive: boolean
}
