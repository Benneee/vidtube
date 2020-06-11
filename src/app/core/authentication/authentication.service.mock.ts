import { Observable, of } from 'rxjs';

import { LoginContext } from './authentication.service';
import { Credentials } from './credentials.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    userId: 'test',
    username: 'test',
    accessToken: '123'
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      userId: context.userId,
      username: context.username,
      accessToken: '123456'
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }
}
