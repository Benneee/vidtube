import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { untilDestroyed, Logger, CredentialsService } from '@app/core';
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
  isAuthenticated: boolean;

  constructor(
    private videoService: VideoService,
    credService: CredentialsService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.isAuthenticated = credService.isAuthenticated();
  }

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
                id: video._id,
                title: video.title,
                url: video.url,
                description: video.description,
                date: video.date,
                comments: video.comments,
                upvotes: video.upvotes,
                downvotes: video.downvotes
              };
            });
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }

  goToVideo(id: string) {
    if (!this.isAuthenticated) {
      this.toastr.info(
        'Kindly log in to your account to watch a video',
        'Vidtube',
        {
          closeButton: true,
          timeOut: 5000
        }
      );
      this.router.navigateByUrl('/login');
    } else {
      log.debug('id: ', id);
    }
  }
}
