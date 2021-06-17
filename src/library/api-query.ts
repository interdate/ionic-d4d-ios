import {Component} from '@angular/core';
import {Headers, RequestOptions, Http} from '@angular/http';
import {AlertController, LoadingController, ToastController, ModalController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {DomSanitizer} from '@angular/platform-browser';
import {Geolocation} from "@ionic-native/geolocation";

@Component({
    templateUrl: 'api.html'
})
export class ApiQuery {

    public url: any;
    public header: RequestOptions;
    public response: any;
    public showFooter: any = true;
    public pageName: any = false;
    public banner: any;
    public username: any = 'nologin';
    public password: any = 'nopass';
    public storageRes: any;
    public version: any = 110;
    public signupData: any;
    public loading: any;
    public iosVersion: any;
    public is_payed: any = 0;
    public register: any = { status: false, text: 'Thank you for your registration at dating4disabled.com. ' +
            'A confirmation mail has been sent to your e-mail.' +
            'Please confirm your registration so you will be able to join our online community.' +
            'If for some reason you don\'t see this email, please check your spam folder.'};

    constructor(public storage: Storage,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public http: Http,
                public modalCtrl: ModalController,
                private geolocation: Geolocation,
                private sanitizer: DomSanitizer) {

        //this.url = 'http://localhost:8101';
        this.url = 'https://m.dating4disabled.com/api/v7';
        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });
        this.storage = storage;
    }


    setLocation() {

        this.geolocation.getCurrentPosition().then((pos) => {
            var params = JSON.stringify({
                latitude: ''+pos.coords.latitude+'',
                longitude: ''+pos.coords.longitude+''
            });

            if(this.password){
                this.http.post(this.url + '/user/location', params, this.setHeaders(true)).subscribe(data => {
                });
            }
        });
    }


    presentToast(txt, duration = 3000) {
        let toast = this.toastCtrl.create({
            message: txt,
            duration: duration,
        });

        toast.present();
    }

    showLoad(txt = 'Please wait...') {
        if (this.isLoaderUndefined()) {
            this.loading = this.loadingCtrl.create({
                content: txt
            });

            this.loading.present();
        }
    }

    hideLoad() {
        if (!this.isLoaderUndefined())
            this.loading.dismiss();
        this.loading = undefined;
    }

    isLoaderUndefined(): boolean {
        return (this.loading == null || this.loading == undefined);
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
        for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return null;
    }

    sendPhoneId(idPhone) {
        let data = JSON.stringify({deviceId: idPhone});
        this.http.post(this.url + '/user/deviceId/OS:IOS', data, this.setHeaders(true)).subscribe(data => {
            //alert(JSON.stringify(data));
            console.log('sendPhoneId: ', data.json());
        }, err => {
            //this.storage.remove('status');
            //alert(JSON.stringify(err));
        });
    }

    setUserData(data) {
        this.setStorageData({label: 'username', value: data.username});
        this.setStorageData({label: 'password', value: data.password});
    }

    setStorageData(data) {
        this.storage.set(data.label, data.value);
    }

    getUserData() {
        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });
        return {username: this.username, password: this.password}
    }

    safeHtml(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    setHeaders(is_auth = false, username = false, password = false, register = "0") {

        if (username !== false) {
            this.username = username;
        }

        if (password !== false) {
            this.password = password;
        }

        let myHeaders: Headers = new Headers;

        myHeaders.append('Content-type', 'application/json');
        myHeaders.append('Accept', '*/*');
        myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders.append("appVersion", this.version);

        if (is_auth == true) {
            myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
        }
        myHeaders.append("register", register);


        this.header = new RequestOptions({
            headers: myHeaders
        });
        return this.header;
    }

    ngAfterViewInit() {

        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });
    }
}
