import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeetingSidebarComponent } from './meeting-sidebar.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
  ],
  declarations: [
    MeetingSidebarComponent
  ],
  exports: [
    MeetingSidebarComponent
  ],
  providers: []
})

export class MeetingSidebarModule { }