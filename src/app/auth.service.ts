import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  ////// ================================  Login service ======================================== //////
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}login`, { email: email, password: password });
  }

   
  ////// ================================  Logout service ======================================== //////
  logout() {
    //localStorage.removeItem('authToken');
    localStorage.clear();
    this.router.navigateByUrl('/');
  }

  public get currentUserValue() {
		return localStorage.getItem('authToken');
	}
}
