import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-host-meeting',
  templateUrl: './host-meeting.component.html',
  styleUrls: ['./host-meeting.component.scss']
})
export class HostMeetingComponent implements OnInit {

  meetingForm: FormGroup;
  users: Array<object>;
  dropdownSettings = {};
  submitted: boolean = false;
  spinner: boolean = false;
  socket;
  userName: string = 'Guest User';
  beta: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) { 
    this.socket = io(environment.mediaUrl);    ///////// initializing socket 

    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName');
    }

    //////////////////////////////////////////////////////////////
    /////// get list of other users on this platform ////////////
    ////////////////////////////////////////////////////////////
    this.http.get(`${environment.apiUrl}userList`).subscribe(
      (response: any) => {
        this.users = response.data;
      }
    )
  }

  ngOnInit() {
    this.meetingForm = this.formBuilder.group({
      topic: ['',[Validators.required, Validators.minLength(4)]],
      user: ['', [Validators.required]],
      beta: ['']
    });
    this.dropdownSettings = {   //////// multiselect dropdown settings
      singleSelection: false,
      idField: 'userId',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }


    // convenience getter for easy access to form fields
    get f() { return this.meetingForm.controls; }

  
   ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// submit function ////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

  submit() {  
 
      this.submitted = true;
      if (this.meetingForm.invalid) {
        return;
      }
  
      this.spinner = true;
    const formData = new FormData();
    formData.append('topic', this.f.topic.value);
    formData.append('users', JSON.stringify(this.f.user.value) as any);
      this.http.post(`${environment.apiUrl}addHostMeeting`, formData).subscribe(
        (response: any) => {
          this.spinner = false;
          for (let i = 0; i < this.f.user.value.length; i++) {

            this.socket.emit('hostMeeting',
              {
                hostId: localStorage.getItem('userId'),
                userId: this.f.user.value[i].userId,
                userName: this.userName,
                roomId: response.data.meetingId
              });
            if (this.f.beta.value == true) {
              this.router.navigate([`/meet-new/${response.data.meetingId}/${localStorage.getItem('userId')}/1`]);   //// 1 is for type hosted meeting
 
            } else {
              this.router.navigate([`/meet/${response.data.meetingId}/${localStorage.getItem('userId')}/1`]);   //// 1 is for type hosted meeting
            }
          }
        }, (error) => {
          this.spinner = false;
        }
      )
     }
}
