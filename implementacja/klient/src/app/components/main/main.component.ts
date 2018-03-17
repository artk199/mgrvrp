import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../../services/security.service';
import {User} from '../../domain/User';

@Component({
  selector: 'vrp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  loading: boolean = true;
  profile: User;

  constructor(private securityService: SecurityService) {
  }

  ngOnInit(): void {
    this.securityService.getProfile().subscribe(data => {
      this.profile = data;
      if (this.profile) {
        this.loading = false;
      }
    });
  }

  logout(){
    this.securityService.logout();
  }


}
