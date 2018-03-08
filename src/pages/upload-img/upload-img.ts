import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {ImageViewerController} from "ionic-img-viewer";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {SERVER_URL, TOASTDIRECTION, Utils} from "../../providers/Utility";
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Base64} from "@ionic-native/base64";
import {File, IFile} from '@ionic-native/file';
import {Base64ToGallery} from "@ionic-native/base64-to-gallery";
import {UploadimageProvider} from "../../providers/uploadimage/uploadimage";
import {DomSanitizer} from "@angular/platform-browser";
import {InAppBrowserOptions} from "@ionic-native/in-app-browser";
import {FileOpener} from "@ionic-native/file-opener";


declare var escapeObj: any;
declare var webGlObject: any;
/**
 * Generated class for the UploadImgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-img',
  templateUrl: 'upload-img.html',
})
export class UploadImgPage {
  Pagetitle = '';
  addButton = true;
  item = [];
  sourceType=0;
  ImagesUrl=[];
  ImagesName=[];
  uploadingMaster = {};
  aImages    :  any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private actionSheetCtrl:ActionSheetController,private camera: Camera,
              private toastCtrl:ToastController,public imageViewerCtrl: ImageViewerController,private transfer: FileTransfer,private utils: Utils,
              private storage:Storage,private sqlite: SQLite,private base64: Base64,private file: File,private base64ToGallery: Base64ToGallery,
              private uploadimage: UploadimageProvider,public _DomSanitizer: DomSanitizer,private alertCtrl: AlertController,private fileOpener: FileOpener) {

    this.Pagetitle = navParams.get('title');
    if(this.item.length > 7){
      this.addButton = false;

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadImgPage');

    if(this.utils.online) {
      //this.item = [];
      //console.log("section id"+this.navParams.get('data'));

      this.utils.showLoader('Loading....');
        this.storage.get('offlineDocument_'+this.navParams.get('assessmentAssignID')+"_"+this.navParams.get('data').sectionID).then((val) => {

            //console.log(JSON.parse(val));
            if(val){
              this.item = JSON.parse(val);
            }
          this.utils.hideLoader();
        });

      this.storage.get('uploadingMaster').then((val) => {
        //console.log(JSON.parse(val));
      });

    }else{
      this.utils.showLoader('Loading....');
        this.storage.get('offlineDocument_'+this.navParams.get('assessmentAssignID')+"_"+this.navParams.get('data').sectionID).then((val) => {
          //console.log(JSON.parse(val));
          if(val){
            this.item = JSON.parse(val);
          }
          this.utils.hideLoader();
        });

    }
  }
  openAttachmentType() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload image From',
      buttons: [

       /* {
          text: 'Photo Library',
          icon: 'images',
          handler: () => {
            console.log('Photo Library');
            this.sourceType=0;
            this.proafofTitle();

          }
        },*/
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            //console.log('Camera');
            this.sourceType=1;
            //console.log('this.sourceType='+this.sourceType);
            this.proafofTitle();
          }
        },
        {
          text: 'All files',
          icon: 'document',
          handler: () => {
            //console.log('All files clicked');
            this.sourceType=2;
            //console.log('this.sourceType='+this.sourceType);
            this.proafofTitle();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  AddAttachmentBtn(proofoftitle) {

    console.log('AddAttachment this.sourceType='+this.sourceType);

    let options: CameraOptions;

    if(this.sourceType==0){

      options = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: true
      }
    }

    if(this.sourceType==1){

      options = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true
      }
    }

    if(this.sourceType==2){

      options = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.ALLMEDIA,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
      }
    }


    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //let base64Image = 'data:image/jpeg;base64,' + imageData;

      //console.log('imageData='+imageData);

      if (imageData.substring(0,21)=="content://com.android") {
        let photo_split=imageData.split("%3A");
        imageData="content://media/external/images/media/"+photo_split[1];
      }

      let imgName=imageData.split('/').pop()+'';
      //console.log('imageData='+imageData);
      this.ImagesUrl.push(imageData);

      let img =imageData.replace(":", "''");
      //console.log("image url:"+img);
      this.ImagesName.push(imgName);
      let dataimg = '';
      let ext;
      ext = imgName.split(".");
      this.base64.encodeFile(imageData).then((base64File: string) => {

        let baseString = base64File.split(",");
        //console.log("imgUrl"+base64File+"ext"+ext[1]+"imageName"+imgName+"data"+baseString[1].replace(/(\r\n|\n|\r)/gm,""));
        console.log("extension "+ext[1]);

        if(ext[1] == "jpg" || ext[1] == "png" || ext[1] == "gif"){
          this.item.push({"imgUrl":base64File,"ext":ext[1],"imageName":imgName,"proofoftitle":proofoftitle,"data":baseString[1].replace(/(\r\n|\n|\r)/gm,""),
            "assessmentAssignID":this.navParams.get('assessmentAssignID'),"sectionID":this.navParams.get('data').sectionID,"sectionMasterID":this.navParams.get('data').sectionMasterID,
             "accAuditDetailID": this.navParams.get('data').accAuditDetailID,"clientID":this.navParams.get('data').clientID});
        }else{

          this.item.push({"imgUrl":"assets/imgs/doc_icon.png","ext":ext[1],"imageName":imgName,"proofoftitle":proofoftitle,"data":baseString[1].replace(/(\r\n|\n|\r)/gm,""),
            "assessmentAssignID":this.navParams.get('assessmentAssignID'),"sectionID":this.navParams.get('data').sectionID,"sectionMasterID":this.navParams.get('data').sectionMasterID,
            "accAuditDetailID": this.navParams.get('data').accAuditDetailID,"clientID":this.navParams.get('data').clientID});

        }


        this.storage.get('uploadingMaster').then((val) => {
          //console.log(val);
          if(val){
            this.uploadingMaster =JSON.parse(val);
            //console.log("got some value"+this.uploadingMaster);
            //this.uploadingMaster[this.navParams.get('assessmentAssignID')] = [];
            if(!this.uploadingMaster[this.navParams.get('assessmentAssignID')]){

                    this.uploadingMaster[this.navParams.get('assessmentAssignID')] = [];
                    this.uploadingMaster[this.navParams.get('assessmentAssignID')].push({
                      "sectionID": this.navParams.get('data').sectionID,
                      "assessmentAssignID": this.navParams.get('assessmentAssignID'),
                      "sectionMasterID": this.navParams.get('data').sectionMasterID
                    });


            }else{
              for(let i in this.uploadingMaster) {
                if (this.uploadingMaster[i].length>0) {
                  for (let j = 0; j < this.uploadingMaster[i].length; j++) {
                    //console.log(this.navParams.get('data').sectionID);


                    if (this.navParams.get('data').sectionID != this.uploadingMaster[i][j].sectionID) {
                      console.log("not match id " + this.uploadingMaster[i][j].sectionID);
                      this.uploadingMaster[this.navParams.get('assessmentAssignID')].push({
                        "sectionID": this.navParams.get('data').sectionID,
                        "assessmentAssignID": this.navParams.get('assessmentAssignID'),
                        "sectionMasterID": this.navParams.get('data').sectionMasterID
                      });
                    }



                }
              }else
                {
                  this.uploadingMaster[this.navParams.get('assessmentAssignID')].push({
                    "sectionID": this.navParams.get('data').sectionID,
                    "assessmentAssignID": this.navParams.get('assessmentAssignID'),
                    "sectionMasterID": this.navParams.get('data').sectionMasterID
                  });
                }
              }
            }

            this.storage.set('uploadingMaster',JSON.stringify(this.uploadingMaster));
          }else{
            this.uploadingMaster[this.navParams.get('assessmentAssignID')] = [];
            this.uploadingMaster[this.navParams.get('assessmentAssignID')].push({"sectionID":this.navParams.get('data').sectionID,"assessmentAssignID" : this.navParams.get('assessmentAssignID'),"sectionMasterID":this.navParams.get('data').sectionMasterID});
            this.storage.set('uploadingMaster',JSON.stringify(this.uploadingMaster));
          }
        });

        this.storage.set('offlineDocument_'+this.navParams.get('assessmentAssignID')+"_"+this.navParams.get('data').sectionID, JSON.stringify(this.item));
        dataimg = base64File;

      }, (err) => {
        console.log(err);
      });

      console.log(' this.ImagesName='+ this.ImagesName);





    }, (err) => {

      // Handle error
    });


  }

  uploadImage(){
    if(this.utils.online) {
      this.utils.showLoader('Uploading Attachment....');
      this.storage.get('token').then((token) => {
        this.storage.get('accAuditID').then((accauditid) => {
          this.storage.get('standardData').then((standard) => {
            let obj = {};
            obj["ProofList"] = [];
            let imageindex = [];
            for (let i = 0; i < this.item.length; i++) {
              imageindex.push(i);
              obj["ProofList"].push({
                "AccAuditDetailID": standard.accAuditDetailID,
                "ClientID": standard.clientID,
                "FileName": this.item[i].imageName,
                "PhysicalFileName": this.item[i].imageName,
                "FileDesc": this.item[i].imageName,
                "ProofTitle": this.item[i].proofoftitle,
                "base64imageString": this.item[i].data,
                "Extension": this.item[i].ext
              });
            }
            this.uploadimage.uploadDocumentList(token, obj, standard, accauditid).subscribe(response => {
                //console.log(response);
              },
              error => {

                console.log('Error');
                this.utils.hideLoader();
              },
              () => {
                console.log('complete');
                for(let i in imageindex){
                  this.item.splice(this.item.indexOf(imageindex[i]));
                }

                this.storage.get('uploadingMaster').then((val) => {
                  console.log(JSON.parse(val));
                  let data = JSON.parse(val);
                  let sectiondata = {};
                  var sectionArray = new Array();
                  for(let i in data){
                    console.log('assessmentAssignID'+i);

                      sectionArray = data[i];
                    console.log('before sectionMaster'+JSON.stringify(sectionArray));
                      for(let j=0;j<sectionArray.length;j++){
                        console.log("sectionID "+sectionArray[j].sectionID+"sectionMasterID    "+sectionArray[j].sectionMasterID);
                        if (sectionArray[j].sectionID == this.navParams.get('data').sectionID) {
                          console.log("match section id");
                          //this.uploadingMaster[j].syncFlag = "true";
                          sectionArray.splice(j,1);
                        }

                      }
                      //data[i].push(sectionArray);
                    console.log("section Array"+JSON.stringify(sectionArray));
                   //data[i].push(sectionArray);
                    if(sectionArray){
                      if(!sectiondata[i]){
                        sectiondata[i] = [];
                        for(let k =0;k<sectionArray.length;k++){
                          sectiondata[i].push({
                            "sectionID":sectionArray[k].sectionID,
                            "assessmentAssignID" : sectionArray[k].assessmentAssignID,
                            "sectionMasterID":sectionArray[k].sectionMasterID
                          });
                        }

                      }else{
                        for(let k =0;k<sectionArray.length;k++){
                          sectiondata[i].push({
                            "sectionID":sectionArray[k].sectionID,
                            "assessmentAssignID" : sectionArray[k].assessmentAssignID,
                            "sectionMasterID":sectionArray[k].sectionMasterID
                          });
                        }
                      }

                    }

                    //console.log('after sectionMaster'+JSON.stringify( data));
                  }

                  this.storage.set('uploadingMaster',JSON.stringify( sectiondata));
                });

                this.storage.set('offlineDocument_'+this.navParams.get('assessmentAssignID')+"_"+this.navParams.get('data').sectionID, JSON.stringify(this.item));
                this.utils.hideLoader();
              });
          });
        });
      });
    }else{
      this.presentToast('Please check you internet connectivity.');

    }
  }
  imageOption(index,data,imageurl,ext){
    //console.log(data+"---"+imageurl+"-----"+ext);
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Attachment Option',
      buttons: [

        {
          text: 'Delete Attachment',
          icon: 'images',
          handler: () => {
            console.log('delete Photo ');

            this.deleteAttachmentBtn(index);
          }
        },
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

    let actionSheet1 = this.actionSheetCtrl.create({
      title: 'Attachment Option',
      buttons: [

        {
          text: 'Delete Attachment',
          icon: 'images',
          handler: () => {
            console.log('delete Photo ');

            this.deleteAttachmentBtn(index);
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
    if(ext[1] == "jpg" || ext[1] == "png" || ext[1] == "gif") {
      actionSheet.present();
    }else{
      actionSheet1.present();
    }
  }
  openDoc(data,type){
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }

    console.log("file url"+decodeURI(data)+"doc type"+type);
    this.fileOpener.open(decodeURI(data), type)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));

  }

  deleteAttachmentBtn(index){
    this.item.splice(this.item.indexOf(index));
    this.storage.set('offlineDocument_'+this.navParams.get('assessmentAssignID')+"_"+this.navParams.get('data').sectionID, JSON.stringify(this.item));
    if(this.item.length == 0){
      this.storage.get('uploadingMaster').then((val) => {
        //console.log("uploading master data"+JSON.parse(val));
        let data = JSON.parse(val);
        let sectiondata = {};
        var sectionArray = new Array();
        for(let i in data){
          console.log('assessmentAssignID'+i);

          sectionArray = data[i];
          console.log('before sectionMaster'+JSON.stringify(sectionArray));
          for(let j=0;j<sectionArray.length;j++){
            console.log("sectionID "+sectionArray[j].sectionID+"sectionMasterID    "+sectionArray[j].sectionMasterID);
            if (sectionArray[j].sectionID == this.navParams.get('data').sectionID) {
              console.log("match section id");
              //this.uploadingMaster[j].syncFlag = "true";
              sectionArray.splice(j,1);
            }

          }
          //data[i].push(sectionArray);
          console.log("section Array"+JSON.stringify(sectionArray));
          //data[i].push(sectionArray);
          if(sectionArray){
            if(!sectiondata[i]){
              sectiondata[i] = [];
              for(let k =0;k<sectionArray.length;k++){
                sectiondata[i].push({
                  "sectionID":sectionArray[k].sectionID,
                  "assessmentAssignID" : sectionArray[k].assessmentAssignID,
                  "sectionMasterID":sectionArray[k].sectionMasterID
                });
              }

            }else{
              for(let k =0;k<sectionArray.length;k++){
                sectiondata[i].push({
                  "sectionID":sectionArray[k].sectionID,
                  "assessmentAssignID" : sectionArray[k].assessmentAssignID,
                  "sectionMasterID":sectionArray[k].sectionMasterID
                });
              }
            }

          }

          //console.log('after sectionMaster'+JSON.stringify( data));
        }

        this.storage.set('uploadingMaster',JSON.stringify( sectiondata));
      });
    }
  }

  presentImage(myImage) {
    console.log(myImage);
    const viewer = this.imageViewerCtrl.create(myImage)
    viewer.present();
  }

  photoSubmit(){
    let toast = this.toastCtrl.create({
      message: 'Image was added successfully',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
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

  proafofTitle(){
    let prompt = this.alertCtrl.create({
      title: 'Proof of Title',
      message: "Please enter Proof of Title.",
      inputs: [
        {
          name: 'title',
          placeholder: 'title',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log('Saved clicked=' + data.title);
            if(data.title){
              this.AddAttachmentBtn(data.title);
            }else{
              this.presentToast('Please enter Proof of Title.');
            }
            //console.log('this.utils.TOASTDIRECTION=' + TOASTDIRECTION);



          }
        }
      ]
    });
    prompt.present();
  }
}
