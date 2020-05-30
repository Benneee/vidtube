import { untilDestroyed, Logger } from '@app/core';
import { VideoService, Video } from './video.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  videos: any[] = [];

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.getAllVideos();
  }

  ngOnDestroy() {}

  getAllVideos() {
    this.isLoading = true;
    const videos$ = this.videoService.getAllVideos();
    videos$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.videos = res;
            this.videos = this.videos.map((video: Video) => {
              return {
                title: video.title,
                url: video.url,
                description: video.description,
                date: video.date,
                comments: video.comments,
                upvotes: video.upvotes,
                downvotes: video.downvotes
              };
            });
            log.debug('res: ', this.videos);
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }
}
