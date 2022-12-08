import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  spinner: boolean = false;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private router: Router,


  ) { 

    ////////// if user is already login take to meeting page ////////////////////
   const currentUser = this.authService.currentUserValue;
   if (currentUser) {
     this.router.navigate(['/meeting-list']);
   }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      password: ['',[Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
    });
   }

   // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////// submit function ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  submit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner = true;
    this.authService.login(this.f.email.value, this.f.password.value).subscribe(
      (response: any) => {
        this.spinner = false;

        if (response.statusCode == 200) {
          localStorage.setItem('authToken', response.data.authToken);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userName', response.data.userName);
          this.router.navigate(['/meeting-list']);
        }else {
          this.toast.error(response.message,'Error');
        }

      },
      (error) => {
       this.spinner = false; 
    });
  }
}
