import { User } from "../user/user";
import { UserBalanceInfo } from "../user/user-balance-info";

export interface GroupData {
  GroupId: number,
  GroupName: string,
  GroupCategory: string,
  CreatedBy: string,
  CreatedById: number,
  GroupLink: string,
  SimplifyDebts: boolean,
  CreatedAt: string,
  Modified: string,
  Users: Array<UserBalanceInfo>

}
