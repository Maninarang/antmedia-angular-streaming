import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeetingFooterComponent } from './meeting-footer.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
  ],
  declarations: [
    MeetingFooterComponent
  ],
  exports: [
    MeetingFooterComponent
  ],
  providers: []
})

export class MeetingFooterModule { }