import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import * as io from 'socket.io-client';
import { environment } from './../../../environments/environment';
import { Howl } from 'howler';
import {Router} from '@angular/router';

@Component({
  selector: 'meeting-header',
  templateUrl: './meeting-header.component.html',
  styleUrls: ['./meeting-header.component.scss']
})
export class MeetingHeaderComponent implements OnInit {
  socket;
  callerMessage: string;
  callAudio: any = null;
  roomId: string;
  userName: string = 'Guest User';
  hostId: string;
  constructor(
    private modalService: ModalService,
    private router: Router
  ) {
    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName');
    }
    this.socket = io(environment.mediaUrl);
   }

  
  ngOnInit() {
    this.socket.on('hostMeeting', (message) => {
      this.callerMessage = `${message.userName} has hosted a meeting with you`;
      if (localStorage.getItem('userId')) {
        if (localStorage.getItem('userId') == message.userId) {
          this.openModal('call-modal');    //////// open calling popup      
          this.callAudio.play();
          this.roomId = message.roomId;
          this.hostId = message.hostId;
        }
      }
    });
    this.callAudio = new Howl({
      src: '../../../assets/audio/call.mp3'
    });
  }

   ///////////////////////////////////////////////////////////////   
 ////////////////////////// open popup  ///////////////////////
 /////////////////////////////////////////////////////////////

 openModal(id: string) {
  this.modalService.open(id);
 }
  
   ///////////////////////////////////////////////////////////////   
 ////////////////////////// close popup  ///////////////////////
 /////////////////////////////////////////////////////////////

 closeModal(id: string) {
  this.modalService.close(id);
 }
  
   ////////////////////////////////////////////////////////////////////////////////////////////////   
 ////////////////////////// user accepts hosted meeting from other user ///////////////////////
 //////////////////////////////////////////////////////////////////////////////////////////////
  
 accept() {
  this.modalService.close('call-modal');
  this.callAudio.stop();
    this.router.navigateByUrl(`/meet/${this.roomId}/${this.hostId}/1`);
 }
  
   ////////////////////////////////////////////////////////////////////////////////////////////////   
 ////////////////////////// user rejects hosted meeting from other use ///////////////////////
 ////////////////////////////////////////////////////////////////////////////////////////////// 

 reject() {
  this.callAudio.stop();
   this.modalService.close('call-modal');
   this.socket.emit('rejectedMeeting',
   {
     userName: this.userName,
     hostId: this.hostId
   });
}

}