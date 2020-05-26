import { Routes } from '@angular/router';

import { RandomChampComponent } from "./random-champ/random-champ.component";
import { ImageWithLoadingComponent } from './image-with-loading/image-with-loading.component';
import { AllRandomComponent } from './all-random/all-random.component';

export const routes: Routes = [
  { path: '', redirectTo: 'random-champ', pathMatch: 'full' },
  { path: 'random-champ', component: RandomChampComponent },
  { path: 'all-random', component: AllRandomComponent },
];

export const navigatableComponents = [
  RandomChampComponent,
  ImageWithLoadingComponent,
  AllRandomComponent
];