import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toast: ToastrService,
    ) { }
    ////// ================== if error in api then handle error ================= //////
    private handleError(err: HttpErrorResponse): Observable<HttpEvent<any>> {
        if (err.status === 401 || err.status === 403 || err.status === 500 || err.status === 400) {
            if (err.status === 500) {
                this.toast.error(err.error.error, 'Error');
                return;
            }
            if (err.status === 400) {
                this.toast.error(err.error.message, 'Error');
                return throwError(err);
            }


            this.authService.logout();
            this.router.navigate(['/']);
         //   this.toast.showToast(NbToastStatus.DANGER, 'Credentials', 'Invalid User!');

        }
        return throwError(err);
    }

    // private handleApiResponse(response) {

    //     if (response.body) {

           
    //         if (response.body.statusCode == 400 || response.body.statusCode == 208 ) {
    //             this.toast.error(response.body.message, 'Error');
    //         }
    //         else if (response.body.statusCode == 401) {
    //             this.toast.error(response.body.message, 'Error');
    //             this.authService.logout();
    //             this.router.navigate(['/']);
    //         }
    //     }
    // }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        
        const token = localStorage.getItem('authToken');

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    'Bearer ' + token),
            });
            return next.handle(cloned)
                .pipe(
                    map((res) => {
                      //  this.handleApiResponse(res)
                        return res;
                    }),
                    catchError(this.handleError.bind(this)),
                );
        } else {
            return next.handle(req);
        }
    }
}
