import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    TranslateModule,
    NgbModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {}
