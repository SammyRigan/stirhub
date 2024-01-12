/* eslint-disable max-len */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserProfile } from '../models/models';
import { AuthService } from '../services/auth.service';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {


  email: string = null;
  password: string;
  passType = 'password';

  view = 'login';

  subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private generalService: GeneralService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

  checkEmail() {
    if (this.email) {
      const em = this.email?.replace(/\s+/g, '');
      if (em.length > 0 && em.includes('@') && em.includes('.')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  removeSpace() {
    this.email = this.email?.trim();
    this.email = this.email?.replace(/\s+/g, '');
  }

  // LOGIN
  login() {
    if (!this.email || !this.password) {
      return;
    }
    if (!this.checkEmail()) {
      this.showError('Sorry, invalid email. Check email and try again!');
      return;
    }
    this.loadingCtrl.create({
      message: 'Logging in',
      spinner: 'crescent'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.authService.login(this.email, this.password)
      .then(() => {
        loadingEl.message = 'Fetching profile';
        this.router.navigateByUrl('/');
        loadingEl.dismiss();
      })
      .catch(err => {
        console.log(err.code);
        let message: string;
        switch (err.code) {
          case 'auth/user-not-found':
            message = 'Oops user was not found!';
            break;

          case 'auth/missing-email':
            message = 'Kindly enter an email to login';
            break;

          case 'auth/invalid-email':
            message = 'Sorry, your email does not exist. Kindly check it and try again.';
            break;

          case 'auth/internal-error':
            message = 'Kindly check password and try again';
            break;

          case 'auth/wrong-password':
            message = 'You entered a wrong password. Kindly check it and try again.';
            break;

          case 'auth/network-request-failed':
            message = 'We are unable to connect to your network. Please check your internet connectivity and try again.';
            break;

          default:
            // eslint-disable-next-line max-len
            message = 'Sorry, we are unable to log you in at the moment. Please try again later. Contact support if this persists';
            break;
        }
        loadingEl.dismiss();
        this.showError(message);
      });
    });
  }

  async showError(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async resetPass() {
    if (!this.email || !this.email.trim()) {
      return;
    }
    if (!this.checkEmail()) {
      this.showError('Sorry, invalid email. Check it and try again!');
      return;
    }
    // const loading = await this.loadingCtrl.create();
    // await loading.present();
    // await this.authService.resetPassword(this.email);
    // await this.showError('A password reset link has been sent to your email account. Follow the instructions there to reset your password.');
    // loading.dismiss();
    this.loadingCtrl.create()
    .then(loadingEl => {
      loadingEl.present();
      this.authService.resetPassword(this.email)
      .then(() => {
        this.view = 'login';
        this.showError('A password reset link has been sent to your email account. Follow the instructions there to reset your password.');
        loadingEl.dismiss();
      })
      .catch(err => {
        console.log(err.code);
        let message: string;
        switch (err.code) {
          case 'auth/user-not-found':
            message = 'Oops user was not found!';
            break;

          case 'auth/invalid-email':
            message = 'Sorry, your email does not exist. Kindly check it and try again.';
            break;

          case 'auth/network-request-failed':
            message = 'We are unable to connect to your network. Please check your internet connectivity and try again.';
            break;

          default:
            message = 'Sorry, we are unable to log you in at the moment. Please try again later. Contact support if this persists';
            break;
        }
        loadingEl.dismiss();
        this.showError(message);
      });
    });
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

}
