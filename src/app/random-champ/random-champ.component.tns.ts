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
import { initialize } from 'nativescript-web-image-cache';
import { isAndroid, screen } from 'tns-core-modules/platform';

@Component({
  selector: 'random-champ',
  providers: [ChampionService],
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
  champImageWidth = screen.mainScreen.widthDIPs/1.5;
  champOverlayWidth = screen.mainScreen.widthDIPs/2;

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
    private page: Page
  ) {
    this.pageTitleRandom = translate.instant(
      'randomSelectScreen.titleMobileRand'
    );
    this.pageTitle = translate.instant('randomSelectScreen.titleMobile');
    this.buttonText = translate.instant('randomSelectScreen.reRollButton');
    this.allRandomBtnText = translate.instant(
      'randomSelectScreen.allRandomButton'
    );
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

    // WebImage initialize
    if (isAndroid) {
      initialize();
    }
  }

  ngAfterViewInit() {
    this.itemContainer = <FlexboxLayout>this.container.nativeElement;
    this.dragImageItem = <Image>this.dragImage.nativeElement;
    this.dragImageItem.translateX = 0;
    this.dragImageItem.translateY = 0;
    this.dragImageItem.scaleX = 1;
    this.dragImageItem.scaleY = 1;
    

    // const champImageEl = this.champImage;
    // champImageEl.setAttribute('style', 'width:' + screen.mainScreen.widthDIPs/2 );
    // console.log(this.champImageWidth);

    this.cdr.detectChanges();
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
    this.router.navigate(['/all-random', { name: this.randChamp.id }]);
  }
}
