import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CredentialsService, I18nService, Logger } from '@app/core';
import { AuthService } from '@app/auth/auth.service';

const log = new Logger('Logout');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  isLoading = false;

  constructor(
    private router: Router,
    private credentialsService: CredentialsService,
    private i18nService: I18nService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.isLoading = true;
    this.authService
      .logout()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res) {
            log.debug('res: ', res);
            this.toastr.success(res.message);
            this.credentialsService.unsetCredentials();
            this.router.navigate(['/login']);
          }
        },
        (error: any) => {
          log.debug('error: ', error);
          const errorObj = JSON.parse(error);
          const name = errorObj.name;
          this.toastr.error(name, 'Logout');
        }
      );
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }
}
