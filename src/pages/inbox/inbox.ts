import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {DialogPage} from '../dialog/dialog';
import {ApiQuery} from '../../library/api-query';

import * as $ from "jquery";

/*
 Generated class for the Inbox page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-inbox',
    templateUrl: 'inbox.html'
})
export class InboxPage {

    users: any;
    texts: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery) {


        this.api.http.get(this.api.url + '/user/contacts', this.api.setHeaders(true)).subscribe(data => {
            this.users = data.json().allChats;
            $(document).ready(function () {
                $("page-inbox .counter").each(function (index) {
                    if ($(this).text().length > 2) {
                        $(this).css({'font-size': '10px'});
                    }
                });
            }, err => {
                alert(JSON.stringify(err));
            });
        })
    }

    toDialogPage(user) {
        this.navCtrl.push(DialogPage, {user: {'id': user.user.userId}});
    }

    ionViewWillEnter() {
        this.api.pageName = 'InboxPage';
    }
}
