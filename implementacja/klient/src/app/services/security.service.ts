import {Injectable} from '@angular/core';
import {User} from '../domain/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Injectable()
export class SecurityService {

  profile: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {
  }

  authenticate(username: string, password: string) {
    const formData: FormData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    return this.http.post(
      'http://localhost:9090/login/authenticate', formData,
      {
        headers: new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest'
          }
        ),
        withCredentials: true
      }
    );
  }


  logout() {
    let request = this.http.post('http://localhost:9090/logoff', null,
      {
        headers: new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest'
          }
        ),
        responseType: 'text',
        withCredentials: true
      });
    request.subscribe(
      data => {
        this.snackBar.open('Logged out.', 'OK', {
          duration: 5000,
        });
        this.router.navigate(['/login']);
      }
    );
  }

  getAuthenticatedUser() {
    this.profile.getValue();
  }

  getProfile(): BehaviorSubject<User> {
    if (this.getAuthenticatedUser() == null) {
      this.loadProfile();
    }
    return this.profile;
  }


  loadProfile() {
    let request = this.http.get(
      'http://localhost:9090/user/profile',
      {
        headers: new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest'
          }
        ),
        withCredentials: true
      }
    );
    request.subscribe(data => {
        let user: User = new User();
        user.username = data['username'];
        this.profile.next(user);
      },
      error => {
        if (error.status != 401) {
          this.snackBar.open('Cannot connect to server.', 'OK', {
            duration: 5000,
          });
        }
      }
    );
  }

  register(username: string, password: string, confirmPassword: string) {
    const formData: FormData = new FormData();

    formData.append('username', username);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    return this.http.post(
      'http://localhost:9090/user/register', formData,
      {
        headers: new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest'
          }
        ),
        withCredentials: true
      }
    );
  }

  changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    const formData: FormData = new FormData();

    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);

    return this.http.post(
      'http://localhost:9090/user/changePassword', formData,
      {
        headers: new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest'
          }
        ),
        withCredentials: true
      }
    );
  }
}
