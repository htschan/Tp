import { Component } from '@angular/core';
import { Events, NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  title: String = ' ';
  createSuccess = false;
  registerCredentials = { email: '', password: '', firstName: '', lastName: '', location: '' };

  constructor(public events: Events, private nav: NavController, private auth: AuthService, private alertCtrl: AlertController) {
    events.subscribe('title:updated', (data) => {
      if (data.menuState) {
        this.title = "Projects";
      } else {
        this.title = ' ';
      }
    });
  }

  public register() {
    this.auth.register(this.registerCredentials).subscribe(response => {
      if (response) {
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
      error => {
        this.showPopup("Error creating account", JSON.stringify(error));
      });
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
