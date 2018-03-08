import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {AuditProvider} from "../../providers/audit/audit";
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";
import {ImageViewerController} from "ionic-img-viewer";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {SQLite} from "@ionic-native/sqlite";
import {Utils} from "../../providers/Utility";
import {Base64} from "@ionic-native/base64";
import {DomSanitizer} from "@angular/platform-browser";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File, IFile} from '@ionic-native/file';
import {FileOpener} from "@ionic-native/file-opener";

/**
 * Generated class for the AuditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-audit',
  templateUrl: 'audit.html',
})
export class AuditPage {
  Pagetitle = '';
  items:any =[];
  item = [];
  img ='';
  doc = '';
  documents = [];

  standardtitle = '';
  description = '';
  sourceType=0;

  jsonImage = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public audit: AuditProvider,public modalCtrl : ModalController,
              private storage: Storage,private inAppBrowser: InAppBrowser,private actionSheetCtrl:ActionSheetController,public imageViewerCtrl: ImageViewerController,
              private sqlitePorter : SQLitePorter,private sqlite: SQLite,public utils : Utils,private base64 : Base64,public _DomSanitizer: DomSanitizer,
              private transfer: FileTransfer,private file : File,private fileOpener: FileOpener) {
    console.log(navParams.get('data'));
    this.Pagetitle = navParams.get('title');
    this.standardtitle = navParams.get('data').sectionHeader;
    //this.initialize();
  }
  initialize(){

    this.documents = [];
    this.jsonImage = [];

    this.storage.get('token').then((val) => {
      let token = val;
      this.storage.get('accAuditID').then((val) => {
        console.log(val);
        if(this.utils.online) {
          this.utils.showLoader('Loading....');
          this.audit.getAssessmentDocumentList(this.navParams.get('data'), val, token).subscribe(response => {

              console.log(response);
              this.items = response;
              // response=JSON.parse(response.toString());
              this.items = response;

              this.storage.set('description', response);
              this.storage.set('auditDataResponse_'+this.navParams.get('data').sectionID,JSON.stringify(response) );
              console.log(response[0].proofDocument);
              this.description = response[0].standardDesc;
              for (let i = 0; i < response[0].proofDocument.length; i++) {
                if (response[0].proofDocument[i].fileType == 'D') {
                  //this.documents.push(response[0].proofDocument[i]);
                  this.storage.get('standardData').then((val) => {
                    this.doc = "http://pmamhcm.com/auditdocs/"+val.clientID+"/"+response[0].proofDocument[i].documentphysicalName;

                    const fileTransfer: FileTransferObject = this.transfer.create();
                    let uri = encodeURI(this.doc);

                    let fileName = this.doc.replace(/\?.*$/, "").replace(/.*\//, "");
                    //console.log(fileName);
                    let fileURL = this.file.externalRootDirectory + 'Dmart/Download/Documents/'+response[0].standardID+'/' + fileName;
                    let mimeType = '';
                    fileTransfer.download(uri, fileURL).then((entry) => {
                      console.log('download document complete: ' + entry.toURL());

                      /*this.file.resolveLocalFilesystemUrl(fileURL).then((entry: any)=>{
                        console.log(entry);

                        entry.file(function (data) {
                          console.log(data.type);


                          if (data.type == null || data.type == '' || data.type == undefined) {
                            mimeType = 'text/plain';
                          }else{
                            console.log("in else data type"+data.type);
                            mimeType = data.type;
                          }

                        });
                      });*/

                      this.file.resolveLocalFilesystemUrl(fileURL)
                        .then((entry:any) => {
                          return new Promise((resolve, reject) => {
                            entry.file(meta => resolve(meta), error => reject(error));
                          });
                        })
                        .then((meta: IFile) => {
                          console.log(meta.type);


                          this.documents.push({
                            "docUrl" : entry.toURL(),
                            "type" : meta.type,
                            "documentName" : response[0].proofDocument[i].documentName,
                            "submissionDate" : response[0].proofDocument[i].submissionDate,
                            "documentDesc" : response[0].proofDocument[i].documentDesc
                          });
                          console.log(this.documents);
                          this.storage.set('auditDocumentResponse_'+this.navParams.get('data').sectionID,JSON.stringify(this.documents));
                        })





                    }, (error) => {
                      // handle error
                    });




                  });
                }else{
                  //this.utils.showLoader('Loading....');
                  console.log("image section");
                  this.storage.get('standardData').then((val) => {

                    this.img = "https://pmamhcm.com/auditdocs/"+val.clientID+"/"+response[0].proofDocument[i].documentphysicalName;
                    console.log("image url"+this.img);
                    const fileTransfer: FileTransferObject = this.transfer.create();
                    let uri = encodeURI(this.img);

                    let fileName = this.img.replace(/\?.*$/, "").replace(/.*\//, "");
                    console.log(fileName);
                    let fileURL = this.file.externalRootDirectory + 'Dmart/Download/Images/'+response[0].standardID+'/' + fileName;

                    fileTransfer.download(uri, fileURL).then((entry) => {
                      console.log('download complete: ' + entry.toURL());


                      this.jsonImage.push({
                        "ImageUrl" : entry.toURL(),

                      });
                      this.storage.set('auditImageResponse_'+this.navParams.get('data').sectionID,JSON.stringify(this.jsonImage));

                    }, (error) => {
                      // handle error
                    });




                  });
                }

              }
              this.utils.hideLoader();

            },
            error => {
              this.utils.hideLoader();
              console.log('Error');
            },
            () => {
              this.utils.hideLoader();
              console.log('complete');

            });
        }else{
          console.log("offline");
          this.storage.get('auditDataResponse_'+this.navParams.get('data').sectionID).then((val) => {
            console.log(val);
            if(val){
              let response = JSON.parse(val);
              console.log(response[0].proofDocument);
              this.description = response[0].standardDesc;
            }


          });
          this.storage.get('auditImageResponse_'+this.navParams.get('data').sectionID).then((val) => {
            console.log(JSON.parse(val));
            if(val){
              this.jsonImage  =JSON.parse(val);
            }


          });
          this.storage.get('auditDocumentResponse_'+this.navParams.get('data').sectionID).then((val) => {
            console.log(JSON.parse(val));
            if(val){
              this.documents  =JSON.parse(val);
            }


          });

        }

      });
    });

    this.storage.get('standardData').then((val) => {
      this.img = "http://2.pmam.com/pmamhcm45/auditdocs/"+val.clientID+"/";
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AuditPage');
  }
  ionViewWillEnter(){
    this.initialize();
  }



  openDescription(){
    var data = { title : this.navParams.get('data').sectionHeader };
    var modalPage = this.modalCtrl.create('DescriptionModalPage',data);
    modalPage.present();
  }

  openDoc(data,type){
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    /*this.storage.get('standardData').then((val) => {
      console.log(val.clientID);
      let url = 'http://2.pmam.com/pmamhcm45/auditdocs/'+val.clientID+'/'+data;
      // Opening a URL and returning an InAppBrowserObject
      let GoogleURLCall = 'https://view.officeapps.live.com/op/view.aspx?src=';

        GoogleURLCall = "http://docs.google.com/gview?url="+url;

      const browser = this.inAppBrowser.create(GoogleURLCall, 'blank', options);
    });*/
    console.log("file url"+decodeURI(data)+"doc type"+type);
    this.fileOpener.open(decodeURI(data), type)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));

  }
  attachmentPage(){
    this.navCtrl.push('UploadImgPage',{data: this.navParams.get('data'),'title':this.navParams.get('title'),assessmentAssignID:this.navParams.get('assessmentAssignID')});
  }

  imageOption(index,data){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Photo Option',
      buttons: [
        {
          text: 'View Image',
          icon: 'camera',
          handler: () => {


            this.presentImage(data);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

  }
  deleteAttachmentBtn(index){
    this.item.splice(this.item.indexOf(index));
  }

  presentImage(myImage) {
    console.log(myImage);
    const viewer = this.imageViewerCtrl.create(myImage)
    viewer.present();
  }
  //upload section

  openAttachmentType() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload image From',
      buttons: [

        {
          text: 'Photo Library',
          icon: 'images',
          handler: () => {
            console.log('Photo Library');
            this.sourceType=0;
           // this.AddAttachmentBtn();
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera');
            this.sourceType=1;
            console.log('this.sourceType='+this.sourceType);
           // this.AddAttachmentBtn();
          }
        },
        /*{
          text: 'All files',
          icon: 'document',
          handler: () => {
            console.log('All files clicked');
            this.sourceType=2;
            console.log('this.sourceType='+this.sourceType);
            this.AddAttachmentBtn();
          }
        },*/
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
}

