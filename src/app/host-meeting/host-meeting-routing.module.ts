import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HostMeetingComponent } from './host-meeting.component';

const routes: Routes = [{ path: '', component: HostMeetingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostMeetingRoutingModule { }
