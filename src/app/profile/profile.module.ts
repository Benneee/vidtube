import { TranslateModule } from '@ngx-translate/core';
import { ShellModule } from './../shell/shell.module';
import { SharedModule } from './../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '@app/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CoreModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    ShellModule,
    TranslateModule
  ]
})
export class ProfileModule {}
