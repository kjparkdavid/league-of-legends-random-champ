import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { Router } from '@angular/router';
import { ChampionService } from '../shared/champions/champions.service';
import { Champion } from '../shared/champions/champions.model';
import { TranslateService } from '@ngx-translate/core';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { PanGestureEventData } from 'tns-core-modules/ui/gestures';
import { Image } from 'tns-core-modules/ui/image';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { initialize as WebImageInit } from 'nativescript-web-image-cache';
import { isAndroid, screen } from 'tns-core-modules/platform';
import { AdmobService } from '../shared/admob/admob.service.tns';
import { RouterExtensions } from 'nativescript-angular/router';

import {
  on as applicationOn,
  ApplicationEventData,
  resumeEvent,
} from 'tns-core-modules/application';

@Component({
  selector: 'random-champ',
  providers: [ChampionService, AdmobService],
  styleUrls: ['./random-champ.component.scss'],
  templateUrl: './random-champ.component.html',
})
export class RandomChampComponent implements OnInit, AfterViewInit {
  champImg = '';
  champName = '';
  champTitle = '';
  buttonText = '';
  allRandomBtnText = '';
  pageTitleRandom = '';
  pageTitle = '';
  isLoading = true;
  randChamp: Champion;
  faIcon = faAngleDoubleRight;
  champOverlayWidth = screen.mainScreen.widthDIPs / 2;

  @ViewChild('dragImage', { static: false }) dragImage: ElementRef;
  dragImageItem: Image;
  prevDeltaX: number;
  prevDeltaY: number;

  @ViewChild('container', { static: false }) container: ElementRef;
  itemContainer: FlexboxLayout;

  @ViewChild('champImage', { static: false }) champImage: any;

  constructor(
    private router: Router,
    private randChampService: ChampionService, // private page: Page
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private page: Page,
    private routerExtensions: RouterExtensions,
    private admob: AdmobService
  ) {
    this.pageTitleRandom = translate.instant(
      'randomSelectScreen.titleMobileRand'
    );
    this.pageTitle = translate.instant('randomSelectScreen.titleMobile');
    this.buttonText = translate.instant('randomSelectScreen.reRollButton');
    this.allRandomBtnText = translate.instant(
      'randomSelectScreen.allRandomButton'
    );

    // Listen to activity resume, called when App is opened back from background
    applicationOn(resumeEvent, (args: ApplicationEventData) => {
      if (args.android) {
        // For Android applications, args.android is an android.content.Intent class.
        // console.log(
        //   'Launched Android application with the following intent: ' +
        //     args.android +
        //     '.'
        // );
        this.createBanner();
      } else if (args.ios !== undefined) {
        // For iOS applications, args.ios is NSDictionary (launchOptions).
        console.log('Launched iOS application with options: ' + args.ios);
        this.createBanner();
      }
    });
  }

  ngOnInit() {
    this.randChampService
      .getLocalChampData(this.translate.currentLang)
      .subscribe((resp) => {
        this.getRandomChamp();
        this.setPageWithRandChamp();
        this.randChampService.checkLocalVersionAndUpdate();
      });

    //tns specific code
    this.page.actionBarHidden = true;

    // When coming back to this page
    this.page.on(Page.navigatedToEvent, () => {
      this.createBanner();
    });

    // WebImage initialize
    if (isAndroid) {
      WebImageInit();
    }
  }

  ngAfterViewInit() {
    this.itemContainer = <FlexboxLayout>this.container.nativeElement;
    this.dragImageItem = <Image>this.dragImage.nativeElement;
    this.dragImageItem.translateX = 0;
    this.dragImageItem.translateY = 0;
    this.dragImageItem.scaleX = 1;
    this.dragImageItem.scaleY = 1;

    // this.createBanner();
    this.cdr.detectChanges();
  }

  createBanner() {
    // create add banner
    setTimeout(() => {
      this.admob.createBanner();
    }, 1000);
  }

  // tns specific code
  onPan(args: PanGestureEventData) {
    // console.log("Pana: [" + args.deltaX + ", " + args.deltaY + "] state: " + args.state);
    if (args.state === 1) {
      // down
      this.prevDeltaX = 0;
      this.prevDeltaY = 0;
    } else if (args.state === 2) {
      // panning
      this.dragImageItem.translateX += args.deltaX - this.prevDeltaX;

      if (this.dragImageItem.translateX < 0) {
        this.dragImageItem.translateX = 0;
      }
      this.prevDeltaX = args.deltaX;
    } else if (args.state === 3) {
      // up
      this.dragImageItem.animate({
        translate: { x: 0, y: 0 },
        duration: 500,
        curve: AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1),
      });
      if (this.dragImageItem.translateX > 50) {
        this.goToAllRandom();
      }
    }
  }

  reroll() {
    this.getRandomChamp();
    this.setPageWithRandChamp();
  }

  getRandomChamp() {
    this.randChamp = this.randChampService.generateRandomChampion();
  }

  setPageWithRandChamp() {
    this.champImg = this.randChampService.getChampionPortrait(
      this.randChamp.key
    );
    this.champName = this.randChamp.name;
    this.champTitle = this.randChamp.title;
  }

  imageLoading(isImageLoading: boolean) {
    this.isLoading = isImageLoading;
    this.cdr.detectChanges();
  }

  goToAllRandom() {
    this.routerExtensions.navigate(
      ['/all-random', { name: this.randChamp.id }],
      {
        animated: true,
        transition: {
          name: 'slideLeft',
          duration: 200,
          curve: 'linear',
        },
      }
    );
  }
}
