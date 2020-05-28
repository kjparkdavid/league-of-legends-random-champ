import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Champion } from './champions.model';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Config } from '../config';

// import * as ChampionData from '../../../assets/data/ddragon.champion.ko.json';
import { TranslateService } from '@ngx-translate/core';
import { isAndroid, isIOS, device, screen } from 'tns-core-modules/platform';

export const KO_KR = 'ko_KR';
export const EN_US = 'en_US';
export const LANGUAGES = {
  EN: 'en',
  KO: 'ko',
};

@Injectable({
  providedIn: 'root',
})
export class ChampionService {
  championData: any; //object that contains all champion data
  championJSON: any; //object that contains all champion data
  latestVersion = '';
  lang = KO_KR; // en_US

  constructor(private http: HttpClient, translate: TranslateService) {
    let userLang = device.language;

    // check language and load local champData
    if (userLang.indexOf('ko') >= 0) {
      this.lang = KO_KR;
      translate.use(LANGUAGES.KO);
    } else {
      this.lang = EN_US;
      translate.use(LANGUAGES.EN);
    }
  }

  checkLocalVersionAndUpdate() {
    // this.championData = ChampionData.data;
    this.getLatestVersion().subscribe((resp) => {
      this.latestVersion = resp[0];
      // compare major version if mismatch, update this.championData from the server
      if (
        parseInt(this.latestVersion, 10) !==
        parseInt(this.championJSON.version, 10)
      ) {
        this.getLatestChampionData().subscribe((resp: any) => {
          this.championData = resp.data;
          this.championJSON = resp;
          this.latestVersion = this.championJSON.version;
        });
      }
    });
  }

  /**
   * @param name name of the champion
   * @returns champion object
   */
  getChampionByName(name: string): Champion {
    return this.championData[name];
  }

  /**
   * @param name name of the champion
   * @returns key value of the champion
   */
  getKeyByName(name: string) {
    if (this.getChampionByName(name)) {
      return this.getChampionByName(name).key;
    } else {
      return -1;
    }
  }

  /**
   * @param key key value of the champion
   * @returns champion portrait URL
   */
  getChampionPortrait(key: number) {
    return (
      Config.cdragonURL +
      '/' +
      this.latestVersion +
      '/champion/' +
      key +
      '/portrait'
    );
  }

  /**
   * @param key key value of the champion
   * @returns champion squre URL
   */
  getChampionSquare(key: number) {
    return (
      Config.cdragonURL +
      '/' +
      this.latestVersion +
      '/champion/' +
      key +
      '/square'
    );
  }

  /**
   * @returns http.get load champion json file
   * example URL) http://ddragon.leagueoflegends.com/cdn/10.10.3216176/data/ko_KR/champion.json
   *
   */
  getLatestChampionData() {
    return this.http
      .get(
        Config.ddragonURL +
          '/cdn/' +
          this.latestVersion +
          '/data/' +
          this.lang +
          '/champion.json'
      )
      .pipe(catchError(this.handleErrors));
  }

  getLocalChampData(lang: string) {
    return this.http
      .get('~/assets/data/ddragon.champion.' + lang + '.json')
      .pipe(
        map((resp: any) => {
          this.championData = resp.data;
          this.championJSON = resp;
          this.latestVersion = this.championJSON.version;
        })
      );
  }

  /**
   * @returns number of champions in this.championData
   */
  getNumberOfChampions() {
    return Object.keys(this.championData).length;
  }

  /**
   * @param index index number of the champion
   * @returns champion object
   */
  getChampionByIndex(index: number): Champion {
    return <Champion>Object.values(this.championData)[index];
  }

  /**
   * @returns random champion object
   */
  generateRandomChampion(): Champion {
    let rand = Math.floor(Math.random() * this.getNumberOfChampions());
    return this.getChampionByIndex(rand);
  }

  /**
   * @returns latest version number from ddragon
   */
  getLatestVersion() {
    return this.http
      .get(Config.ddragonURL + '/api/versions.json')
      .pipe(catchError(this.handleErrors));
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error));
    return throwError(error);
  }
}
