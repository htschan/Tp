import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
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
