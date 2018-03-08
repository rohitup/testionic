import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SERVER_URL} from "../Utility";

/*
  Generated class for the StandardProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StandardProvider {

  constructor(public httpClient: HttpClient) {
    console.log('Hello StandardProvider Provider');
  }

  getAssessmentList(data,token){
    //let obj = {"accAgencyID":1,"assessmentAssignID":2477,"assessmentName":"Exhibitions and demonstrations","accAuditID":3298,"site":"","clientID":1923,"auditID":2068};

    return this.httpClient.post(SERVER_URL+'app/hcm/AccAssessmentList/FunGetStandardItemList', data, {headers: new HttpHeaders().set('ApiKey', token)})
      .map(res=>res)
  }

}
