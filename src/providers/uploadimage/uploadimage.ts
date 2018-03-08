import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SERVER_URL} from "../Utility";


/*
  Generated class for the UploadimageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploadimageProvider {

  constructor(public httpClient: HttpClient) {
    console.log('Hello UploadimageProvider Provider');
  }
  uploadDocumentList(token,data,standard,accauditid){
      console.log(JSON.stringify(data));
    //http://2.pmam.com/pmamhcmwebapi/app/acc/AccAssessmentList/FunUploadProofAttachment/{sectionID}/{ClientID}/{AccAuditId}/{AccAuditDetailID}
      return this.httpClient.post(SERVER_URL+'app/acc/AccAssessmentList/FunUploadProofAttachmentNew/'+standard.sectionID+'/'+standard.clientID+'/'+accauditid+'/'+ standard.accAuditDetailID,data,{headers: new HttpHeaders().set('ApiKey', token)})
        .map(res=>res)


  }
}
