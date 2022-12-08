import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
  ],
  declarations: [
    ChatComponent
  ],
  exports: [
    ChatComponent
  ],
  providers: [ChatService],
})

export class ChatModule { }