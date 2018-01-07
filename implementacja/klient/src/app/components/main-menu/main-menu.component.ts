import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vrp-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  private infoPanelHidden: boolean = false;
  private routesPanelHidden: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleInfoPanel(){
    this.infoPanelHidden = !this.infoPanelHidden;
  }

  toggleRoutesPanel(){
    this.routesPanelHidden = !this.routesPanelHidden;
  }

}
