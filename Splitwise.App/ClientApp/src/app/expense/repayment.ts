export interface Repayment {
  RepaymentId: number,
  ExpenseId: number,
  From: number,
  To: number,
  Amount: number,
  CreatedAt: string,
  IsActive: boolean
}
