import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Champion } from './champions.model';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Config } from '../config';

import * as ChampionData from './ddragon.champion.json';

@Injectable({
  providedIn: 'root',
})
export class ChampionService {
  championData: any; //object that contains all champion data
  latestVersion = ChampionData.version;

  constructor(private http: HttpClient) {
    this.championData = ChampionData.data;
    this.getLatestVersion().subscribe((resp) => {
      this.latestVersion = resp[0];
      // compare version if mismatch, update this.championData from the server
      if (
        parseInt(this.latestVersion, 10) === parseInt(ChampionData.version, 10)
      ) {
        console.log('latest version!');
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

  // load champion json file
  getChampionData() {}

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
