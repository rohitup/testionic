import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SERVER_URL} from "../Utility";

/*
  Generated class for the AssessmentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AssessmentProvider {

  constructor(public httpClient: HttpClient) {
    console.log('Hello AssessmentProvider Provider');
  }
  getAssessmentList(token){
    console.log(token);
    return this.httpClient.get(SERVER_URL+'app/acc/AccAssessmentList/FunGetAssessmentList', {headers: new HttpHeaders().set('ApiKey', token)})
      .map(res=>res)
  }


}
