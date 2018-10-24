import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { environmentLoader as environmentLoaderPromise } from './environments/environment-loader';

environmentLoaderPromise.then(env => {
  if (env.production) {
    enableProdMode();
    if (window) {
      window.console.log = function () { };
    }
  }

  environment.production = env.production;
  environment.baseUrl = env.baseUrl;
  environment.baseAPIUrl = env.baseAPIUrl;
  environment.githubAuth = env.githubAuth;
  environment.localStorageJWT = env.localStorageJWT;
  localStorage.setItem("APP_SETTINGS", JSON.stringify(environment));

  platformBrowserDynamic().bootstrapModule(AppModule);
});
