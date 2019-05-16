import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiQuery } from '../../library/api-query';

/*
 Generated class for the Page page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-page',
    templateUrl: 'page.html'
})
export class PagePage {

    page: { pageTitle: any, pageBody: any };
    logged_in: any = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiQuery) {

        let id = navParams.get('id');

        this.api.storage.get('user_id').then((val) => {
           if(val) {
               this.logged_in = true;
           }
        });

        this.api.http.get( api.url+'/page/' + id, this.api.setHeaders(false) ).subscribe(data => {
            this.page = data.json();
        });
    }

    back() {
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PagePage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'PagePage';
    }
}
