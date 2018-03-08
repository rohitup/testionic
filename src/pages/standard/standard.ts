import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {StandardProvider} from "../../providers/standard/standard";
import { Storage  } from '@ionic/storage';
import {Utils} from "../../providers/Utility";
/**
 * Generated class for the StandardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-standard',
  templateUrl: 'standard.html',
})
export class StandardPage {
  shownGroup = null;

  items: any = [];
  Pagetitle = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,private standard: StandardProvider,private storage: Storage,
              public utils : Utils ) {
    this.Pagetitle = navParams.get('data').assessmentName;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StandardPage');

  }

  ionViewWillEnter(){
    this.items = [];
    console.log(this.utils.online);
    if(this.utils.online) {
      this.utils.showLoader('Loading....');
      this.storage.get('token').then((val) => {
        this.standard.getAssessmentList(this.navParams.get('data'), val).subscribe(response => {

            //console.log(response);
            //this.items = response;
            this.storage.set('clientid', response);


            var standardJson: any[] = Array.of(response);
            //console.log("standardJson"+standardJson[0].length);
            for(let i=0;i<standardJson[0].length;i++) {
              console.log();
              this.items.push({
                "accAuditDetailID": standardJson[0][i].accAuditDetailID,
                "auditDetailID": standardJson[0][i].auditDetailID,
                "clientID": standardJson[0][i].clientID,
                "isSubmitted": standardJson[0][i].isSubmitted,
                "sectionName": standardJson[0][i].sectionName,
                "sectionHeader": standardJson[0][i].sectionHeader,
                "sectionID": standardJson[0][i].sectionID,
                "sectionMasterID": standardJson[0][i].sectionMasterID,
                "sortOrder": standardJson[0][i].sortOrder,
                "standardStatus": standardJson[0][i].standardStatus,
                "noteStatus": standardJson[0][i].noteStatus,
                "syncFlag":"false"});
            }

            this.storage.set('standardDataResponse_' +this.navParams.get('data').assessmentAssignID, JSON.stringify(this.items));
            this.synctagFunc();
            //console.log("standardJson"+JSON.stringify(this.items));
            this.utils.hideLoader();
          },
          error => {

            console.log('Error');
            this.utils.hideLoader();
          },
          () => {
            console.log('complete');
            this.utils.hideLoader();

          });
      });
    }else{
      console.log("offline ");
      this.utils.showLoader('Loading....');
      this.storage.get('standardDataResponse_'+this.navParams.get('data').assessmentAssignID).then((val) => {
        console.log(JSON.parse(val));
        this.items = JSON.parse(val);
      });
      this.synctagFunc();
      this.utils.hideLoader();
    }
  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };
  itemSelected(item: any) {
    console.log("Selected Item", item);
    this.storage.set('standardData',item);
    this.storage.set('sectionID', item.sectionID);
    this.navCtrl.push('AuditPage', {data: item,title:this.navParams.get('data').assessmentName,assessmentAssignID:this.navParams.get('data').assessmentAssignID});
  }

  synctagFunc(){


    this.storage.get('uploadingMaster').then((val) => {
      if(val) {
        let uploadingMaster = JSON.parse(val);


        for (let i in uploadingMaster) {
          if (i == this.navParams.get('data').assessmentAssignID) {
            console.log("value" + uploadingMaster[i]);

            for (let j in uploadingMaster[i]) {
              console.log("sectionID" + uploadingMaster[i][j].sectionID);
              console.log("sectionMasterID" + uploadingMaster[i][j].sectionMasterID);
              for (let k = 0; k < this.items.length; k++) {
                if (this.items[k].sectionID == uploadingMaster[i][j].sectionID) {
                  console.log("match");
                  this.items[k].syncFlag = "true";
                } else if (this.items[k].sectionID == uploadingMaster[i][j].sectionMasterID) {
                  console.log("master match");
                  this.items[k].syncFlag = "true";
                }
              }
              console.log(JSON.stringify(this.items));
              //this.storage.set('standardDataResponse_' +this.navParams.get('data').assessmentAssignID, JSON.stringify(this.items));
            }


          }

        }
      }else{
        //this.storage.set('standardDataResponse_' +this.navParams.get('data').assessmentAssignID, JSON.stringify(this.items));
      }

    });
  }
}
