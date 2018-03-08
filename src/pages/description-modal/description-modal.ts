import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the DescriptionModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-description-modal',
  templateUrl: 'description-modal.html',
})
export class DescriptionModalPage {
  data = "";
  title = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl : ViewController ,private storage: Storage) {
    this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionModalPage');

    this.storage.get('description').then((val) => {
      console.log(val);
      if(val){
        this.data = val[0].standardDesc;
      }

    });
  }
  public closeModal(){
    this.storage.remove('description');
    this.viewCtrl.dismiss();
  }
}
