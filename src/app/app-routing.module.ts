import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'meet',
    loadChildren: () => import('./meet/meet.module').then(m => m.MeetModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  // },
  {
    path: 'schedule-meeting',
    canActivate: [AuthGuard],
    loadChildren: () => import('./schedule-meeting/schedule-meeting.module').then(m => m.ScheduleMeetingModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'meeting-list',
    canActivate: [AuthGuard],
    loadChildren: () => import('./meeting-list/meeting-list.module').then(m => m.MeetingListModule)
  },
  {
    path: 'host-meeting',
    canActivate: [AuthGuard],
    loadChildren: () => import('./host-meeting/host-meeting.module').then(m => m.HostMeetingModule)
  },
  { path: 'recordings', loadChildren: () => import('./recordings/recordings.module').then(m => m.RecordingsModule) },
  { path: 'meet-new', loadChildren: () => import('./meet-new/meet-new.module').then(m => m.MeetNewModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
