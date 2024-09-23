import { Component } from '@angular/core';
import {DownloadEventService} from "./services/download-event.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isDarkTheme = true; // Tema padrão é o dark

  constructor(private downloadEventService: DownloadEventService) {}

  downloadData(type: string) {
    this.downloadEventService.triggerDownload(type);
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}
