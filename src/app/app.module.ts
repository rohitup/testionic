import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Camera} from "@ionic-native/camera";
import { MyApp } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { LoginProvider } from '../providers/login/login';
import {IonicImageViewerModule} from "ionic-img-viewer";
import {Utils} from "../providers/Utility";
import {Network} from "@ionic-native/network";
import { AssessmentProvider } from '../providers/assessment/assessment';
import { StandardProvider } from '../providers/standard/standard';
import { IonicStorageModule } from '@ionic/storage';
import { AuditProvider } from '../providers/audit/audit';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import { UploadimageProvider } from '../providers/uploadimage/uploadimage';
import {FileTransfer} from "@ionic-native/file-transfer";
import {SQLite} from "@ionic-native/sqlite";
import {FilePath} from "@ionic-native/file-path";
import {Transfer} from "@ionic-native/transfer";
import { File } from '@ionic-native/file';
import {Base64} from "@ionic-native/base64";
import {Base64ToGallery} from "@ionic-native/base64-to-gallery";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {FileOpener} from "@ionic-native/file-opener";

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Utils,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    AssessmentProvider,
    StandardProvider,
    AuditProvider,
    InAppBrowser,
    UploadimageProvider,
    FileTransfer,
    SQLite,
    File,
    Transfer,
    FilePath,
    Base64,
    Base64ToGallery,
    SQLitePorter,
    FileOpener
  ]
})
export class AppModule {}
