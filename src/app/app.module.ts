import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { navigatableComponents } from './app.routes';
import { ChampionService } from './shared/champions/champions.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {default as EN }from './i18n/en';
import {default as KO } from './i18n/ko';

@NgModule({
  declarations: [AppComponent, ...navigatableComponents],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
    }),
  ],
  providers: [ChampionService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setTranslation('en', EN);
    translate.setTranslation('ko', KO);
  }
}
