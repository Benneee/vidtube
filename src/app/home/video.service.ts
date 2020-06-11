import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

const routes = {
  videos: 'videos'
};

export interface Video {
  _id?: string;
  title: string;
  url: string;
  description: string;
  date?: Date;
  comments: any[];
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
    return this.sendGet(routes.videos, false);
  }

  getVideoById(id: string): Observable<any> {
    return this.sendGet(`${routes.videos}/${id}`, false);
  }

  postComment(id: string, payload: any): Observable<any> {
    return this.sendPost(`${routes.videos}/${id}/comment`, payload, true, true);
  }

  upvoteVideo(id: string): Observable<any> {
    return this.sendPost(`${routes.videos}/${id}/upvote`, {}, false);
  }

  downvoteVideo(id: string): Observable<any> {
    return this.sendPost(`${routes.videos}/${id}/downvote`, {}, false);
  }
}
