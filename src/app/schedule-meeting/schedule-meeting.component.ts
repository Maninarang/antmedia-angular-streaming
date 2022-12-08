import { Component, OnInit } from '@angular/core';
import {ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray,Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent implements OnInit {
  public min = new Date();
  meetingForm: FormGroup;
  submitted: boolean = false;
  spinner: boolean = false;
  hours;
  minutes;
  userEmail = [];
  emails = [];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toast: ToastrService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef


  ) { 
    this.min =  new Date(this.min.getTime() - 86400000);;

    this.hours = Array.from({ length: 24 }, (v, i) => i)   /////// add upto 23 hours in hours dropdown
    this.minutes =Array.from({ length: 60 }, (v, i) => i)   /////// add upto 59 minutes in minutes dropdown

  }

  ngOnInit() {
    this.meetingForm = this.formBuilder.group({
      topic: ['',[Validators.required, Validators.minLength(4)]],
      description: [''],
      date: ['',[Validators.required]],
      time: ['',[Validators.required]],
      hourDuration: ['',[Validators.required]],
      minuteDuration: ['',[Validators.required]],
     // emails: this.formBuilder.array([this.formBuilder.group({point:''})])
     emails: this.formBuilder.array([])
    });
    this.addEmail();
  }

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
    
     }


    // convenience getter for easy access to form fields
    get f() { return this.meetingForm.controls; }


  addEmail(){
    const fa = (this.meetingForm.get('emails')as FormArray);
    fa.push(this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]]
    }));
  }

  removeEmail(i: number) {
    const fa = (this.meetingForm.get('emails')as FormArray);
    fa.removeAt(i);
  }

  
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// submit function ////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

  submit() {
    
    const fa = (this.meetingForm.get('aliases') as FormArray);
    console.log(this.meetingForm.value.emails)
    let date = `${moment(this.f.date.value).format('YYYY-MM-DD')} ${moment(this.f.time.value).format('hh:mm a')}`;
    date = moment(date).unix() as any;

   
    this.submitted = true;
    if (this.meetingForm.invalid) {
      return;
    }
    this.spinner = true;
    const formData = new FormData();
    formData.append('topic', this.f.topic.value);
    formData.append('description', this.f.description.value);
    formData.append('dateTime', date);
    formData.append('hourDuration', this.f.hourDuration.value);
    formData.append('minuteDuration', this.f.minuteDuration.value);
    const email = this.meetingForm.value.emails;
    for (let i = 0; i < email.length; i++) {
      if (email[i].email != '') {
        this.userEmail.push(email[i].email);
      }
    }
    formData.append('email',JSON.stringify(this.userEmail) as any)
    this.http.post(`${environment.apiUrl}addMeeting`, formData).subscribe(
      (response: any) => {
        this.spinner = false; 
        if (response.statusCode == 200) {
          this.toast.success(response.message,'Success');
          this.router.navigate([`/meeting-list`]);

        } else {
         this.toast.error(response.message,'Error');

        }
},
(error) => {
this.spinner = false; 
this.toast.error(error.error.message,'Error');
});
  }
}
