import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../../services/security.service';
import {User} from '../../domain/User';
import {DialogFactoryService} from '../../services/dialog.factory.service';
import {VRPService} from '../../services/vrp.service';

@Component({
  selector: 'vrp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  loading: boolean = true;
  profile: User;

  constructor(private securityService: SecurityService, private dialogFactoryService: DialogFactoryService, private vrpService: VRPService) {
  }

  ngOnInit(): void {
    MainComponent.showLoadingSpinner();
    this.securityService.getProfile().subscribe(data => {
      this.profile = data;
      if (this.profile) {
        this.vrpService.init().subscribe(n => {
            this.loading = false;
            MainComponent.hideLoadingSpinner();
          }
        );
      }
    });
  }

  logout() {
    this.securityService.logout();
  }

  openSettings() {
    this.dialogFactoryService.showSettingsDialog();
  }

  saveAllProblems() {
    this.vrpService.saveProblemsToStorage();
  }

  /**
   * Włącza ekran ładownaia
   */
  private static showLoadingSpinner() {
    document.getElementById('loading-screen').style.display = 'block';
  }

  /**
   * Wyłącza ekran ładowania
   */
  private static hideLoadingSpinner() {
    document.getElementById('loading-screen').style.display = 'none';
  }

}
