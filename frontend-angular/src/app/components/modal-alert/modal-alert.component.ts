import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalAlertComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
