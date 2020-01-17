import { RepaymentDetail } from "./repayment-detail";

export interface ExpenseData {
  ExpenseId: number,
  GroupId: number,
  PaidById: number,
  PaidBy: string,
  ExpenseName: string,
  ExpenseAmount: number,
  Currency: string,
  ExpenseDate: string,
  Notes: string,
  SplitType: string,
  CreatedBy: string,
  ExpenseType: string,
  Modified: string,
  IsSettlement: boolean,
  IsActive: boolean,
  LentTotal: number,
  PaidTotal: number,
  RepaymentDetails: Array<RepaymentDetail>
}
