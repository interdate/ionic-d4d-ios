import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {DialogPage} from '../dialog/dialog';
import {ArenaPage} from '../arena/arena';

/*
 Generated class for the Notifications page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html'
})
export class NotificationsPage {
    like: string = 'like';
    tabs: string = this.like;
    bingo: string = 'bingo';
    users: any;
    imagePath: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery
    ) {

        this.getPage();

    }

    getPage() {
        this.api.http.get(this.api.url + '/user/likes/notifications', this.api.setHeaders(true)).subscribe(data => {
            this.users = data.json().likesNotifications.items;
            this.imagePath = data.json().likesNotifications.imagesStoragePath;
        });
    }

    toDialog(user) {

        let bingo = user.bingo;
        this.api.http.post(this.api.url + '/user/notification/' + user.id + '/read', {}, this.api.setHeaders(true)).subscribe(data => {


            if (bingo == 1) {
                this.navCtrl.push(DialogPage, {
                    user: {id: user.userId, nickName: user.nickName}
                });
            } else if (bingo == 0) {
                this.navCtrl.push(ArenaPage, {
                    user: user.userId,
                    notification: user.id
                });
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationsPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'NotificationsPage';
    }
}
