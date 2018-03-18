import {Component} from '@angular/core';
import {SecurityService} from '../../services/security.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'vrp-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  errorMessage: string;

  constructor(private securityService: SecurityService, private router: Router, private snackBar: MatSnackBar) {
  }

  changePassword() {
    this.securityService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword).subscribe((data) => {
      if (data['success']) {
        this.router.navigate(['']);
        this.snackBar.open('Successfully changed password.', 'OK', {
          duration: 1000,
        });
      } else {
        this.errorMessage = data['error'];
      }
    });
  }

}
