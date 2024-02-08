import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {RequestType} from "../../../types/request.type";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private http: HttpClient = inject(HttpClient);

  public sendRequest(requestData: RequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', requestData);
  }
}
