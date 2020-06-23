import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, Events} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {ProfilePage} from '../profile/profile';
import {DialogPage} from '../dialog/dialog';

import * as $ from "jquery";

@Component({
    selector: 'page-hello-ionic',
    templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {

    list: any;
    action: any;
    offset: any;
    sort: any = '';
    page_counter: any;
    per_page: any = 20;
    user_counter: any = 20;
    loader: any = true;
    public loadMoreResults: any = false;
    /*username: any;
     password: any;*/
    blocked_img: any = false;
    get_params: any =
    {
        action: 'online',
        list: '',
        search: {countryCode: '', nickName: '', regionCode: '', ageFrom: '', ageTo: '', disability: ''}
    };
    url: any = false;

    users: any;
    params: any = {action: 'online', page: 1, list: ''};

    constructor(public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public events: Events) {

        this.api.showFooter = true;


        this.api.storage.get('username').then((username) => {
            //this.username = username;
            this.api.storage.get('password').then((password) => {
                this.api.setHeaders(true, username, password);

                if (this.navParams.get('params') && this.navParams.get('params') != 'login') {
                    this.get_params = this.navParams.get('params');
                    this.get_params = JSON.parse(String(this.get_params));
                    this.params.list = this.get_params.list;
                }

                this.page_counter = 1;

                this.getUsers(true);

                if(!navParams.get('params') || navParams.get('params') == 'login'){
                    //this.api.setLocation();
                }
            });
        });

    }

    itemTapped(user) {

        this.navCtrl.push(ProfilePage, {
            user: user
        });
    }

    toDialog(user) {
        this.navCtrl.push(DialogPage, {
            user: user
        });
    }

    addLike(user) {

        if (user.isAddLike == false) {

            user.isAddLike = true;

            let toast = this.toastCtrl.create({
                message: 'You liked ' + user.nickName,
                duration: 2000
            });

            toast.present();

            let params = JSON.stringify({
                toUser: user.id,
            });
            this.api.http.post(this.api.url + '/user/like/' + user.id, params, this.api.setHeaders(true)).subscribe();
        }
    }

    block(user, bool) {

        let toast, url, message;

        if (bool == true) {
            user.isBlackListed = true;
            url = this.api.url + '/user/favorites/' + user.id + '/delete';
            message = user.nickName + ' has been removed from your Favorites';
        }

        if (bool == false) {

            user.isBlackListed = false;

            url = this.api.url + '/user/blacklist/' + user.id + '/delete';
            message = user.nickName + ' has been removed from your black list';

        }
        toast = this.toastCtrl.create({
            message: message,
            duration: 2000
        });
        toast.present();
        // Remove user from list
        this.users.splice(this.users.indexOf(user), 1);
        this.events.publish('statistics:updated');

        this.api.http.post(url, {}, this.api.setHeaders(true)).subscribe(data => {

        });
    }

    addFavorites(user) {
        let message, url;
        if (user.isAddFavorite == false) {
            user.isAddFavorite = true;
            message = user.nickName + ' has been added to Favorites';
            url = this.api.url + '/user/favorites/' + user.id;
        }else{
            user.isAddFavorite = false;
            message = user.nickName + ' has been removed from your Favorites';
            url = this.api.url + '/user/favorites/' + user.id + '/delete';
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

    getUsers(loader = false) {

        if(loader) {
            this.api.showLoad();
        }

        this.url = '/users/online/count:' + this.per_page + '/page:' + this.page_counter + '/sort:';

        if (this.get_params) {

            if (this.get_params.list == 'distance') {
                this.sort = this.get_params.list;
            }

            // If Current Page Is "Block" or "Favorited", than remove "Add Favorited" button label
            if (this.get_params.list == 'blackList' || this.get_params.list == 'friends') {
                this.blocked_img = true;
            }

            if (this.get_params.action == 'search') {
                this.url = '/users/search/gender:' + '1' + '/country:' + this.get_params.search.countryCode + '/region:'
                    + this.get_params.search.regionCode + '/age:' + this.get_params.search.ageFrom + '-'
                    + this.get_params.search.ageTo + '/disability:' + this.get_params.search.disability + '/nickName:'
                    + this.get_params.search.nickName + '/count:' + this.per_page + '/page:' + this.page_counter;
            } else if (this.get_params.action == 'online') {
                this.url = '/users/online/count:' + this.per_page + '/page:' + this.page_counter + '/sort:' + this.sort;
            } else {
                this.url = '/user/statistics/' + this.get_params.list + '/count:' + this.per_page + '/page:' + this.page_counter;
            }

        }

        this.api.http.get(this.api.url + this.url + '', this.api.setHeaders(true)).subscribe(data => {
            console.log(this.url);
            if(this.users){
                for (let person of data.json().users.items) {
                    this.users.push(person);
                }
            }else {
                this.users = data.json().users.items;
                this.user_counter = data.json().users.itemsNumber;
            }
            if (parseInt(data.json().users.items.length) < parseInt(this.per_page)) {
                this.loader = false;
            }
            this.loadMoreResults = true;

            this.api.hideLoad();
        },err => {
            this.api.hideLoad();
            if(loader) {
                this.api.register.status = 'not_activated';
            }
            if(this.api.pageName == 'HomePage') {
                this.getUsers();
            }
        });
    }

    back() {
        this.navCtrl.pop();
    }

    moreUsers(infiniteScroll: any) {

        if (this.loader) {
            if(this.loadMoreResults) {
                this.loadMoreResults = false;
                this.page_counter++;
                this.params.page = this.page_counter;

                this.getUsers();
            }
            infiniteScroll.complete();
        }
    }

    ionViewWillEnter() {
        this.api.pageName = 'HomePage';
    }
}
