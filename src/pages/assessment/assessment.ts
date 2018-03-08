import {Component, ViewChild} from '@angular/core';
import {IonicPage, List, NavController, NavParams} from 'ionic-angular';
import {AssessmentProvider} from "../../providers/assessment/assessment";
import { Storage } from '@ionic/storage';
import {Utils} from "../../providers/Utility";
/**
 * Generated class for the AssessmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assessment',
  templateUrl: 'assessment.html',
})
export class AssessmentPage {
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  items: any = [];
  token = '';
  term: string = '';

  obj:object = {};
  imageindex = [];
  pendingAssessment: any =[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public assessment: AssessmentProvider,private storage: Storage,public utils : Utils) {
    this.initialize();

  }

  initialize(){

  }
  ionViewWillEnter(){
    //console.log('ionViewDidLoad AssessmentPage');
    this.items = [];
    if(this.utils.online) {
      this.utils.showLoader('Loading....');
      this.storage.get('token').then((val) => {


        this.assessment.getAssessmentList(val).subscribe(response => {
          //console.log(response);


            var assessmentJson: any[] = Array.of(response);

            for(let i=0;i<assessmentJson[0].length;i++) {

              this.items.push({
                "accAgencyID": assessmentJson[0][i].accAgencyID,
                "assessmentAssignID": assessmentJson[0][i].assessmentAssignID,
                "assessmentName": assessmentJson[0][i].assessmentName,
                "accAuditID": assessmentJson[0][i].accAuditID,
                "site": assessmentJson[0][i].site,
                "clientID": assessmentJson[0][i].clientID,
                "auditID": assessmentJson[0][i].auditID,
                "auditMonth": this.getMonthName(assessmentJson[0][i].auditMonth),
                "auditYear": assessmentJson[0][i].auditYear,
                "syncFlag":"false"
              });
            }
            this.storage.set('assessmentData', JSON.stringify(this.items));
            this.synctagFunc();
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
        this.token = val;
      });



    }else{
      console.log("offline");
      this.utils.showLoader('Loading....');
      this.storage.get('assessmentData').then((val) => {
        console.log(val);
        this.items = JSON.parse(val);
      });

      this.synctagFunc();
      this.utils.hideLoader();
    }
  }
  ionViewDidLoad() {

  }

  itemSelected(item) {
    console.log("Selected Item", item);
    this.storage.set('accAuditID', item.accAuditID);
    this.storage.set('assessmentAssignID', item.assessmentAssignID);
    this.navCtrl.push('StandardPage', {data: item});
  }



  searchFn(ev: any) {
    this.term = ev.target.value;
  }

  synctagFunc(){

    this.storage.get('uploadingMaster').then((val) => {
      console.log(JSON.parse(val));
      if(val) {
        let uploadingMaster = JSON.parse(val);

        for(let i in uploadingMaster){
           console.log("value"+i);
           if(uploadingMaster[i].length > 0){
             for (let j = 0; j < this.items.length; j++) {
               if (this.items[j].assessmentAssignID == i) {
                 console.log("match");
                 this.items[j].syncFlag = "true";
               }
             }
             console.log(JSON.stringify(this.items));
             //this.storage.set('assessmentData', JSON.stringify(this.items));
           }

        }


      }else{
        //this.storage.set('assessmentData', JSON.stringify(this.items));
      }

    });
  }
  getMonthName(monthNumber){
      var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December' ];
      return monthNames[monthNumber - 1];

  }
  syncAll(id){
    this.obj["ProofList"] = [];
    this.storage.get('uploadingMaster').then((val) => {
        //console.log(val.id);
      let uploadingMaster = JSON.parse(val);

      for(let i in uploadingMaster){
        console.log("value"+i);
        if(uploadingMaster[i].length > 0) {
          if (i == id) {

          for (let j in uploadingMaster[i]) {

            this.storage.get('offlineDocument_' + uploadingMaster[i][j].assessmentAssignID + "_" + uploadingMaster[i][j].sectionID).then((offlinedoc) => {
              //this.utils.showLoader('Uploading Attachment....');
             console.log(JSON.stringify(offlinedoc));

                for (let i = 0; i < offlinedoc.length; i++) {
                  this.imageindex.push(i);
                  this.obj["ProofList"].push({
                    "AccAuditDetailID": offlinedoc[i].accAuditDetailID,
                    "ClientID": offlinedoc[i].clientID,
                    "FileName": offlinedoc[i].imageName,
                    "PhysicalFileName": offlinedoc[i].imageName,
                    "FileDesc": offlinedoc[i].imageName,
                    "ProofTitle": offlinedoc[i].proofoftitle,
                    "base64imageString": offlinedoc[i].data,
                    "Extension": offlinedoc[i].ext
                  });
                }

              console.log(JSON.stringify(this.obj));
            });
          }
        }
       }
      }

    });
  }
  uploadimage(){
   /* this.uploadimage.uploadDocumentList(token, obj, standard, offlinedoc[i].accauditid).subscribe(response => {
        //console.log(response);
      },
      error => {

        console.log('Error');
        this.utils.hideLoader();
      },
      () => {
        console.log('complete');
        for (let i in imageindex) {
          this.item.splice(this.item.indexOf(imageindex[i]));
        }

        this.storage.get('uploadingMaster').then((val) => {
          console.log(JSON.parse(val));
          let data = JSON.parse(val);
          let sectiondata = {};
          var sectionArray = new Array();
          for (let i in data) {
            console.log('assessmentAssignID' + i);

            sectionArray = data[i];
            console.log('before sectionMaster' + JSON.stringify(sectionArray));
            for (let j = 0; j < sectionArray.length; j++) {
              console.log("sectionID " + sectionArray[j].sectionID + "sectionMasterID    " + sectionArray[j].sectionMasterID);
              if (sectionArray[j].sectionID == this.navParams.get('data').sectionID) {
                console.log("match section id");
                //this.uploadingMaster[j].syncFlag = "true";
                sectionArray.splice(j, 1);
              }

            }
            //data[i].push(sectionArray);
            console.log("section Array" + JSON.stringify(sectionArray));
            //data[i].push(sectionArray);
            if (sectionArray) {
              if (!sectiondata[i]) {
                sectiondata[i] = [];
                for (let k = 0; k < sectionArray.length; k++) {
                  sectiondata[i].push({
                    "sectionID": sectionArray[k].sectionID,
                    "assessmentAssignID": sectionArray[k].assessmentAssignID,
                    "sectionMasterID": sectionArray[k].sectionMasterID
                  });
                }

              } else {
                for (let k = 0; k < sectionArray.length; k++) {
                  sectiondata[i].push({
                    "sectionID": sectionArray[k].sectionID,
                    "assessmentAssignID": sectionArray[k].assessmentAssignID,
                    "sectionMasterID": sectionArray[k].sectionMasterID
                  });
                }
              }

            }

            //console.log('after sectionMaster'+JSON.stringify( data));
          }

          this.storage.set('uploadingMaster', JSON.stringify(sectiondata));
        });

        this.storage.set('offlineDocument_' + this.navParams.get('assessmentAssignID') + "_" + this.navParams.get('data').sectionID, JSON.stringify(this.item));
        this.utils.hideLoader();
      });*/
  }
}
