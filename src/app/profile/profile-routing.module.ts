import { extract } from '@app/core';
import { ProfileComponent } from './profile/profile.component';
import { Shell } from '@app/shell/shell.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/profile', pathMatch: 'full' },
    {
      path: 'profile',
      component: ProfileComponent,
      data: { title: extract('Profile') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
