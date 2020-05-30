import { finalize } from 'rxjs/operators';
import { Logger } from './../../core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CredentialsService, untilDestroyed } from '@app/core';
import {
  AuthService,
  AuthCredentials,
  Credentials
} from '@app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

const log = new Logger('Register');
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  regForm: FormGroup;
  isLoading = false;
  fieldTextType: boolean;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private credsService: CredentialsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {}

  get controls() {
    return this.regForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  submit() {
    log.debug('values: ', this.regForm.value);
    const { username, password } = this.regForm.value;
    this.register({ username, password });
  }

  register(payload: AuthCredentials) {
    this.isLoading = true;
    const { username } = this.regForm.value;
    const register$ = this.authService.register(payload);
    register$
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
          const name = errorObj['name'].message;
          this.toastr.error(name, 'Register');
        }
      );
  }

  private createForm() {
    this.regForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
