import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import { HttpClient } from '@angular/common/http';
import {LoginProvider} from "../../providers/login/login";
import {TOASTDIRECTION, Utils} from "../../providers/Utility";
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  films: Observable<any>;
  username = '';
  password = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient,public login: LoginProvider,public utils : Utils,
              public toastCtrl: ToastController,private storage: Storage) {
   /* this.films = this.httpClient.get('http://swapi.co/api/films');
    this.films
       console.log('my data: ', data);
      }) .subscribe(data => {
      */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.storage.set('token', '');
  }
  SignInBtn(){
    console.log("login event");
    if(this.utils.online) {
      this.utils.showLoader('Authenticating....');
      this.login.getLogin(this.username, this.password).subscribe(response => {

          if (response == 'DenyAll') {
            this.presentToast('Incorrect username or password.');
            return;

          } else if(response == 'DenyMobile'){
            this.presentToast('You\'re restricted to login into this app.Please contact your system administrator.');
            return;
          }else {
            this.storage.set('token', response);
            this.navCtrl.setRoot('AssessmentPage');
          }

        },
        error => {

          console.log('Error');
        },
        () => {
          console.log('complete');
          this.utils.hideLoader();
        });
    }else {
      this.presentToast('Please check you internet connectivity.');
    }

  }
  ForgotBtn(){
    if(this.utils.online) {
      if (this.username != '') {
        console.log(this.username);
        this.login.getForgotPassword(this.username).subscribe(response => {
            console.log(response);
            if (response) {
              this.presentToast(response);
            } else {
              this.presentToast("Please enter a valid Username/Emailid")
            }


          },
          error => {

            console.log('Error');
          },
          () => {
            console.log('complete');
            this.utils.hideLoader();
          });
      } else {
        this.presentToast('Please enter emailid/username.');
      }
    }else {
      this.presentToast('Please check you internet connectivity.');
    }
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: TOASTDIRECTION
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
