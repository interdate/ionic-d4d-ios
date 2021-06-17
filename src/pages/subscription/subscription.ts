import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';

/*
 Generated class for the Subscription page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-subscription',
    templateUrl: 'subscription.html'
})
export class SubscriptionPage {

    public products: any;
    faq: any;
    hightlightStatus: any = [];
    is_showed: any = [];
    text: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiQuery) {
      this.api.storage.get('user_id').then((user_id) => {
        window.open('https://m.dating4disabled.com/subscription/?app_user_id=' + user_id, '_blank');
      });
    }



    ionViewWillEnter() {
        this.api.pageName = 'SubscriptionPage';
    }
}
