import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetNewComponent } from './meet-new.component';

const routes: Routes = [{ path: ':id/:userId/:type', component: MeetNewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetNewRoutingModule { }
