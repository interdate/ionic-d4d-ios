import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController, Events} from 'ionic-angular';
import {RegistrationOnePage} from '../registration-one/registration-one';
import {PasswordRecoveryPage} from '../password-recovery/password-recovery';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import {ApiQuery} from '../../library/api-query';
import {Http, Headers, RequestOptions} from '@angular/http';
/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    form: { errors: any, login: any } = {errors: {}, login: {username: {label: {}}, password: {label: {}}}};
    errors: any;
    header: RequestOptions;
    user: any = {id: '', name: ''};


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public api: ApiQuery,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public events: Events) {

        if (navParams.get('page') && navParams.get('page')._id == "logout") {
            this.api.setHeaders(false, null, null);
            // Removing data storage
            this.api.storage.remove('status');
            this.api.storage.remove('password');
            this.api.storage.remove('user_id');
            this.api.storage.remove('user_photo');
            this.api.is_payed = 0;


            this.api.storage.get('deviceToken').then((deviceToken) => {
             this.api.storage.clear();
             this.api.storage.set('deviceToken', deviceToken);
             });

        }else if(navParams.get('user')){
            this.api.storage.get('user_id').then((val) => {
                this.api.storage.get('username').then((username) => {
                    this.form.login.username.value = username;
                });
                this.api.storage.get('password').then((password) => {
                    this.form.login.password.value = password;
                    //this.formSubmit();
                });

            });
        }
    }

    formSubmit() {

        this.form.login.username.value = this.user.name;
        let username = this.form.login.username.value;
        let password = this.form.login.password.value;

        if (username == "") {
            username = "nologin";
        }

        if (password == "") {
            password = "nopassword";
        }

        this.api.showLoad();

        this.http.get(this.api.url + '/user/login', this.setHeaders()).subscribe(data => {
                this.validate(data.json());

                this.api.hideLoad();
            },
            err => {
                this.errors = err._body;
                this.api.storage.remove('status');
                console.log(this.errors);
                this.api.hideLoad();
            });
    }

    setHeaders() {
        let myHeaders: Headers = new Headers;
        myHeaders.append('Content-type', 'application/json');
        myHeaders.append('Accept', '*/*');
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append("Authorization", "Basic " + btoa(this.form.login.username.value + ':' + this.form.login.password.value));
        myHeaders.append("appVersion", this.api.version);
        this.header = new RequestOptions({
            headers: myHeaders
        });
        return this.header;
    }

    validate(response) {

        if (response.userId) {
            this.api.is_payed = response.isPayed;
            this.api.storage.set('username', this.form.login.username.value);
            this.api.storage.set('password', this.form.login.password.value);
            this.api.storage.set('status', 'login');
            this.api.storage.set('user_id', response.userId);
            this.api.storage.set('user_photo', response.photo);

            this.api.setHeaders(true, this.form.login.username.value, this.form.login.password.value);
            var that = this;
            setTimeout(function () {
                that.events.publish('checkPayment:updated');
            },700);


            this.navCtrl.push(HelloIonicPage, {
                params: 'login',
                username: this.form.login.username.value,
                password: this.form.login.password.value
            });

            this.api.storage.get('deviceToken').then((deviceToken) => {
                this.api.sendPhoneId(deviceToken);
            });
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    onRegistrationPage() {
        console.log("register");
        this.navCtrl.push(RegistrationOnePage);

    }

    onPasswordRecoveryPage() {
        this.navCtrl.push(PasswordRecoveryPage);
    }

    ionViewWillEnter() {
        this.api.pageName = 'LoginPage';
    }
}

