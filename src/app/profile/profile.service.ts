import { Observable } from 'rxjs';
import { BaseService } from './../core/base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const routes = {
  profileInfo: 'user'
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<any> {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getProfileInformation(id: string): Observable<any> {
    return this.sendGet(`${routes.profileInfo}/${id}`, true);
  }
}
