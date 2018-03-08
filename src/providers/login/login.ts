import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SERVER_URL, TIMEOUT} from "../Utility";

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(public httpClient: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }
 /* getlogin(){
    return this.httpClient.get('http://swapi.co/api/films')
      .map(res=>res)
  }*/
  getLogin(sUserName,sPassword){

    return this.httpClient.get(SERVER_URL+'app/acc/AccLogin/Authenticate/'+sUserName+'/'+sPassword+'/acc/M')
      .map(res=>res)
  }
  getForgotPassword(sUserName){

    return this.httpClient.get(SERVER_URL+'app/acc/AccLogin/AccForgotPassword/'+sUserName)
      .map(res=>res)
  }
}
