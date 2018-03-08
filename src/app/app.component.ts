import {Component, ViewChild} from '@angular/core';
import {MenuController, Nav, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import {AssessmentPage} from "../pages/assessment/assessment";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;
  @ViewChild(Nav) nav: Nav;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private menuCtrl: MenuController,private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.init();
    });

  }
  init(){
    this.storage.get('token').then((val) => {
      console.log("token in main"+val);
      if(val){
        console.log("assessment page");
        //this.nav.setRoot('AssessmentPage')
        this.rootPage = 'AssessmentPage';
      }else{
        console.log("login page");
        this.rootPage = 'LoginPage';
      }

    });

  }
  logOut(){
    this.storage.clear();
    this.nav.setRoot('LoginPage')
    this.menuCtrl.close();
  }
}

