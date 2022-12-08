import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatModule } from './../components/chat/chat.module';
import { MeetRoutingModule } from './meet-routing.module';
import { MeetComponent } from './meet.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MeetComponent],
  imports: [
    CommonModule,
    ChatModule,
    MeetRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MeetModule { }
