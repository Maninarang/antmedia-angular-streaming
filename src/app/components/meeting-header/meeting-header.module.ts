import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeetingHeaderComponent } from './meeting-header.component';
import { ModalModule } from '../modal/modal.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ModalModule
  ],
  declarations: [
    MeetingHeaderComponent
  ],
  exports: [
    MeetingHeaderComponent
  ],
  providers: []
})

export class MeetingHeaderModule { }