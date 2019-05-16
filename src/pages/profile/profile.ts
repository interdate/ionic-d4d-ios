import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Nav, ToastController, Content, Events} from 'ionic-angular';
import {FullScreenProfilePage} from '../full-screen-profile/full-screen-profile';
import {DialogPage} from '../dialog/dialog';
import {ApiQuery} from '../../library/api-query';

/*
 Generated class for the Profile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

import * as $ from "jquery";

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {
    @ViewChild(Content) content: Content;
    @ViewChild(Nav) nav: Nav;

    isAbuseOpen: any = false;

    user: any = {
        id: '',
        isAddFavorite: '',
        userId: '',
        isBlackListed: false,
        nickName: '',
        about: {label: ''},
        photos: '',
        photo: '',
        url: '',
        region: '',
        sexPreference: '',
        mainImage: {url: ''},
    };

    texts: any = {lock: '', unlock: ''};

    formReportAbuse: any =
    {title: '', buttons: {cancel: '', submit: ''}, text: {label: '', name: '', value: ''}};

    myId: any = false;

    constructor(public toastCtrl: ToastController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public events: Events) {
        //this.api.showLoad();

        var user = navParams.get('user');

        if (user) {

            this.user = user;

            this.api.http.get(api.url + '/user/profile/' + this.user.id, api.setHeaders(true)).subscribe(data => {
                this.user = data.json();
                this.api.hideLoad();
            });
        } else {
            this.api.storage.get('user_id').then((val) => {

                if (val) {
                    this.myId = val;
                    this.user.id = val;
                    this.api.http.get(api.url + '/user/profile/' + this.user.id, api.setHeaders(true)).subscribe(data => {
                        this.user = data.json();
                        this.api.hideLoad();
                    });
                }
            });
        }
        this.api.showFooter = true;
    }

    back() {
        this.navCtrl.pop();
    }

    ionViewCanEnter() {
        this.api.showFooter = true;
        this.api.pageName = 'profile';
    }

    scrollToBottom() {
        this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 300);
    }

    addFavorites() {

        let message, url;
        if (this.user.isAddFavorite == false) {
            this.user.isAddFavorite = true;
            message = this.user.nickName + ' has been added to Favorites';
            url = this.api.url + '/user/favorites/' + this.user.userId;
        }else{
            this.user.isAddFavorite = false;
            message = this.user.nickName + ' has been removed from your Favorites';
            url = this.api.url + '/user/favorites/' + this.user.userId + '/delete';
        }
        let toast = this.toastCtrl.create({
            message: message,
            duration: 2000
        });

        toast.present();

        let params = JSON.stringify({
            list: 'Favorite'
        });

        this.api.http.post(url, params, this.api.setHeaders(true)).subscribe(data => {
            this.events.publish('statistics:updated');
        });
    }

    blockSubmit() {
        let url, message;
        if (this.user.isBlackListed == true) {
            this.user.isBlackListed = false;
            url = this.api.url + '/user/blacklist/' + this.user.userId+'/delete';
            message = 'The user has been removed from your black list';
        } else {
            this.user.isBlackListed = true;
            url = this.api.url + '/user/blacklist/' + this.user.userId;
            message = 'The user has been added to your black list';
        }


        this.api.http.post(url, {}, this.api.setHeaders(true)).subscribe(data => {
            let toast = this.toastCtrl.create({
                message: message,
                duration: 2000
            });

            toast.present();

        });
    }

    addLike(user) {
        user.isAddLike = true;
        let toast = this.toastCtrl.create({
            message: user.nickName + ' ' + 'has been liked',
            duration: 2000
        });

        toast.present();

        this.api.http.post(this.api.url + '/user/like/' + user.userId, {}, this.api.setHeaders(true)).subscribe(data => {
            console.log(data);
        });

    }

    fullPagePhotos() {
        this.navCtrl.push(FullScreenProfilePage, {
            user: this.user
        });
    }

    toDialog(user) {
        this.navCtrl.push(DialogPage, {
            user: { id: user.userId, nickName: user.nickName, mainImage: { url: user.mainImage.url } }
        });
    }

    reportAbuseShow() {
        this.isAbuseOpen = true;
        this.scrollToBottom();
    }

    reportAbuseClose() {
        this.isAbuseOpen = false;
        this.formReportAbuse.text.value = "";
    }

    abuseSubmit() {

        let params = JSON.stringify({
            abuseMessage: this.formReportAbuse.text.value,
        });

        this.api.http.post(this.api.url + '/user/abuse/' + this.user.userId, params, this.api.setHeaders(true)).subscribe(data => {

            let toast = this.toastCtrl.create({
                message: 'Thank you. The message has been sent',
                duration: 2000
            });

            toast.present();
        });
        this.reportAbuseClose();
    }

    ionViewWillEnter() {
        this.api.pageName = 'ProfilePage';
    }

}
