import { Component, OnInit } from '@angular/core';
// import { Page } from "tns-core-modules/ui/page";
import { Router } from '@angular/router';
import { ChampionService } from '../shared/champions/champions.service';
import { Champion } from '../shared/champions/champions.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'random-champ',
  providers: [ChampionService],
  styleUrls: ['./random-champ.component.css'],
  templateUrl: './random-champ.component.html',
})
export class RandomChampComponent implements OnInit {
  champImg = '';
  champName = '';
  champTitle = '';
  buttonText = '';
  pageTitle = '';
  isLoading = false;
  randChamp: Champion;

  constructor(
    private router: Router,
    private randChampService: ChampionService, // private page: Page
    private translate: TranslateService
  ) {
    this.pageTitle = translate.instant('randomSelectScreen.title');
    this.buttonText = translate.instant('randomSelectScreen.reRollButton');
  }

  ngOnInit() {
    this.randChampService
      .getLocalChampData(this.translate.currentLang)
      .subscribe((resp) => {
        this.getRandomChamp();
        this.setPageWithRandChamp();
        this.randChampService.checkLocalVersionAndUpdate();
      });

    // this.page.actionBarHidden = true;
  }

  reroll() {
    this.getRandomChamp();
    this.setPageWithRandChamp();
  }

  getRandomChamp() {
    this.randChamp = this.randChampService.generateRandomChampion();
    console.log(this.randChamp);
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
  }
}
