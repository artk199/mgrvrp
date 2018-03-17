import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../../services/security.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'vrp-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  username: string;
  password: string;
  confirmPassword: string;

  errorMessage: string;


  constructor(private securityService: SecurityService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  register() {
    this.securityService.register(this.username, this.password, this.confirmPassword).subscribe((data) => {
      if (data['success']) {
        this.router.navigate(['/login']);
        this.snackBar.open('Registration complete. Now you can log in.', 'OK', {
          duration: 1000,
        });
      } else {
        this.errorMessage = data['error'];
      }
    });
  }

}
