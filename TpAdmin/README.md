# Time Puncher Admin

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.21.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# angular-cli
Installation:
npm uninstall -g angular-cli
npm cache clean
npm install -g angular-cli@latest

ng new <projectname>
cd projectname
ng serve

# Material 2
Install material2 https://github.com/angular/material2/blob/master/GETTING_STARTED.md

npm install --save @angular/material

src/app/app.module.ts

import { MaterialModule } from '@angular/material';
// other imports 
@NgModule({
  imports: [MaterialModule.forRoot()],
  ...
})
export class PizzaPartyAppModule { }

npm install --save hammerjs 
npm install --save-dev @types/hammerjs

src/app/app.module.ts

import 'hammerjs';

Finally, you need to add hammerjs to the types section of your tsconfig.json file:

{
  "compilerOptions": {
    "types": [
      "hammerjs"
    ]
  }
}


src/index.html

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

# AngularFire
Install angularfire2 https://github.com/angular/angularfire2/blob/master/docs/1-install-and-setup.md

Prerequisite
npm install -g typings 
npm install -g typescript

# Update everything
In Administrator console run this:
```npm update --save```

# tinymce

Install tinymce https://www.tinymce.com/docs/integrations/angular2/

npm install --save tinymce

angular-cli.json

"scripts": [
  "../node_modules/tinymce/tinymce.js",
  "../node_modules/tinymce/themes/modern/theme.js",
  "../node_modules/tinymce/plugins/link/plugin.js",
  "../node_modules/tinymce/plugins/paste/plugin.js",
  "../node_modules/tinymce/plugins/table/plugin.js"
],




# Create service, componente

Goto base folder and create the path for the new item

ng g service ..\..\src\app\shared\services\product.service

Create the products path
ng g component ..\..\src\app\products.components



# Tips and Tricks

## RxJS 5 Operators by Example

https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35

## Why are there multiple instances of a service created ?

http://stackoverflow.com/questions/34929665/angularjs-2-multiple-instance-of-service-created

In case Angular doesn't know custom directives like md-input-containter
xxx.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

  schemas: [CUSTOM_ELEMENTS_SCHEMA]

## Remote Debugging with chrome

Create shortcut:
Target: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 http://localhost:4200 --new-window
Execute in: "C:\Program Files (x86)\Google\Chrome\Application"


# Hosting on Apache

So you would like to deploy your production build to an Apache2 server? You will notice then that

- reloading pages, besides root, and
- deep linking

will cause 404 errors (unless you are using the HashLocation strategy). The reason is that all Angular2 routes should be served via the index.html file.

This can be achieved by adding a src\.htaccess file (in the same directory where the index.html resides) with the following contents.

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

See also LocationStrategy here: https://angular.io/docs/ts/latest/guide/router.html#!#browser-url-styles

# Permanent redirection to https
Can also been done in .htaccess when hosting on Apache.

See https://wiki.apache.org/httpd/RewriteHTTPToHTTPS

# Install auth0-lock

```# npm install --save auth0-lock```
```# npm install --save-dev @types/auth0-lock```

```javascript
import Auth0Lock  from 'auth0-lock';

  // Configure Auth0
  lock = new Auth0Lock(myConfig.clientID, myConfig.domain, {});

  constructor(private router: Router) {
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      debugger;
      localStorage.setItem('id_token', authResult.idToken);
    });
  }
```