import { Logger } from '@app/core';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { Subject, Observable, empty, throwError } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestsInterceptor implements HttpInterceptor {
  refreshingAccessToken: boolean;
  accessTokenRefreshed: Subject<any> = new Subject();

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if (error.status === 401 || error.status === 400) {
          // refresh access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              return next.handle(request);
            }),
            catchError((err: any) => {
              console.log('err: ', err);
              this.authService.logout().subscribe(
                res => console.log(res),
                errr => console.log('err: ', errr)
              );
              return empty();
            })
          );
        }
        return throwError(error);
      })
    );
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken = true;
      return this.authService.refreshAccessToken().pipe(
        tap(() => {
          console.log('Access token refreshed');
          this.refreshingAccessToken = true;
          this.accessTokenRefreshed.next();
        })
      );
    }
  }
}
