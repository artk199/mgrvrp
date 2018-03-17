import {Injectable} from '@angular/core';
import {User} from '../domain/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SecurityService {

  authenticatedUser: User;

  constructor(private http: HttpClient) {
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

  }

  getProfile() {

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
      console.log(data);
    });
    return request;
  }

}
