import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar: MatSnackBar) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).do(event => {
    }, err => {
      if (err instanceof HttpErrorResponse && err.status == 401) {
        this.router.navigate(['/login']);
      } else {
        this.snackBar.open('Unknown network error. ', 'OK', {
          duration: 1000,
        });
      }
    });
  }

}
