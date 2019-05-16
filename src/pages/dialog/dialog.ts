import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ToastController, Content} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {ProfilePage} from '../profile/profile';
import {SubscriptionPage} from '../subscription/subscription';
import {Keyboard} from '@ionic-native/keyboard';
/*
 Generated class for the Dialog page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

import * as $ from "jquery";

@Component({
    selector: 'page-dialog',
    templateUrl: 'dialog.html',
})

export class DialogPage {
    @ViewChild(Content) content: Content;

    user: any;
    users: any;
    texts: any = {a_conversation_with: '', title: ''};
    message: any = '';
    messages: any;
    checkChat: any;
    userHasFreePoints: any;
    browser: any;
    reciver_id: any;
    contactCurrentReadMessagesNumber: any;
    keyboard: Keyboard;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public api: ApiQuery) {

        this.user = navParams.get('user');
        this.reciver_id = this.user.id;
        this.getPage(this.user.id);
    }

    ionViewCanEnter() {
        this.api.showFooter = false;
        this.api.pageName = 'dialog';
    }




    getPage(user_id) {

        this.api.http.get(this.api.url + '/user/chat/' + user_id, this.api.setHeaders(true)).subscribe(data => {
            this.messages = data.json().chat.items.reverse();
            if (data.json().chat.abilityReadingMessages == 1) {
                var arrMsg = [];
                for (var _i = 0; _i < this.messages.length; _i++) {
                    if (this.messages[_i].isRead == 0 && this.messages[_i].from == user_id) {
                        arrMsg.push(this.messages[_i].id);
                    }
                }

                this.setMessagesAsRead(arrMsg);
            }
            this.user = data.json().user;
            this.contactCurrentReadMessagesNumber = data.json().contactCurrentReadMessagesNumber;
            this.userHasFreePoints = data.json().chat.userHasFreePoints;
            this.scrollToBottom();
        });
    }

    setMessagesAsRead(unreadMessages) {
        let params = JSON.stringify({
            unreadMessages: unreadMessages
        });
        this.api.http.post(this.api.url + '/user/messenger/setMessagesAsRead', params, this.api.setHeaders(true)).subscribe(data => {
        });
    }


    useFreePointToReadMessage(message) {

        let index = this.api.functiontofindIndexByKeyValue(this.messages, 'id', message.id);
        this.api.http.get(this.api.url + '/user/chat/useFreePointToReadMessage/' + message.id, this.api.setHeaders(true)).subscribe(data => {
            this.messages[index].text = data.json().messageText;
            this.setMessagesAsRead([message.id]);
            if (!data.json().userHasFreePoints) {
                // Update page
                this.getPage(this.reciver_id);
            }
        });
    }

    scrollToBottom() {
        this.content.scrollTo(0, 999999, 300);
    }

    subscription() {
        this.api.storage.get('user_id').then((user_id) => {
            this.navCtrl.push(SubscriptionPage);
        });

    }

    back() {
        this.navCtrl.pop();
        this.api.showFooter = true;
        setTimeout(function () {
            $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
        }, 500);
    }

    sendMessage() {

        if (this.message.length > 0) {
            this.messages.push({id: "", isRead: "2", text: this.message, date: '', time: '', from: 1});

            var params = JSON.stringify({
                message: this.message
            });


            this.api.http.post(this.api.url + '/user/chat/' + this.reciver_id, params, this.api.setHeaders(true)).subscribe(data => {
                this.message = '';
                let mess = data.json().chat.items;
                if (mess) {
                    //mess.text = this.message;
                    this.messages = mess.reverse();
                    if (data.json().sent) {
                        this.sendPush();
                        this.scrollToBottom();
                    }
                } else {
                    let toast = this.toastCtrl.create({
                        message: data.json().errorMessage,
                        duration: 5000
                    });
                    toast.present();
                }

                if (data.json().sent == false) {
                    let toast = this.toastCtrl.create({
                        message: 'Message was not sent. You\'re in this user blocked list',
                        duration: 5000
                    });
                    toast.present();
                }

            }, err => {
                alert(JSON.stringify(err));
                this.sendMessage();
            });
        }
    }

    sendPush() {
        this.api.http.post(this.api.url + '/user/push/' + this.reciver_id, {}, this.api.setHeaders(true)).subscribe(data => {
            console.log('PUSH', data);

        }, err => {
            alert(JSON.stringify(err));
        });
    }

    getNewMessages() {

        this.api.http.get(this.api.url + '/user/chat/' + this.reciver_id + '/' + this.contactCurrentReadMessagesNumber + '/refresh', this.api.setHeaders(true)).subscribe(data => {
            this.contactCurrentReadMessagesNumber = data.json().contactCurrentReadMessagesNumber;
            if (data.json().chat) {
                this.messages = data.json().chat.items.reverse();
                if (data.json().chat.abilityReadingMessages == 1) {
                    var arrMsg = [];
                    for (var _i = 0; _i < this.messages.length; _i++) {
                        if (this.messages[_i].isRead == 0 && this.messages[_i].from == this.reciver_id) {
                            arrMsg.push(this.messages[_i].id);
                        }
                    }

                    this.setMessagesAsRead(arrMsg);
                }
                this.userHasFreePoints = data.json().chat.userHasFreePoints;
                this.scrollToBottom();
            }
        }, err => {
            alert(JSON.stringify(err));
        });
    }

    readMessagesStatus() {
        for (let i = 0; i < this.messages.length; i++) {
            this.messages[i].isRead = 1;
        }
    }

    ionViewWillLeave() {

        // enable the root left menu when leaving the tutorial page
        //this.app.getComponent('leftMenu').enable(true);
        clearInterval(this.checkChat);
    }

    toProfilePage() {
        this.navCtrl.push(ProfilePage, {
            user: {id: this.reciver_id}
        });
    }

    ionViewDidLoad() {
        // this.scrollToBottom();
        var that = this;
        this.checkChat = setInterval(function () {
            that.getNewMessages();
        }, 10000);

        $('button').click(function () {
            // clean textareaa after submit
            $('textarea').val('');
        });
    }

    ionViewWillEnter() {
        this.api.pageName = 'DialogPage';
    }
}