import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetComponent } from './meet.component';

const routes: Routes = [{ path: ':id/:userId/:type', component: MeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetRoutingModule { }
