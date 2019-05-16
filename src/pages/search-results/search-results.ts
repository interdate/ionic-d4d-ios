import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, Events} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {ProfilePage} from '../profile/profile';
import {DialogPage} from '../dialog/dialog';

@Component({
    selector: 'search-results',
    templateUrl: 'search-results.html'
})
export class SearchResultsPage {

    public loadMoreResults: any = true;
    list: any;
    action: any;
    offset: any;
    sort: any = '';
    page_counter: any = 1;
    per_page: any = 20;
    user_counter: any = 20;
    loader: any = true;
    username: any;
    password: any;
    blocked_img: any = false;
    get_params: any = {page: 1, count: this.per_page};
    url: any = false;

    users: any;
    params: any = {action: 'online', page: 1, list: ''};

    constructor(public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public events: Events) {

        this.get_params = this.navParams.get('params');
        this.get_params = JSON.parse(String(this.get_params));

        this.page_counter = 1;

        this.api.storage.get('username').then((username) => {
            this.username = username;
            //this.users = [];
            this.getUsers(true);
        });


        this.api.storage.get('password').then((password) => {
            this.password = password;
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

    back() {
        this.navCtrl.pop();
    }

    addLike(user) {

        if (user.isAddLike == false) {

            user.isAddLike = true;

            let toast = this.toastCtrl.create({
                message: 'You liked user',
                duration: 2000
            });

            toast.present();

            let params = JSON.stringify({
                toUser: user.id,
            });
            this.api.http.post(this.api.url + '/user/like/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
            });
        }
    }

    block(user, bool) {
        let toast,message,url;

        if (bool == true) {
            user.isBlackListed = true;
            url = this.api.url + '/user/favorites/' + user.id + '/delete';
        }

        if (bool == false) {
            user.isBlackListed = false;
            url = this.api.url + '/user/blacklist/' + user.id + '/delete';
            message = 'The user has been removed from your black list';
        }

        // Remove user from list
        this.users.splice(this.users.indexOf(user), 1);
        this.events.publish('statistics:updated');

        this.api.http.post(url, {}, this.api.setHeaders(true)).subscribe(data => {
            toast = this.toastCtrl.create({
                message: message,
                duration: 2000
            });
            toast.present();
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
        this.url = '/user/advanced/search';


        this.api.http.post(this.api.url + this.url + '', this.get_params, this.api.setHeaders(true)).subscribe(data => {
            this.api.hideLoad();
            this.loadMoreResults = true;
            console.log(this.get_params);
            if (parseInt(data.json().users.length) < parseInt(this.per_page)) {
                this.loader = false;
            }
            if(this.users) {
                for (let person of data.json().users) {
                    this.users.push(person);
                }
            }else{
                this.users = data.json().users;
                this.user_counter = data.json().users.itemsNumber;
            }
        },err => {
            this.api.hideLoad();
            if(this.api.pageName == 'SearchResultsPage') {
                this.getUsers();
            }
        });

    }

    moreUsers(infiniteScroll: any) {
        //alert(this.loader);
        if (this.loader) {
            if(this.loadMoreResults) {
                this.loadMoreResults = false;
                this.page_counter++;
                this.get_params.page = this.page_counter;
                this.get_params.count = this.per_page;

                this.url = '/user/advanced/search';

                this.getUsers();
            }
            infiniteScroll.complete();
        }

    }

    ionViewWillEnter() {
        this.api.pageName = 'SearchResultsPage';
    }
}
