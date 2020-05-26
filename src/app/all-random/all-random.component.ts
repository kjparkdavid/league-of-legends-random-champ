import { Component, ChangeDetectorRef } from '@angular/core';
import { ChampionService } from '../shared/champions/champions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BuildService } from '../shared/build/build.service';
import { faUndo, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { Champion } from '../shared/champions/champions.model';

@Component({
  selector: 'all-random',
  templateUrl: './all-random.component.html',
  styleUrls: ['./all-random.component.scss'],
})
export class AllRandomComponent {
  currentChampName = '';
  champSquare = '';
  champName = '';
  isLoading = true;
  randConcept = '';
  itemBuild = [];
  randLane = '';

  pageText: any;
  pageTitle = '';
  laneText = '';
  conceptText = '';
  restartButtonText = '';
  faIcon = faUndo;
  faArrowIcon = faAngleDoubleLeft;
  laneImg = '';

  constructor(
    private randChampService: ChampionService,
    route: ActivatedRoute,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private buildService: BuildService,
    private router: Router
  ) {
    this.setTranslate();

    // get champ from random champ picker page
    this.currentChampName = route.snapshot.paramMap.get('name');

    this.getLaneConceptAndSetPage();
  }

  ngOnInit() {
    if (this.currentChampName) {
      this.randChampService
        .getLocalChampData(this.translate.currentLang)
        .subscribe((resp) => {
          this.setUpPage();
          this.randChampService.checkLocalVersionAndUpdate();
        });
    }
  }

  /**
   * Get Square image URL and champion name then set UI variable
   */
  setUpPage() {
    this.champSquare = this.randChampService.getChampionSquare(
      this.randChampService.getKeyByName(this.currentChampName)
    );
    this.champName = this.randChampService.getChampionByName(
      this.currentChampName
    ).name;
  }

  /**
   * Get translate object and Set UI text variables for title
   */
  setTranslate() {
    this.pageText = this.translate.instant('allRandomScreen');
    this.pageTitle = this.pageText.title;
    this.restartButtonText = this.pageText.restartButton;
  }

  /**
   * Get random concept and item build from buildService and set variables
   */
  setNewLaneConceptBuild() {
    this.randConcept = this.buildService.getRandomConcept();
    this.itemBuild = this.buildService.getItemBuild(this.randConcept);
    this.randLane = this.buildService.getRandomLane();
  }

  /**
   * Set UI text variables for lane nad concept
   */
  setNewLaneConceptText() {
    this.laneText = this.pageText.lane[this.randLane];
    this.laneImg = '../../assets/images/' + this.randLane + '.png';
    this.conceptText = this.pageText.concepts[this.randConcept];
  }

  /**
   * Get Random land and concept and update UI
   */
  getLaneConceptAndSetPage() {
    this.setNewLaneConceptBuild();
    this.setNewLaneConceptText();
  }

  imageLoading(isImageLoading: boolean) {
    this.isLoading = isImageLoading;
    this.cdr.detectChanges();
  }

  restart() {
    this.getRandomChamp();
    this.setUpPage();
    this.getLaneConceptAndSetPage();
  }

  getRandomChamp() {
    this.currentChampName = this.randChampService.generateRandomChampion().id;
  }

  navigateToRandomChamp() {
    this.router.navigate(['/random-champ']);
  }
}
