import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SERVER_URL} from "../Utility";

/*
  Generated class for the AuditProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuditProvider {

  constructor(public httpClient: HttpClient) {
    console.log('Hello AuditProvider Provider');
  }
  getAssessmentDocumentList(data,data1,token){
    //let obj = {"accAgencyID":1,"assessmentAssignID":2477,"assessmentName":"Exhibitions and demonstrations","accAuditID":3298,"site":"","clientID":1923,"auditID":2068};

    return this.httpClient.get(SERVER_URL+'app/acc/AccAssessmentList/FunGetStandardDetails/'+data.sectionID+'/'+data.clientID+'/'+data1+'/'+data.accAuditDetailID, {headers: new HttpHeaders().set('ApiKey', token)})
      .map(res=>res)
  }
}
