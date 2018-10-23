import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { environmentLoader } from './environments/environment-loader';

// import { environmentLoader as environmentLoaderPromise } from './environments/environment-loader';
environmentLoader.then(env => {
  if (env.production) {
    enableProdMode();
  }
  environment.baseUrl = env.baseUrl;
  environment.baseAPIUrl = env.baseAPIUrl;
  environment.githubAuth = env.githubAuth;
  environment.localStorageJWT = env.localStorageJWT;

  platformBrowserDynamic().bootstrapModule(AppModule);
});
