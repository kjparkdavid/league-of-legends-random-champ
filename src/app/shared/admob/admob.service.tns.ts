import { Injectable } from '@angular/core';
import * as Admob from 'nativescript-admob';

@Injectable({
  providedIn: 'root',
})
export class AdmobService {
  // private androidBannerId: string = 'ca-app-pub-9441822379589008/3791035306';
  // private iosBannerId: string = 'ca-app-pub-9441822379589008/7710987060';

  // test banners
  private androidBannerId: string = 'ca-app-pub-3940256099942544/2934735716';
  private iosBannerId: string = 'ca-app-pub-3940256099942544/2934735716';

  public createBanner() {
    Admob.createBanner({
      testing: true,
      size: Admob.AD_SIZE.SMART_BANNER,
      iosBannerId: this.iosBannerId,
      androidBannerId: this.androidBannerId,
      iosTestDeviceIds: ['yourTestDeviceUDIDs'],
      margins: {
        bottom: 0,
      },
    }).then(
      () => {
        console.log('admob createBanner done');
      },
      (error) => {
        console.log('admob createBanner error: ' + error);
      }
    );
  }

  public hideBanner() {
    Admob.hideBanner().then(
      function () {
        console.log('admob hideBanner done');
      },
      function (error) {
        console.log('admob hideBanner error: ' + error);
      }
    );
  }
}
