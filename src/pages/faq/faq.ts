import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
/*
 Generated class for the Faq page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

import * as $ from "jquery";


@Component({
    selector: 'page-faq',
    templateUrl: 'faq.html'
})
export class FaqPage {

    page: any;

    hightlightStatus: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public api: ApiQuery) {
        this.getPageData();

    }

    toggleAnswer(){

    }

    getPageData() {
        this.api.http.get(this.api.url + '/faq', this.api.header).subscribe(data => {
            this.page = data.json();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FaqPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'FaqPage';
    }
}
