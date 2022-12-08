import { Component, OnInit,Output,EventEmitter,ChangeDetectorRef } from '@angular/core';
import { ChatService } from './chat.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../environments/environment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages = [];
  teacher: boolean = false
  roomId: string;
 // @Input() userList: any = [];
  userList: any = [];
  fileType: number = 1;
  extension: string = '';
  userId: string;

  @Output() newMessage: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private chatService: ChatService,
    private activedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,

  ) {

    this.userId = localStorage.getItem('userId');

    this.activedRoute.params.subscribe((params) => {
      this.roomId = params.roomId;
    });
   }

  ngOnInit() {

    this.chatService
    .getMessages()
      .subscribe((message: any) => {

        console.log('mesage',message)

        if (message.roomId == this.roomId) {
          let data = message.message;
          let thumb = message.thumb;

          if (message.type > 1) {
            data = `${environment.mediaUrl}${message.message}`;
            thumb = `${environment.mediaUrl}${message.thumb}`
          }
          this.newMessage.emit(1);    //////emitting that new message from user
          this.messages.push({userName: message.userName, message: data,thumb: thumb,type: message.type });
        }
      });

  }

  ngAfterContentChecked() {                       ///// to avoid expression changed error when changes tab 
    this.changeDetectorRef.detectChanges();
  }
  
  //////////////////////////////////////////////////////////////
  //////////////////// send attachment in chat ////////////////
  /////////////////////////////////////////////////////////////

  sendAttachment(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
        this.handleInputChange(file); //turn into base64
      }
    }

  
handleInputChange(files) {
  const file = files;
  const reader = new FileReader();
  if (file.type.match('image.*')) {
    this.fileType = 2;
  }
  else if (file.type.match('video.*')) {
    this.fileType = 3;
  }
  else if (file.type == 'application/pdf') {
    this.fileType = 4;
  }
  else if (file.type == 'application/msword') {
    this.fileType = 5;
  }
  else if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    this.fileType = 6;
  }
  else if (file.type.match('audio.*')) {
    this.fileType = 7;
  } else {
    alert('File Format Not Supported');
    return;
  }
  this.extension = file.name.split('.').pop();
  reader.onloadend = this.handleReaderLoaded.bind(this);
  reader.readAsDataURL(file);
}
  
handleReaderLoaded(e) {
  let reader = e.target;
  let base64result = reader.result;
  this.chatService.sendMessage(base64result, this.roomId, this.fileType, this.extension);
  this.fileType = 1;

  }  



  sendMessage() {
    if (this.message == '') {
      alert('You cannot send blank message');
      return;
    }
    this.chatService.sendMessage(this.message,this.roomId,this.fileType,this.extension);
    this.message = '';
  }
}
