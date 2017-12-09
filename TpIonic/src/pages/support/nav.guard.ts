import { AuthService } from "../../services/auth/auth.service";
import { ModalController, AlertController } from "ionic-angular";
import { LoginPage } from "../login/login";


export class NavGuard {
    _guardCandidate = true;
    constructor(
        public auth: AuthService,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController) {
    }

    async ionViewCanEnter() {
        let loggedIn = await this.auth.getAuthenticated();
        if (loggedIn) {
            return true;
        }
        this.login();
        return false; // return always false, in order to not enter page
    }

    async login() {
        return new Promise<boolean>((resolve, reject) => {
            let modal = this.modalCtrl.create(LoginPage);
            modal.present();
            modal.onDidDismiss(data => {
                resolve(data);
            });
        });
    }

  // ionViewWillEnter() {
  //   this.auth.getAuthenticated().then(loggedIn => {
  //     if (!loggedIn) {
  //       let modal = this.modalCtrl.create(LoginPage);
  //       modal.onDidDismiss(data => {
  //         if (data === false) {
  //           this.navCtrl.pop();
  //         }
  //       });
  //       modal.present();
  //     } else {
  //       if ( this.cosmi.selectedCandidate === undefined){
  //         this.presentAlert();
  //         this.navCtrl.pop();
  //       }
  //     }

  //   })
  // }

}