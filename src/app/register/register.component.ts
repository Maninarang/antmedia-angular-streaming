import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  spinner: boolean = false;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public toast: ToastrService
  ) {

       ////////// if user is already login take to meeting page ////////////////////
   const currentUser = this.authService.currentUserValue;
   if (currentUser) {
     this.router.navigate(['/meeting-list']);
   }
   }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      password: ['',[Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

     // convenience getter for easy access to form fields
     get f() { return this.registerForm.controls; }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// submit function ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  
     submit() {
     
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }
            this.spinner = true;
            const formData = new FormData();
            formData.append('name', this.f.name.value);
            formData.append('password', this.f.password.value);
            formData.append('email', this.f.email.value);
            this.http.post(`${environment.apiUrl}register`, formData).subscribe(
              (response: any) => {
                this.spinner = false; 
                if (response.statusCode == 200) {
                  this.router.navigate(['/schedule-meeting']);
                  localStorage.setItem('authToken', response.data.authToken);
                  localStorage.setItem('userId', response.data.userId);
                  localStorage.setItem('userName', response.data.userName);
                } else {
                  this.toast.error(response.message,'Error');

                }
       },
       (error) => {
        this.spinner = false; 
     });
    }
}
