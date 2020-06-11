import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

const routes = {
  login: 'user/login',
  logout: 'user/logout',
  register: 'user/register',
  refreshToken: 'user/refresh_token'
};

export interface AuthCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface Credentials {
  accessToken: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<any> {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  login(payload: AuthCredentials): Observable<any> {
    return this.sendPost(routes.login, payload, false);
  }

  logout(): Observable<any> {
    return this.sendPost(routes.logout, {}, false);
  }

  register(payload: AuthCredentials): Observable<any> {
    return this.sendPost(routes.register, payload, false);
  }

  refreshAccessToken(): Observable<any> {
    return this.sendPost(routes.register, {}, true);
  }
}
