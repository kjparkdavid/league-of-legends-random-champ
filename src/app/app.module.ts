import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { navigatableComponents } from './app.routes';
import { ChampionService } from './shared/champions/champions.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { default as EN } from './i18n/en';
import { default as KO } from './i18n/ko';
import { BuildService } from './shared/build/build.service';

@NgModule({
  declarations: [AppComponent, ...navigatableComponents],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
    }),
    FontAwesomeModule,
  ],
  providers: [ChampionService, BuildService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setTranslation('en', EN);
    translate.setTranslation('ko', KO);
  }
}
