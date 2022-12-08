import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatModule } from './../components/chat/chat.module';
import { MeetNewRoutingModule } from './meet-new-routing.module';
import { MeetNewComponent } from './meet-new.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MeetNewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChatModule,
    ReactiveFormsModule,
    MeetNewRoutingModule
  ]
})
export class MeetNewModule { }
