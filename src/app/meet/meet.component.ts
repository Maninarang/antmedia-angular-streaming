import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { antMediaSetting } from './../helper/ant-media-setting';
import { environment } from './../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as RecordRTCPromisesHandler from 'recordrtc';


declare var WebRTCAdaptor: any;

var roomOfStream = new Array();

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit {
  publishStreamId: string;
  webRTCAdaptor;
  token: string;
  isDataChannelOpen: boolean = false;
  isMicMuted: boolean = false;
  isCameraOff: boolean = false;
  isScreenSharingOff: boolean = true;
  invitationForm: boolean = false;
  roomId: string;
  remoteVideo: boolean = false;
  showChat: boolean = false;
  remoteVideosCount: number = 0;
  msgCount: number = 0;
  videoPlayerClass: string = 'col-sm-4';
  remoteStream = [];
  userId: string;
  userName: string = 'Guest';
  type: number;
  inviteForm: FormGroup;
  submitted: boolean = false;
  spinner: boolean = false;
  socket;
  recorder: any;
  mixer: any;
  recordingStreams = [];
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('multipleVideo', { static: false }) multipleVideo: ElementRef;
  @ViewChild('doubleVideo', { static: false }) doubleVideo: ElementRef;
  constructor(
    private render: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private toast: ToastrService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {

    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName');
    }

    this.socket = io(environment.mediaUrl);    ////// initializing socket

    this.activedRoute.params.subscribe((params) => {
      this.roomId = params.id;
      this.userId = params.userId;
      this.type = params.type;
    });
  }

  ngOnInit() {

    this.inviteForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.socket.on('rejectedMeeting', (message) => {
      try {
        if (localStorage.getItem('userId') == message.hostId) {
          this.toast.error(`${message.userName} has rejected your Meeting Request`, 'Rejected');
        }
      } catch (e) {
        this.toast.error(e, 'Error')
      }

    })
    this.webRTCAdaptor = new WebRTCAdaptor(
      {
        websocket_url: environment.antMediaSocketUrl,
        mediaConstraints: antMediaSetting.mediaConstraints,
        peerconnection_config: null,
        sdp_constraints: antMediaSetting.sdpConstraints,
        localVideoId: "localVideo",
        isPlayMode: false,
        debug: true,
        callback: async (info, obj) => {

          if (info == "initialized") {
            if (localStorage.getItem('userId')) {
              this.webRTCAdaptor.joinRoom(this.roomId, `${this.roomId}-${localStorage.getItem('userId')}_${this.userName}`);
            } else {
              this.webRTCAdaptor.joinRoom(this.roomId, `${this.roomId}-${this.makeId(5)}_${this.userName}`);
            }
            this.video.nativeElement.muted = true;

          } else if (info == "joinedTheRoom") {
            const room = obj.ATTR_ROOM_NAME;
            roomOfStream[obj.streamId] = room;



            this.publish(obj.streamId, this.token);
            if (obj.streams != null) {
              obj.streams.forEach((item) => {
                console.log(item);
                this.webRTCAdaptor.play(item, this.token, this.roomId)
              });
            }
          } else if (info == "streamJoined") {
            this.webRTCAdaptor.play(obj.streamId, this.token, this.roomId);
          } else if (info == "newStreamAvailable") {
            console.log(this.remoteStream);
            if (this.remoteStream.indexOf(obj.streamId) == -1) {
              this.remoteStream.push(obj.streamId);
              this.remoteVideosCount++;
            }
            this.playVideo(obj)
          } else if (info == "streamLeaved") {
            this.remoteVideosCount--;
            const index = this.remoteStream.indexOf(obj.streamId);
             if(index!=-1){
             this.remoteStream.splice(index, 1);
             }
            console.log('count', this.remoteVideosCount);
            console.log(this.remoteStream)
            this.removeRemoteVideo(obj.streamId);
          } else if (info == "publish_started") {
            //stream is being published
            console.debug("publish started to room: " + roomOfStream[obj.streamId]);
          } else if (info == "publish_finished") {
            //stream is being finished
            console.debug("publish finished");

          } else if (info == "screen_share_stopped") {
            this.isScreenSharingOff = true;
            this.sendNotificationEvent('SCREEN_SHARE_OFF');
            const localVideo = document.querySelector('#localVideo');
            this.render.setStyle(localVideo, 'display', 'block');
          } else if (info == "leavedFromRoom") {
            const room = obj.ATTR_ROOM_NAME;
            console.debug("leaved from the room:" + room);
          } else if (info == "closed") {
            console.log("Connection closed");
            if (typeof obj != "undefined") {
              console.log("Connecton closed: " + JSON.stringify(obj));
            }
          } else if (info == "play_finished") {

          } else if (info == "streamInformation") {
            //	streamInformation(obj);
          } else if (info == "data_channel_opened") {
            console.log("Data Channel open for stream id", obj);
            this.isDataChannelOpen = true;
          } else if (info == "data_channel_closed") {
            console.log("Data Channel closed for stream id", obj);
            this.isDataChannelOpen = false;
          }
          else if (info == "data_received") {
            this.handleNotificationEvent(obj);
          }
        },
        callbackError:  (error, message) => {
          //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
          console.log("error callback: " + JSON.stringify(error));
          var errorMessage = JSON.stringify(error);
          if (error == "ScreenSharePermissionDenied") {
            this.isScreenSharingOff = true;
            const localVideo = document.querySelector('#localVideo');
            this.render.setStyle(localVideo, 'display', 'block');
          }
          if (typeof message != "undefined") {
            errorMessage = message;
          }
          var errorMessage = JSON.stringify(error);
          if (error.indexOf("NotFoundError") != -1) {
            errorMessage = "Camera or Mic are not found or not allowed in your device.";
          } else if (error.indexOf("NotReadableError") != -1
            || error.indexOf("TrackStartError") != -1) {
            errorMessage = "Camera or Mic is being used by some other process that does not not allow these devices to be read.";
          } else if (error.indexOf("OverconstrainedError") != -1
            || error.indexOf("ConstraintNotSatisfiedError") != -1) {
            errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints."
          } else if (error.indexOf("NotAllowedError") != -1
            || error.indexOf("PermissionDeniedError") != -1) {
            errorMessage = "You are not allowed to access camera and mic.";
          } else if (error.indexOf("TypeError") != -1) {
            errorMessage = "Video/Audio is required.";
          } else if (error.indexOf("UnsecureContext") != -1) {
            errorMessage = "Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https";
          } else if (error.indexOf("WebSocketNotSupported") != -1) {
            errorMessage = "Fatal Error: WebSocket not supported in this browser";
          } else if (error.indexOf("no_stream_exist") != -1) {
            //TODO: removeRemoteVideo(error.streamId);
          } else if (error.indexOf("data_channel_error") != -1) {
            errorMessage = "There was a error during data channel communication";
          }
          
          alert(errorMessage);
        }
      });
    
    
    if (this.userId == localStorage.getItem('userId')) {
       setTimeout(async () => {
         this.recordingStreams.push(this.webRTCAdaptor.localStream);
         this.recorder = new RecordRTCPromisesHandler(this.recordingStreams, {
          type: 'video'
      });
        this.recorder.startRecording();
      }, 10000);
       }
    }

  // convenience getter for easy access to form fields
  get f() { return this.inviteForm.controls; }

  //////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// publish user video//////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  publish(streamName, token) {
    this.publishStreamId = streamName;
    this.webRTCAdaptor.publish(streamName, token);
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// play other user video//////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  playVideo(obj) {


    this.changeDetectorRef.detectChanges();
    const element = document.querySelector(`#remoteVideo${obj.streamId}`);
    var player = this.render.createElement("div");
    if (this.remoteVideosCount == 1) {                  //// when 1 other user
      this.remoteVideo = false;
      this.render.addClass(player, 'uppervideo');
      this.render.addClass(player, 'col-sm-4');

    }
    if (this.remoteVideosCount > 1) {                 ///// more than  1 other user
      this.remoteVideo = true;
      const upperPlayer = document.querySelector('.uppervideo');
      if (upperPlayer) {
        this.render.removeClass(upperPlayer, 'uppervideo');
        this.render.removeClass(upperPlayer, 'col-sm-4');
        this.render.addClass(upperPlayer, 'col-sm-6');

      }
      if (this.remoteVideosCount > 1 && this.remoteVideosCount < 4) {   //// when upto 3 other users
        this.render.addClass(player, 'col-sm-6');
        this.videoPlayerClass = 'col-sm-6';
        const remoteElement = document.querySelectorAll('.col-sm-6');
        [].forEach.call(remoteElement, (e) => {
          this.render.setStyle(e, 'height', '50vh');
          this.render.setStyle(e, 'padding', '0');
        });
        const remoteVideo = document.querySelectorAll('video');
        [].forEach.call(remoteVideo, (e) => {
          this.render.setStyle(e, 'height', '50vh');
          this.render.setStyle(e, 'object-fit', 'cover');
        });
      }
      if (this.remoteVideosCount >= 4 && this.remoteVideosCount < 6) {   ///// when other users between 3 to 5
        this.render.addClass(player, 'col-sm-4');
        this.videoPlayerClass = 'col-sm-4';
        this.render.setStyle(player, 'height', '50vh');
        this.render.setStyle(player, 'padding', '0');
        const remoteElement = document.querySelectorAll('.col-sm-6');
        [].forEach.call(remoteElement, (e) => {
          this.render.removeClass(e, 'col-sm-6');
          this.render.addClass(e, 'col-sm-4');
        });
        const remoteVideo = document.querySelectorAll('video');
        [].forEach.call(remoteVideo, (e) => {
          this.render.setStyle(e, 'height', '50vh');
          this.render.setStyle(e, 'object-fit', 'cover');
        });

      }
      if (this.remoteVideosCount >= 6 && this.remoteVideosCount < 9) {   ////// when other users between 5 and 9
        this.render.addClass(player, 'col-sm-4');
        this.render.setStyle(player, 'height', '33.33vh');
        this.render.setStyle(player, 'padding', '0');
        const remoteElement = document.querySelectorAll('.col-sm-4');
        [].forEach.call(remoteElement, (e) => {
          this.render.setStyle(e, 'height', '33.33vh');
          this.render.setStyle(e, 'padding', '0');
        });
        const remoteVideo = document.querySelectorAll('video');
        [].forEach.call(remoteVideo, (e) => {
          this.render.setStyle(e, 'height', '33.33vh');
          this.render.setStyle(e, 'object-fit', 'cover');
        });

      }

      if (this.remoteVideosCount >= 9) {                              //////// when more than 8 other users and less than 12
        this.render.addClass(player, 'col-sm-3');
        this.render.setStyle(player, 'height', '33.33vh');
        this.render.setStyle(player, 'padding', '0');
        const remoteElement = document.querySelectorAll('.col-sm-4');
        [].forEach.call(remoteElement, (e) => {
          this.render.setStyle(e, 'height', '33.33vh');
          this.render.setStyle(e, 'padding', '0');
          this.render.removeClass(e, 'col-sm-4');
          this.render.addClass(e, 'col-sm-3');
        });
        const remoteVideo = document.querySelectorAll('video');
        [].forEach.call(remoteVideo, (e) => {
          this.render.setStyle(e, 'height', '33.33vh');
          this.render.setStyle(e, 'object-fit', 'cover');
        });

      }
    }
    player.id = "player" + obj.streamId;
    player.innerHTML = '<video id="remoteVideo' + obj.streamId + '"controls autoplay></video>';
    const userName = obj.streamId.split('_')[1];
    let name = this.render.createElement("div");
    name.innerHTML = `<span class="set-username">${userName}</span>`;
    this.render.insertBefore(player, name, player.firstChild);
    if (element == null) {
      this.render.appendChild(this.multipleVideo.nativeElement, player);
      const appendedElement = document.querySelector(`#remoteVideo${obj.streamId}`);
      this.setPlayerProperties(appendedElement, obj.stream, true);
    }


  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// remove other user //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  removeRemoteVideo(streamId) {

    const element = document.querySelector(`#player${streamId}`);
    if (element) {
      this.render.removeChild(this.multipleVideo.nativeElement, element);
      setTimeout(() => {
        
      if (this.remoteVideosCount == 0) {                                //////// when no other user left
        const remoteElement = document.querySelectorAll('.col-sm-6');
        [].forEach.call(remoteElement, (e) => {
          this.render.removeClass(e, 'col-sm-6');
          this.render.removeStyle(e, 'height');
          this.render.removeStyle(e, 'padding');
        });
        const localVideo = document.querySelector('video');
        if (localVideo) {
          this.render.removeStyle(localVideo, 'height');
          this.render.removeStyle(localVideo, 'object-fit');
        }
        if (this.showChat) {
          this.render.setStyle(localVideo, 'height', '100vh')
        }
      }
      if (this.remoteVideosCount == 1) {                           //////// when 1 other user left
        this.remoteVideo = false;
        console.log('1user')
        const secondDiv = document.querySelectorAll('.col-sm-6')[1];
        console.log('secondDiv')
        if (secondDiv) {
          console.log('gethere in second div')
          this.render.addClass(secondDiv, 'col-sm-4');
          this.render.addClass(secondDiv, 'uppervideo');

        }
        const remoteElement = document.querySelectorAll('.col-sm-6');
        [].forEach.call(remoteElement, (e) => {
          this.render.removeClass(e, 'col-sm-6');
          this.render.removeStyle(e, 'height');
          this.render.removeStyle(e, 'padding');
        });
        const remoteVideo = document.querySelectorAll('video');
        [].forEach.call(remoteVideo, (e) => {
          this.render.removeStyle(e, 'height');
          this.render.removeStyle(e, 'object-fill');
        });
        if (this.showChat) {
          const localVideo = document.querySelector('video');
          this.render.setStyle(localVideo, 'height', '100vh')
        }
      }
      if (this.remoteVideosCount > 1) {               //////// more than 1 other user
        this.remoteVideo = true;
        const upperPlayer = document.querySelector('.uppervideo');
        if (upperPlayer) {
          this.render.removeClass(upperPlayer, 'uppervideo');
          this.render.removeClass(upperPlayer, 'col-sm-4');
          this.render.addClass(upperPlayer, 'col-sm-6');

        }
        if (this.remoteVideosCount > 1 && this.remoteVideosCount < 4) {    //////////// when upto 3 other users
          this.videoPlayerClass = 'col-sm-6';
          const remoteElement = document.querySelectorAll('.col-sm-4');
          [].forEach.call(remoteElement, (e) => {
            this.render.removeClass(e, 'col-sm-4');
            this.render.addClass(e, 'col-sm-6');
            this.render.setStyle(e, 'height', '50vh');
            this.render.setStyle(e, 'padding', '0');
          });
          const remoteVideo = document.querySelectorAll('video');
          [].forEach.call(remoteVideo, (e) => {
            this.render.setStyle(e, 'height', '50vh');
            this.render.setStyle(e, 'object-fit', 'cover');
          });
        }
        if (this.remoteVideosCount >= 4 && this.remoteVideosCount < 6) {  ///// when other users between 3 to 5
          this.videoPlayerClass = 'col-sm-4';
          const remoteVideo = document.querySelectorAll('video');
          [].forEach.call(remoteVideo, (e) => {
            this.render.setStyle(e, 'height', '50vh');
            this.render.setStyle(e, 'object-fit', 'cover');
          });

        }
        if (this.remoteVideosCount >= 6 && this.remoteVideosCount < 9) {   ////// when other users between 5 and 9
          const remoteElement = document.querySelectorAll('.col-sm-4');
          [].forEach.call(remoteElement, (e) => {
            this.render.setStyle(e, 'height', '33.33vh');
            this.render.setStyle(e, 'padding', '0');
          });
          const remoteVideo = document.querySelectorAll('video');
          [].forEach.call(remoteVideo, (e) => {
            this.render.setStyle(e, 'height', '33.33vh');
            this.render.setStyle(e, 'object-fit', 'cover');
          });

        }

        if (this.remoteVideosCount >= 9) {                            //////// when more than 8 other users and less than 12
          const remoteElement = document.querySelectorAll('.col-sm-3');
          [].forEach.call(remoteElement, (e) => {
            this.render.setStyle(e, 'height', '33.33vh');
            this.render.setStyle(e, 'padding', '0');
            // this.render.removeClass(e, 'col-sm-3');
            // this.render.addClass(e, 'col-sm-4');
          });
          const remoteVideo = document.querySelectorAll('video');
          [].forEach.call(remoteVideo, (e) => {
            this.render.setStyle(e, 'height', '33.33vh');
            this.render.setStyle(e, 'object-fit', 'cover');
          });

        }
      }
    }, 2000);
      }
  }


  //////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// share screen by user ////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  shareScreen() {
    this.webRTCAdaptor.switchDesktopCapture(this.publishStreamId);
    this.isScreenSharingOff = false;
    this.sendNotificationEvent("SCREEN_SHARE_ON");
    const localVideo = document.querySelector('#localVideo');
    this.render.setStyle(localVideo, 'display', 'none');

  }




  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// setting properties of video player ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  setPlayerProperties(player, stream, controls) {
  
    this.render.setProperty(player, 'srcObject', stream);
    this.render.setAttribute(player, 'width', '100%');
    this.render.setProperty(player, 'controls', controls);
    if (this.userId == localStorage.getItem('userId')) {
      this.recordingStreams.push(stream);
      this.mixer = this.recorder.getInternalRecorder().getMixer();
      this.mixer.appendStreams(stream);    ///// adding stream for recording
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// mute/unmute local mic  ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////


  handleAudio() {
    if (this.isMicMuted) {
      this.isMicMuted = false;
      this.webRTCAdaptor.unmuteLocalMic();
      this.sendNotificationEvent("MIC_UNMUTED");
    } else {
      this.isMicMuted = true;
      this.webRTCAdaptor.muteLocalMic();
      this.sendNotificationEvent("MIC_MUTED");
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// on/off local camera  ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////


  handleCamera() {
    if (this.isCameraOff) {
      this.isCameraOff = false;
      this.webRTCAdaptor.turnOnLocalCamera();
    } else {
      this.isCameraOff = true;
      this.webRTCAdaptor.turnOffLocalCamera();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// send notification to other users  ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  sendNotificationEvent(eventType) {
    const notEvent = { streamId: this.publishStreamId, eventType: eventType };
    this.webRTCAdaptor.sendData(this.publishStreamId, JSON.stringify(notEvent));
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// receive notification from other users  ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  handleNotificationEvent(obj) {
    console.log("Received data : ", obj.event.data);
    var notificationEvent = JSON.parse(obj.event.data);
    if (notificationEvent != null && typeof (notificationEvent) == "object") {
      var eventStreamId = notificationEvent.streamId;
      var eventTyp = notificationEvent.eventType;

      if (eventTyp == "CAM_TURNED_OFF") {
        console.log("Camera turned off for : ", eventStreamId);
      } else if (eventTyp == "CAM_TURNED_ON") {
        console.log("Camera turned on for : ", eventStreamId);
      } else if (eventTyp == "MIC_MUTED") {
        console.log("Microphone muted for : ", eventStreamId);
        const element = document.querySelector(`#player${eventStreamId}`);
        if (element) {
          let image = this.render.createElement("div");
          image.id = `mic${eventStreamId}`;
          image.innerHTML = '<img src="/assets/images/mute.png" class="set-mic">'
          this.render.insertBefore(element, image, element.lastChild);
        }
      } else if (eventTyp == "MIC_UNMUTED") {
        console.log("Microphone unmuted for : ", eventStreamId);
        const element = document.querySelector(`#player${eventStreamId}`);
        if (element) {
          const mic = document.querySelector(`#mic${eventStreamId}`);
          this.render.removeChild(element, mic);
        }
      } else if (eventTyp == "SCREEN_SHARE_ON") {
        this.isScreenSharingOff = false;
      } else if (eventTyp == "SCREEN_SHARE_OFF") {
        this.isScreenSharingOff = true;
      }
    }
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// toggle chat section  //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////


  toggleChat() {
    this.showChat = !this.showChat;
    this.msgCount = 0;
    if (this.remoteVideosCount == 1 || this.remoteVideosCount == 0) {
      const element = document.querySelector('#localVideo');
      if (element) {
        this.render.setStyle(element, 'height', '100vh');
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// end call by user  //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////


  leaveRoom() {
    // const tracks = this.webRTCAdaptor.localStream.getTracks();
    // for (let i = 0; i < tracks.length; i++) {
    //   tracks[i].stop()
    // }

    this.webRTCAdaptor.closeStream();
  

    if (this.userId == localStorage.getItem('userId')) {

      this.recorder.stopRecording(() => {
      let blob = this.recorder.getBlob();
    // RecordRTCPromisesHandler.invokeSaveAsDialog(blob);
          var file = new File([blob], '', {
        type: 'video/webm'
      });
      const formData = new FormData();
      formData.append('id', this.roomId);
      formData.append('type', this.type as any);  
      formData.append('file', file,`${this.roomId}.webm`);
        this.http.post(`${environment.apiUrl}saveRecording`, formData).subscribe(
          (response: any) => {
  
          },
          (error) => {
          });
    });
      let baseUrl;
      if (this.type == 1) {
        baseUrl = 'changeHostedMeetingStatus';
      } else {
        baseUrl = 'changeStatus';
      }
      this.http.patch(`${environment.apiUrl}${baseUrl}/${this.roomId}`, { status: 0 }).subscribe(
        (response: any) => {
          this.router.navigate(['/meeting-list']);
        }
      )
    } else {
      this.router.navigate(['/meeting-list']);

    }
    this.webRTCAdaptor.leaveFromRoom(this.roomId);

  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// show message count ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  messageCount() {
    if (!this.showChat) {
      this.msgCount = this.msgCount + 1;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// add participant function ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  submit() {
    this.submitted = true;
    if (this.inviteForm.invalid) {
      return;
    }
    this.spinner = true;
    const formData = new FormData();
    formData.append('email', this.f.email.value);
    formData.append('userId', this.userId);
    formData.append('meetingId', this.roomId);
    formData.append('type', this.type as any);
    this.http.post(`${environment.apiUrl}addParticipant`, formData).subscribe(
      (response: any) => {
        this.spinner = false;
        this.f['email'].setValue('');
        this.submitted = false;
        this.invitationForm = false;
        this.toast.success(response.message, 'Success');

      }, (error) => {
        this.spinner = false;
      }
    )
  }

  ////////////////// generate random stream id


  makeId(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }




}
