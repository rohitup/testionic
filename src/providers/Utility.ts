import {LoadingController, Platform, ToastController} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Network} from "@ionic-native/network";

/**
 * Created by BirdaRamG on 4/17/2017.
 */

//export let  SERVER_URL='http://192.168.4.180/FAMS-WebAPI/';//"http://10.10.0.171/FAMS_WebAPI/";
//export let  SERVER_URL='http://10.10.0.188/CRMWebAPI/';

// LIVE
/*
export let  SERVER_URL='https://www.pmamcrm.com/CRMWebAPI/';//'http://2.pmam.com/CRMWebAPI/';
export let  SERVER_WEBSERVICEURL='https://www.pmamcrm.com/MobileApp/';//'http://2.pmam.com/CRMWebAPI/';
*/

// VIRTUAL
//http://2.pmam.com/pmamhcmwebapi/AccLogin/Authenticate/{username}/{password}/{caller}/{platform}
//export let  SERVER_URL='http://2.pmam.com/pmamhcmwebapi/';
export let  SERVER_URL="https://api.pmamhcm.com/";
export let  SERVER_WEBSERVICEURL='http://2.pmam.com/MobileAppV4_5_1/';//'http://2.pmam.com/CRMWebAPI/';




export let TIMEOUT=60000;
export let TOASTDIRECTION='bottom';
export let TOASTDURATION='3000';


@Injectable()
export class Utils{

  loader: any = null;
  online:boolean = true;

  constructor(private _loadingController: LoadingController,
              private platform:Platform,
              private network:Network,
              private toastCtrl:ToastController) {

    this.platform.ready().then(()=> {
      let type = this.network.type;

      console.log("Connection type: ", this.network.type);
      // Try and find out the current online status of the device
      if(type == "unknown" || type == "none" || type == undefined){
        console.log("The device is not online");
        this.online = false;//false;
      }else{
        console.log("The device is online!");
        this.online = true;
      }
    });

    this.network.onDisconnect().subscribe( () => {
      this.online = false;
      console.log('network was disconnected :-(');
      this.presentToast('Network was disconnected.');
    });

    this.network.onConnect().subscribe( () => {
      this.online = true;
      console.log('network was connected :-)');
      this.presentToast('Network was connected.');

    });

  }

  private showLoadingHandler(message) {
    if (this.loader == null) {
      this.loader = this._loadingController.create({
        content: message
      });
      this.loader.present();
    } else {
      this.loader.data.content = message;
    }
  }

  private hideLoadingHandler() {
    if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  public showLoader(message) {
    this.showLoadingHandler(message);
  }

  public hideLoader() {
    this.hideLoadingHandler();
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
