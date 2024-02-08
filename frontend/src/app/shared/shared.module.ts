import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {ReviewCardComponent} from "./components/review-card/review-card.component";
import {ServiceCardComponent} from "./components/service-card/service-card.component";
import {DigitPlacePipe} from "./pipes/digit-place.pipe";
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { FilterComponent } from './components/filter/filter.component';
import {RouterModule} from "@angular/router";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";



@NgModule({
  declarations: [
    ArticleCardComponent,
    ReviewCardComponent,
    ServiceCardComponent,
    DigitPlacePipe,
    ModalPopupComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterModule,
    NgxMaskDirective
  ],
  exports: [
    ArticleCardComponent,
    ReviewCardComponent,
    ServiceCardComponent,
    DigitPlacePipe,
    ModalPopupComponent,
    FilterComponent
  ],
  providers: [provideNgxMask()]
})
export class SharedModule { }
