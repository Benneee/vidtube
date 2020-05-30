import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { LoaderComponent } from './loader/loader.component';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    NgProgressModule,
    NgProgressHttpModule
  ],
  declarations: [LoaderComponent],
  exports: [
    LoaderComponent,
    ToastrModule,
    NgProgressModule,
    NgProgressHttpModule
  ]
})
export class SharedModule {}
