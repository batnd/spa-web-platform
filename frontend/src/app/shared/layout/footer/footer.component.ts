import {Component, inject} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModalPopupComponent} from "../../components/modal-popup/modal-popup.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private dialog: MatDialog = inject(MatDialog);
  public showModal(): void {
    this.dialog.open(ModalPopupComponent, {
      autoFocus: false
    });
  }
}
