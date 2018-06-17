import { Component, OnInit, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth/auth.service';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { ProfilePage } from '../pages/profile/profile';
import { RegisterPage } from '../pages/register/register';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Home', name: 'TabsPage', component: TabsPage, tabComponent: HomePage, index: 0, icon: 'home' },
    { title: 'About', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 1, icon: 'information-circle' },
    { title: 'Contact', name: 'TabsPage', component: TabsPage, tabComponent: ContactPage, index: 2, icon: 'contacts' },
    { title: 'Profil', name: 'TabsPage', component: TabsPage, tabComponent: ProfilePage, index: 3, icon: 'person' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Home', name: 'TabsPage', component: HomePage, icon: 'home' },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: RegisterPage, icon: 'person-add' }
  ];
  rootPage: any;
  title: string;
  menuToggleState: Boolean = false;

  constructor(
    public events: Events,
    public platform: Platform,
    public menu: MenuController,
    public storage: Storage,
    private auth: AuthService) {

    // decide which menu items should be hidden by current login status stored in local storage
    this.auth.getAuthenticated().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();
  }

  ngOnInit() {
    this.auth.getAuthenticated().then(authenticated => {
      console.log(`Authenticate: ${authenticated}`)
      this.rootPage = authenticated ? HomePage : LoginPage;
    });
  }

  updateTitles() {
    this.platform.width() < 768 ? this.menuToggleState = true : this.menuToggleState = false;
    this.events.publish('title:updated', { menuState: this.menuToggleState });
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    let chnav = this.nav.getActiveChildNavs();
    if (chnav && chnav.length > 0 && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.auth.logout();
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      // this.splashScreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }
}
