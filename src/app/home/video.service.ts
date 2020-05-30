import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

const routes = {
  videos: 'videos'
};

export interface Video {
  title: string;
  url: string;
  description: string;
  date?: Date;
  comments: string[];
  upvotes: number;
  downvotes: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService extends BaseService<any> {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllVideos(): Observable<any> {
    return this.sendGet(routes.videos);
  }
}
