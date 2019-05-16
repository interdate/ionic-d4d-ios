import { Component } from '@angular/core';
import {Events, NavController, NavParams, ToastController} from 'ionic-angular';
import { DialogPage } from '../dialog/dialog';
import { ApiQuery } from '../../library/api-query';
/*
 Generated class for the FullScreenProfile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-full-screen-profile',
    templateUrl: 'full-screen-profile.html'
})
export class FullScreenProfilePage {

    user:any;
    myId:any;

    constructor(public toastCtrl:ToastController,
                public navCtrl:NavController,
                public navParams:NavParams,
                public api:ApiQuery,
                public events: Events) {

        this.user = navParams.get('user');

        this.api.storage.get('user_id').then((val) => {

            if (val) {
                this.myId = val;
            }
        });
    }

    goBack() {
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FullScreenProfilePage');
    }


    toDialog(user) {
        this.navCtrl.push(DialogPage, {
            user: { id: user.userId, nickName: user.nickName, mainImage: { url: user.mainImage.url } }
        });
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

    addLike(user) {
        user.isAddLike = true;
        let toast = this.toastCtrl.create({
            message: user.username + ' ' + ' liked',
            duration: 2000
        });

        toast.present();

        this.api.http.post(this.api.url + '/user/like/' + user.userId, {}, this.api.setHeaders(true)).subscribe(data => {
            console.log(data);
        });

    }

    ionViewWillEnter() {
        this.api.pageName = 'FullScreenProfilePage';
    }
}
