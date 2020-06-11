import { ShellModule } from './../shell/shell.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../shared/shared.module';
import { CoreModule } from '@app/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoDetailRoutingModule } from './video-detail-routing.module';
import { VideoDetailComponent } from './video-detail/video-detail.component';

@NgModule({
  declarations: [VideoDetailComponent],
  imports: [
    CommonModule,
    VideoDetailRoutingModule,
    CoreModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    ShellModule
  ]
})
export class VideoDetailModule {}
