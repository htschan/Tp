import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  title: String = ' ';

  constructor(public events: Events, public navCtrl: NavController) {
    events.subscribe('title:updated', (data) => {
      if (data.menuState) {
        this.title = "Projects";
      } else {
        this.title = ' ';
      }
    });
  }
}
