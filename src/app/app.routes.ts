import { Routes } from '@angular/router';

import { RandomChampComponent } from "./random-champ/random-champ.component";
import { ImageWithLoadingComponent } from './image-with-loading/image-with-loading.component';

export const routes: Routes = [
  { path: '', redirectTo: 'random-champ', pathMatch: 'full' },
  { path: 'random-champ', component: RandomChampComponent },
];

export const navigatableComponents = [
  RandomChampComponent,
  ImageWithLoadingComponent
];