import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<M> {
  public headers = {};
  constructor(public httpClient: HttpClient) {}

  get token() {
    const token = JSON.parse(sessionStorage.getItem('credentials')).token;
    return token || null;
  }

  sendGet(url: any): Observable<M> {
    this.headers = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token })
    };
    return this.httpClient.get(url, this.headers).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendPost(
    url: any,
    payload: any,
    needsHeaders: boolean,
    res?: boolean
  ): Observable<M> {
    if (needsHeaders === true) {
      if (res === true) {
        this.headers = {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token })
        };
        return this.httpClient
          .post(url, payload, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
            responseType: 'text'
          })
          .pipe(
            map((body: any) => body),
            catchError(this.handleError)
          );
      }

      this.headers = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token })
      };
      return this.httpClient.post(url, payload, this.headers).pipe(
        map((body: any) => body),
        catchError(this.handleError)
      );
    } else {
      return this.httpClient.post(url, payload).pipe(
        map((body: any) => body),
        catchError(this.handleError)
      );
    }
  }

  sendPut(url: any, payload: any): Observable<M> {
    this.headers = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token })
    };
    return this.httpClient.put(url, payload, this.headers).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendPatch(url: any, payload: any): Observable<M> {
    this.headers = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token })
    };
    return this.httpClient.patch(url, payload, this.headers).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendDelete(url: any): Observable<M> {
    this.headers = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token })
    };
    return this.httpClient.delete(url, this.headers).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  baseUrl(url: string) {
    return environment.serverUrl + url;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
    } else {
      if (
        error.status === 401 ||
        error.status === 504 ||
        error.status === 400
      ) {
        // console.error('An error occurred:', error.error);
        return throwError(
          JSON.stringify({
            name: error.error,
            status: error.status,
            message: error.message
          })
        );
      }
    }
    return throwError(
      JSON.stringify({
        name: error.name,
        status: error.status,
        message: error.message
      })
    );
  }
}
