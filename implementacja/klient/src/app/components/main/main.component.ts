import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../../services/security.service';

@Component({
  selector: 'vrp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  loading: boolean = true;

  constructor(private securityService: SecurityService) {
  }

  ngOnInit(): void {
    let cmp = this;
    this.securityService.loadProfile().subscribe(data => {
      console.log(data);
      cmp.loading = false;
    });
  }


}
