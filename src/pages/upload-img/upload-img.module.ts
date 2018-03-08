import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadImgPage } from './upload-img';

@NgModule({
  declarations: [
    UploadImgPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadImgPage),
  ],
})
export class UploadImgPageModule {}
