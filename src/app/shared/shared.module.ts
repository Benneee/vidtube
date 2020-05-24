import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [CommonModule, ToastrModule.forRoot()],
  declarations: [LoaderComponent],
  exports: [LoaderComponent, ToastrModule]
})
export class SharedModule {}
