import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DescriptionModalPage } from './description-modal';

@NgModule({
  declarations: [
    DescriptionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DescriptionModalPage),
  ],
})
export class DescriptionModalPageModule {}
