import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { ExpenseData } from '../expense/expense-data';
import { Expense } from './expense';
import { Repayment } from './repayment';
import { Balance } from '../user/balance';
import { FriendExpenseData } from './friend-expense-data';
import { RepaymentDetail } from './repayment-detail';

@Injectable()
export class ExpenseService {

  private expenseUrl = "http://localhost:63793/api/expense";

  constructor(private http: HttpClient) { }

  GetExpense(expenseId: number): Observable<ExpenseData> {
    const url = `${this.expenseUrl}/${expenseId}`;
    return this.http.get<ExpenseData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }


  AddExpense(expense: Expense): Observable<ExpenseData> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ExpenseData>(this.expenseUrl, expense, { headers })
      .pipe(
        tap(data => console.log('expense:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  UpdateExpense(expenseId: number, expense: Expense): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.expenseUrl}/${expenseId}`;
    return this.http.put<Expense>(url, expense, { headers })
      .pipe(
        tap(data => console.log('updated expense')),
        catchError(this.handleError)
      );
  }

  GetSettlement(userId: number): Observable<ExpenseData[]> {
    const url = `${this.expenseUrl}/${userId}/settlement`;
    return this.http.get<ExpenseData[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddRepayment(repayment: Repayment): Observable<Repayment> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.expenseUrl}/repayment`;
    return this.http.post<ExpenseData>(url, repayment, { headers })
      .pipe(
        tap(data => console.log('repayment:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddBalance(balance: Balance): Observable<Balance> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.expenseUrl}/balance`;
    return this.http.post<ExpenseData>(url, balance, { headers })
      .pipe(
        tap(data => console.log('balance:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetRepayment(repaymentId: number): Observable<Repayment> {
    const url = `${this.expenseUrl}/${repaymentId}/repayment`;
    return this.http.get<Repayment>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetExpenseWithFriend(userId: number, friendId: number): Observable<FriendExpenseData> {
    const url = `${this.expenseUrl}/${userId}/${friendId}/friend-expense`;
    return this.http.get<FriendExpenseData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetOwedExpenseWithAllFriend(userId: number): Observable<RepaymentDetail> {
    const url = `${this.expenseUrl}/get-owed/${userId}`;
    return this.http.get<RepaymentDetail>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetPaidExpenseWithAllFriend(userId: number): Observable<RepaymentDetail> {
    const url = `${this.expenseUrl}/get-paid/${userId}`;
    return this.http.get<RepaymentDetail>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `an error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `backend return code ${err.status} : ${err.body.error}`;
    }
    console.error(errorMessage);
    return _throw(errorMessage);
  }
}
