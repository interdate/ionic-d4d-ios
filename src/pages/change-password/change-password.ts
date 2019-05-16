import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';


/*
 Generated class for the ChangePassword page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-change-password',
    templateUrl: 'change-password.html'
})
export class ChangePasswordPage {

    form: { oldPassword: {value: any, label: any},
        password: {second: {value: any}, first: {value: any, label: any}},
        submit: {value: any, label: any} } =
    {
        oldPassword: {value: '', label: ''},
        password: {second: {value: ''}, first: {value: '', label: ''}},
        submit: {value: '', label: ''}
    }

    oldPassword: any;
    first_pass: any;
    second_pass: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public toastCtrl: ToastController) {

        this.api.http.post(api.url + '/passwords', '', api.header).subscribe(data => {
            this.form = data.json().form;
            console.log('FORM DATA', data.json().form);
        });
    }

    formSubmit() {
        this.oldPassword = '';
        this.first_pass = '';
        this.second_pass = '';
        var params = JSON.stringify({
            oldPassword: this.form.oldPassword.value,
            password: {
                first: this.form.password.first.value,
                second: this.form.password.second.value
            }
        });

        this.api.http.post(this.api.url + '/passwords', params, this.api.header).subscribe(data => this.validate(data.json()));
    }

    validate(response) {

        this.oldPassword = response.error.oldPassword ? response.error.oldPassword : '';
        if(response.error.password) {
            this.first_pass = response.error.password.first ? response.error.password.first : '';
            this.second_pass = response.error.password.second ? response.error.password.second : '';
        }

        if (response.changed == true) {

            this.api.setStorageData({label: 'password', value: this.form.password.first.value});
            this.api.setHeaders(true, false, this.form.password.first.value);

            const toast = this.toastCtrl.create({
                message: response.texts.success,
                showCloseButton: true,
                closeButtonText: 'Ok'
            });
            toast.present();
        }

        this.form.password.first.value = "";
        this.form.password.second.value = "";
        this.form.oldPassword.value = "";
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangePasswordPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'ChangePasswordPage';
    }
}
