import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadEventService {
  private downloadSubject = new Subject<string>();

  downloadEvent$ = this.downloadSubject.asObservable();

  triggerDownload(type: string) {
    this.downloadSubject.next(type); // type pode ser 'pdf', 'csv' ou 'excel'
  }
}
