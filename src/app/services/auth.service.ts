import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { LoadingController } from '@ionic/angular';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private dataService: DataService,
    private loadingCtrl: LoadingController
  ) { }

  // SIGNUP
  async signUp(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // LOGIN
  async login(email: string, password: string) {
    const ref = await this.auth.signInWithEmailAndPassword(email, password);
    this.dataService.updateUserId(ref.user.uid);
    return ref;
  }

  // LOGOUT
  async logout() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    await this.auth.signOut();
    this.dataService.logOut();
    this.router.navigateByUrl('/auth');
    loading.dismiss();
  }

  // RESET PASSWORD
  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }
}
