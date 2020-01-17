import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Activity } from './activity';
import { tap, catchError, map } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class ActivityService {

  private activityUrl = "http://localhost:63793/api/activity";

  constructor(private http: HttpClient) { }

  GetActivityByUserId(userId: number): Observable<Activity[]> {
    const url = `${this.activityUrl}/all-activity/${userId}`;
    return this.http.get<Activity[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddActivity(activity: Activity): Observable<Activity> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Activity>(this.activityUrl, activity, { headers })
      .pipe(
        tap(data => console.log('user:' + JSON.stringify(data))),
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
