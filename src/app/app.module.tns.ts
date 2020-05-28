import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { routes, navigatableComponents } from './app.routes';

// Uncomment and add to NgModule imports if you need to use two-way binding
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { ChampionService } from './shared/champions/champions.service';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { BuildService } from './shared/build/build.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NativeScriptLoader } from '@danvick/ngx-translate-nativescript-loader';

import { default as EN } from './i18n/en';
import { default as KO } from './i18n/ko';

export function createTranslateLoader() {
  return new NativeScriptLoader("./i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, ...navigatableComponents],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader
      }
  })
  ],
  providers: [ChampionService, BuildService],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setTranslation('en', EN);
    translate.setTranslation('ko', KO);
  }
}
