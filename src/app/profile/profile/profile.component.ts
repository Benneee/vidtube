import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Logger } from './../../core/logger.service';
import { finalize } from 'rxjs/operators';
import { ProfileService } from './../profile.service';
import { VideoService } from './../../home/video.service';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterContentChecked
} from '@angular/core';
import { untilDestroyed, CredentialsService } from '@app/core';
import { Credentials } from '@app/auth/auth.service';
import { fadeInTrigger } from '@app/animations';

const log = new Logger('Profile');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [fadeInTrigger]
})
export class ProfileComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  isLoading = false;
  userVideos: any[] = [];
  profileInfo: any = null;
  loggedIn = false;
  userId: string;
  imgUrl = 'https://api.adorable.io/avatars/';
  newImgUrl: any = null;
  videosCount: number;
  uploadVideoForm: FormGroup;

  constructor(
    private videoService: VideoService,
    private router: Router,
    private profileService: ProfileService,
    credService: CredentialsService,
    private fb: FormBuilder
  ) {
    this.loggedIn = credService.isAuthenticated();
  }

  ngOnInit() {
    this.getUserId();
    this.initVideoUploadForm();
  }

  initVideoUploadForm() {
    this.uploadVideoForm = this.fb.group({
      video: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngAfterContentChecked(): void {
    this.generateAvatar();
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

  generateAvatar() {
    const vary = Math.floor(Math.random() * (250 - 100)) + 100;
    this.newImgUrl = `${this.imgUrl}${vary}`;
    return this.newImgUrl;
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
            this.videosCount = this.userVideos.length;
            // log.debug("user's videos: ", this.userVideos);
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }

  goToVideo(id: string) {
    this.router.navigate(['/', 'video', id]);
  }
}
