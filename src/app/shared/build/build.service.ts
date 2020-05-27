import { Injectable } from '@angular/core';
import * as ItemBuild from '../../../assets/data/item-build.json';

@Injectable({
  providedIn: 'root'
})
export class BuildService {
  concepts = [
    'crit',
    'attackSpeed',
    'lifeSteal',
    'tank',
    'movementSpeed',
    'armorPen',
    'onlyConsumable',
    'onlyIE',
  ];

  itemBuild = ItemBuild;

  lane = ['top', 'mid', 'adc', 'support', 'jungle'];

  constructor() {}

  getRandomConcept(): string {
    let rand = Math.floor(Math.random() * this.concepts.length);
    return this.concepts[rand];
  }

  /**
   * @param concept {string} build concept
   * @return item build in array
   */
  getItemBuild(concept): [] {
    return this.itemBuild[concept];
  }

  getRandomLane(): string {
    let rand = Math.floor(Math.random() * this.lane.length);
    return this.lane[rand];
  }
}
