import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../../services/security.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'vrp-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errorMessage: string;

  constructor(private securityService: SecurityService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  login(): void {
    //disableButton
    //Change button to loade
    let cmp = this;
    this.securityService.authenticate(this.username, this.password).subscribe((data) => {
        console.log('data');
        if (data['success']) {
          this.router.navigate(['']);
          this.snackBar.open('Successfully log in.', 'OK', {
            duration: 1000,
          });
        } else {
          this.errorMessage = data['error'];
        }
        console.log(data);
      },
      (err) => this.snackBar.open('Unknown error. ', 'OK', {
        duration: 1000,
      }));
  }

}
