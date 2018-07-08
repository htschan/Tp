import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';
import { AuthService } from '../../services/auth/auth.service';
import { AuthResponse } from "../../app/services/client-proxy";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  title: String = ' ';
  loading: Loading;
  registerCredentials = { "email": "hts@koch-it.ch", "password": "" };

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    events.subscribe('title:updated', (data) => {
      if (data.menuState) {
        this.title = "Projects";
      } else {
        this.title = ' ';
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public createAccount() {
    this.navCtrl.push(RegisterPage);
  }

  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials.email, this.registerCredentials.password).subscribe(data => {
      if (data instanceof AuthResponse && data.status.success) {
        setTimeout(() => {
          this.loading.dismiss();
          this.navCtrl.setRoot(TabsPage)
        });
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
        this.loading.dismiss();
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

}
