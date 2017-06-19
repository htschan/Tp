

npm install -g cordova ionic

ionic start --v2 myApp tabs

cd myApp
ionic serve

# Creating a PWA using Ionic

http://blog.ionic.io/announcing-pwa-support-in-ionic-2/

# Deploying and Debugging

`$ ionic platform add browser`

`$ ionic build browser`

To run it locally on a browser with a static file server on prot 8000:

`$ ionic run browser`


You can host the folder platforms\browser\www on a webserver like IIS. Be aware that rebuilding the app requires IIS to be stopped.

Use your mobile device or any other device with a browser to test and debug the application.

When hosting on your Windows 10 Desktop, make sure you open the appropriate port, e.g. port 3000 for NodeJS hosting and don't forget to restart windows after changing firewall settings.



# Ionic Split-Pane

Ionic Sample:
https://github.com/driftyco/ionic-conference-app

..and some fixes by Chris Griffith
https://chrisgriffith.wordpress.com/2017/03/21/ionic-split-pane-part-2/



http://www.joshmorony.com/building-a-crud-ionic-2-application-with-firebase-angularfire/

$ npm install @ionic/app-scripts@latest --save-dev

$ npm install @types/request@0.0.30 --save-dev --save-exact


Configuration Sample Auth0 here:
https://auth0.com/docs/quickstart/native/ionic2


# CORS and local debugging with ASP.NET Core

Use the Ionic proxy.
Refer to file ionic.project




!!!!!!!!!!!!!!!
Error messages like "cannot find module ...."

https://github.com/driftyco/ionic/issues/8271

I found how to fix this issue (at least for my app, but maybe will be useful for somebody else).
I had components, services, interfaces folders inside the app folder. After moving them one level up (to src) and changing imports, build passed successfully.

@jgw96 in my case nothing was missed and everything was up to date. Please consider to mention in docs that Ionic can't work anymore with apps structure when components folder is inside of app.

!!!!!!!!!!!!!!

Install Auth0
npm install --save auth0-js@7.4
npm install --save auth0-lock@10
npm install --save-dev @types/auth0-js@7
npm install --save-dev @types/auth0-lock@10
