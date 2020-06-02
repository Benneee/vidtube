import { finalize } from 'rxjs/operators';
import { VideoService, Video } from './../../home/video.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CredentialsService, Logger, untilDestroyed } from '@app/core';

const log = new Logger('Video');

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  videoID: string;
  isLoading = false;
  video: Video;
  allVideos: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    credService: CredentialsService,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this.getVideoId();
    this.getAllVideos();
  }

  ngOnDestroy() {}

  getVideoId() {
    this.route.params.subscribe((param: Params) => {
      if (!param['id']) {
        this.router.navigateByUrl('/home');
        return;
      } else {
        this.videoID = param['id'];
        this.getVideoDetails(this.videoID);
      }
    });
  }

  getVideoDetails(id: string) {
    this.isLoading = true;
    const video$ = this.videoService.getVideoById(id);
    video$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res) {
            log.debug('res: ', res);
            this.video = res;
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }

  getAllVideos() {
    this.isLoading = true;
    const allVideos$ = this.videoService.getAllVideos();
    allVideos$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.allVideos = res;
            this.allVideos = this.allVideos.filter(
              (video: Video) => video._id !== this.videoID
            );
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }

  goToVideo(id: string) {
    this.router.navigateByUrl('/home').then(() => {
      this.router.navigate(['/', 'video', id]);
    });
  }
}
