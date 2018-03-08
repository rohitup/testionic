import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StandardPage } from './standard';

@NgModule({
  declarations: [
    StandardPage,
  ],
  imports: [
    IonicPageModule.forChild(StandardPage),
  ],
})
export class StandardPageModule {}
