import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssessmentPage } from './assessment';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AssessmentPage,
  ],
  imports: [
    IonicPageModule.forChild(AssessmentPage),
    PipesModule
  ],
})
export class AssessmentPageModule {}
