import {Component, OnInit} from '@angular/core';
import {ImportService} from '../../services/import.service';

@Component({
  selector: 'vrp-file-import',
  templateUrl: './file-import.component.html'
})
export class FileImportComponent implements OnInit {

  constructor(private importService: ImportService) {
  }

  ngOnInit(): void {
  }

  uploadFile(event) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.importService.importVRPFile(reader.result);
    };
    reader.readAsText(file);
  }
}
