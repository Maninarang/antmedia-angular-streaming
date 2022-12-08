import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {
  meetingList;
  hostedMeetingList: Array<object>;
  userId: string;
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private router: Router,

  ) { 
    this.userId = localStorage.getItem('userId');
    this.http.get(`${environment.apiUrl}meetingList`).subscribe(
      (response: any) => {
        this.meetingList = response.data;
          }
    )
    this.http.get(`${environment.apiUrl}hostedMeetingList`).subscribe(
      (response: any) => {
        this.hostedMeetingList = response.data;
          }
    )
  }

  ngOnInit() {
  }


  ///////////////////////////////////////////////////////
  ////////////////// start Meeting /////////////////////
  /////////////////////////////////////////////////////


  startMeeting(meetingId:string,time:number) {
    const now = moment().unix();
    if (now < time) {
      this.toast.error('You cannot start meeting now','Error');
    } else {
      this.http.patch(`${environment.apiUrl}changeStatus/${meetingId}`, {
       status: 1
      }).subscribe(
        (response: any) => {
          this.router.navigate([`/meet/${meetingId}/${this.userId}/0`]);
       }
     ) 
    }
  }


   ///////////////////////////////////////////////////////
  ////////////////// join Meeting /////////////////////
  /////////////////////////////////////////////////////


  joinMeeting(meetingId:string,time:number) {
    const now = moment().unix();
    if (now < time) {
      this.toast.error('You cannot join meeting now','Error');
    } else {
      this.http.get(`${environment.apiUrl}meetingStatus/${meetingId}`).subscribe(
        (response: any) => {
          if (response.data.status == 0) {
            this.toast.error('The Broadcaster has not started the meeting yet','Error');
 
          } else {
            this.router.navigate([`/meet/${meetingId}/${this.userId}/0`]);
          }
       }
     ) 
    }
  }

}
