import {
  AuthService,
  AuthCredentials,
  Credentials
} from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';
import {
  Logger,
  I18nService,
  untilDestroyed,
  CredentialsService
} from '@app/core';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private credsService: CredentialsService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {}

  submit() {
    log.debug('values: ', this.loginForm.value);
    const { username, password } = this.loginForm.value;
    this.login({ username, password });
  }

  login(payload: AuthCredentials) {
    const { username } = this.loginForm.value;
    this.isLoading = true;
    const login$ = this.authService.login(payload);
    login$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: Credentials) => {
          if (res) {
            const data = {
              username,
              accessToken: res.accessToken,
              userId: res.userId
            };
            this.credsService.setCredentials(data);
            this.toastr.success('Welcome to Vidtube', `Hey ${username}`);
            this.router.navigate(
              [this.route.snapshot.queryParams.redirect || '/'],
              { replaceUrl: true }
            );
          }
        },
        (error: any) => {
          log.debug('error: ', error);
          const errorObj = JSON.parse(error);
          const name = errorObj['name'];
          this.toastr.error(name, 'Login');
        }
      );
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
