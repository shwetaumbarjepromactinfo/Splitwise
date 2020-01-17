import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupData } from './group-data';
import { Observable } from 'rxjs/Observable';
import { tap, catchError, map } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { Group } from './group';
import { GroupUser } from './group-user';
import { ExpenseData } from '../expense/expense-data';
import { Category } from './category';
import { User } from '../user/user';
import { Currency } from '../user/currency';
import { SplitType } from '../user/split-type';
import { Friend } from '../user/friend';

@Injectable()
export class GroupService {

  private groupUrl = "http://localhost:63793/api/group";

  constructor(private http: HttpClient) { }

  GetGroupByUserId(userId: number): Observable<GroupData[]> {
    const url = `${this.groupUrl}/user-group/${userId}`;
    return this.http.get<GroupData[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetGroupByGroupId(groupId: number): Observable<GroupData> {
    const url = `${this.groupUrl}/${groupId}`;
    return this.http.get<GroupData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetCategories(): Observable<Category[]> {
    const url = `${this.groupUrl}/category`;
    return this.http.get<Category>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddGroup(group: Group): Observable<GroupData> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<GroupData>(this.groupUrl, group, { headers })
      .pipe(
        tap(data => console.log('user:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddGroupUser(groupUser: GroupUser): Observable<GroupUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.groupUrl}/group-user`;
    return this.http.post<GroupData>(url, groupUser, { headers })
      .pipe(
        tap(data => console.log('user:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  UpdateGroup(groupId: number, group: Group): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.groupUrl}/${groupId}`;
    return this.http.put<Group>(url, group, { headers })
      .pipe(
        tap(data => console.log('update group:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetNonGroup(userId: number): Observable<GroupData> {
    const url = `${this.groupUrl}/0/user/${userId}`;
    return this.http.get<GroupData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  CheckUserByEmail(userEmail: string): Observable<User> {
    const url = `${this.groupUrl}/user/${userEmail}`;
    return this.http.get<User>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetGroupExpensesByGroupId(groupId: number, userId: number): Observable<ExpenseData> {
    const url = `${this.groupUrl}/${groupId}/${userId}/expense`;
    return this.http.get<ExpenseData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetCurrency(): Observable<Currency[]> {
    const url = `${this.groupUrl}/currency`;
    return this.http.get<ExpenseData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetSplitType(): Observable<SplitType[]> {
    const url = `${this.groupUrl}/split-type`;
    return this.http.get<ExpenseData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  CheckFriendship(userId: number, friendId: number): Observable<any> {
    const url = `${this.groupUrl}/${userId}/${friendId}/friend`;
    return this.http.get<boolean>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddFriend(friend: Friend): Observable<Friend> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.groupUrl}/friend`;
    return this.http.post<GroupData>(url, friend, { headers })
      .pipe(
        tap(data => console.log('friend:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetAllFriendsByUserId(userId: number): Observable<User[]> {
    const url = `${this.groupUrl}/${userId}/all-friend`;
    return this.http.get<User[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  DeleteGroup(groupId: number): Observable<Group> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.groupUrl}/${groupId}/delete`;

    return this.http.put<Group>(url, { headers })
      .pipe(
        tap(data => console.log('delete Group:' + groupId)),
        catchError(this.handleError)
    );
  }

  DeleteGroupUser(groupId: number): Observable<GroupUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.groupUrl}/${groupId}/group-user`;

    return this.http.put<GroupUser>(url, { headers })
      .pipe(
        tap(data => console.log('delete Group user')),
        catchError(this.handleError)
      );
  }

  isEmailRegisterd(email: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.groupUrl}/user/email/${email}`;
    return this.http.get(url)
      .pipe(map((response: any) => response.json()),
        catchError(this.handleError1)
    );
  }

  private handleError1(error: any) {
    console.log(error);
    return Observable.throw(error.json());
    ;
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
