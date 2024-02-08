import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ServiceTypesUrlEnum} from "../../../../enums/service-types-url.enum";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestType} from "../../../../types/request.type";
import {RequestService} from "../../services/request.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ServiceTypesNameEnum} from "../../../../enums/service-types-name.enum";

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss']
})
export class ModalPopupComponent implements OnInit {
  private requestService: RequestService = inject(RequestService);

  private data = inject(MAT_DIALOG_DATA);

  private fb: FormBuilder = inject(FormBuilder);
  public selectedService: string = '';
  public serviceRequestForm: FormGroup = this.fb.group({
    serviceType: ['development', [Validators.required]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]]
  });
  public consultationRequestForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]]
  });
  public popupType: { serviceRequest: boolean, consultationRequest: boolean } = {
    serviceRequest: false,
    consultationRequest: false
  };
  public requestSuccess: boolean = false;
  public errorRequest: boolean = false;
  public requestMade: boolean = false;

  ngOnInit(): void {
    if (this.data) {
      this.popupType.serviceRequest = true;
      if (this.data.type === ServiceTypesUrlEnum.development) this.selectedService = 'development';
      if (this.data.type === ServiceTypesUrlEnum.smm) this.selectedService = 'smm';
      if (this.data.type === ServiceTypesUrlEnum.advertisement) this.selectedService = 'advertisement';
      if (this.data.type === ServiceTypesUrlEnum.copyright) this.selectedService = 'copyright';
      this.serviceRequestForm.patchValue({serviceType: this.selectedService});
    } else {
      this.popupType.consultationRequest = true;
    }
  }

  public sendRequest(requestType: string): void {
    if (requestType === 'serviceRequest') {
      const serviceRequestFormValid: boolean = this.serviceRequestForm.valid && this.serviceRequestForm.value.serviceType && this.serviceRequestForm.value.name && this.serviceRequestForm.value.phone;
      this.errorRequest = false;
      if (serviceRequestFormValid) {
        this.requestMade = true;
        let chosenServiceName: string = '';
        if (this.serviceRequestForm.value.serviceType === 'development') chosenServiceName = ServiceTypesNameEnum.development;
        if (this.serviceRequestForm.value.serviceType === 'smm') chosenServiceName = ServiceTypesNameEnum.smm;
        if (this.serviceRequestForm.value.serviceType === 'advertisement') chosenServiceName = ServiceTypesNameEnum.advertisement;
        if (this.serviceRequestForm.value.serviceType === 'copyright') chosenServiceName = ServiceTypesNameEnum.copyright;
        const requestData: RequestType = {
          name: this.serviceRequestForm.value.name,
          phone: this.serviceRequestForm.value.phone,
          type: 'order',
          service: chosenServiceName
        };

        this.makeRequest(requestData);
      } else {
        this.errorRequest = true;
      }
    }

    if (requestType === 'consultationRequest') {
      const consultationRequestFormValid: boolean = this.consultationRequestForm.valid && this.consultationRequestForm.value.name && this.consultationRequestForm.value.phone;
      this.errorRequest = false;
      if (consultationRequestFormValid) {
        this.requestMade = true;
        const requestData: RequestType = {
          name: this.consultationRequestForm.value.name,
          phone: this.consultationRequestForm.value.phone,
          type: 'consultation'
        };

        this.makeRequest(requestData);
      } else {
        this.errorRequest = true;
      }
    }
  }

  private makeRequest(requestData: RequestType): void {
    if (requestData) {
      this.requestService.sendRequest(requestData)
        .subscribe({
          next: (response: DefaultResponseType): void => {
            if (!response.error) this.requestSuccess = true;
            if (response.error) this.errorRequest = true;
            this.requestMade = false;
          },
          error: (response: HttpErrorResponse): void => {
            if (response.error.error) this.errorRequest = true;
            // Когда сервер выключен
            if (response.error) this.errorRequest = true;
            this.requestMade = false;
          }
        });
    }
  }
}
