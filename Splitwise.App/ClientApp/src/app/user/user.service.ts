import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class UserService {

  private UserUrl = "http://localhost:63793/api/user";

  constructor(private http: HttpClient) { }

  GetUserByUserEmail(userEmail: string,userPassword:string): Observable<User> {
    const url = `${this.UserUrl}/${userEmail}/${userPassword}`;
    return this.http.get<User>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetUser(userId: number): Observable<User> {
    const url = `${this.UserUrl}/${userId}`;
    return this.http.get<User>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(this.UserUrl, user, { headers })
      .pipe(
        tap(data => console.log('user:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  UpdateUser(userId: number, user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.UserUrl}/${userId}`;
    return this.http.put<User>(url, user, { headers })
      .pipe(
        tap(data => console.log('update user:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  DeleteUser(userId: number): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.UserUrl}/${userId}`;

    return this.http.delete<User>(url, { headers })
      .pipe(
        tap(data => console.log('delete User:' + userId)),
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
