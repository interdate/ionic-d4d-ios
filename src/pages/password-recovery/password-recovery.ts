import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
/*
 Generated class for the PasswordRecovery page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-password-recovery',
    templateUrl: 'password-recovery.html'
})
export class PasswordRecoveryPage {

    form: { form: any } = {form: {email: {}, _token: {}}};

    email_err: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public toastCtrl: ToastController) {
    }


    formSubmit() {

        var data = JSON.stringify({userEmail: this.form.form.email.value});

        this.api.http.post(this.api.url + '/user/passwordRecovery', data, this.api.header).subscribe(data => this.validate(data.json()));
    }

    validate(response) {

        this.email_err = "";

        if (response.success) {

            console.log('Response');


            this.form.form.email.value = "";
            const toast = this.toastCtrl.create({
                message: 'Your password was reset. Please check your e-mail',
                showCloseButton: true,
                closeButtonText: 'Ok'
            });
            toast.present();
        } else {
            this.email_err = 'Incorrect Email';
        }
    }

    ionViewWillEnter() {
        this.api.pageName = 'PasswordRecoveryPage';
    }
}
