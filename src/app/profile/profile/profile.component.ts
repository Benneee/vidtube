import { Router } from '@angular/router';
import { Logger } from './../../core/logger.service';
import { finalize } from 'rxjs/operators';
import { ProfileService } from './../profile.service';
import { VideoService } from './../../home/video.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed, CredentialsService } from '@app/core';
import { Credentials } from '@app/auth/auth.service';

const log = new Logger('Profile');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading = false;
  userVideos: any[] = [];
  profileInfo: any;
  loggedIn = false;
  userId: string;

  constructor(
    private videoService: VideoService,
    private router: Router,
    private profileService: ProfileService,
    credService: CredentialsService
  ) {
    this.loggedIn = credService.isAuthenticated();
  }

  ngOnInit() {
    this.getUserId();
  }

  ngOnDestroy() {}

  getUserId() {
    if (this.loggedIn === true) {
      const credentials: Credentials = JSON.parse(
        sessionStorage.getItem('credentials')
      );
      const { userId } = credentials;
      this.userId = userId;
      if (userId !== null) {
        this.getProfileInfo(userId);
        this.getUserVideos();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  getProfileInfo(id: string) {
    this.isLoading = true;
    const profileInfo$ = this.profileService.getProfileInformation(id);
    profileInfo$
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
            this.profileInfo = res;
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }

  getUserVideos() {
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
            this.userVideos = res;
            this.userVideos = this.userVideos.filter(
              (video: any) => video.userId === this.userId
            );
            log.debug('videos: ', this.userVideos);
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }
}
