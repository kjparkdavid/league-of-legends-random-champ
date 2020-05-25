import { Component, OnInit } from '@angular/core';
// import { Page } from "tns-core-modules/ui/page";
import { Router } from '@angular/router';
import { ChampionService } from '../shared/champions/champions.service';
import { Champion } from '../shared/champions/champions.model';

@Component({
  selector: 'random-champ',
  providers: [ChampionService],
  styleUrls: ['./random-champ.component.css'],
  templateUrl: './random-champ.component.html',
})
export class RandomChampComponent implements OnInit {
  champImg = '';
  champLabel = '';
  buttonText = '';
  isLoading = false;
  randChamp: Champion;

  constructor(
    private router: Router,
    private randChampService: ChampionService // private page: Page
  ) {}

  ngOnInit() {
    this.getRandomChamp();
    this.setPageWithRandChamp();
    // this.page.actionBarHidden = true;
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
    this.champLabel = this.randChamp.name;
  }
}
