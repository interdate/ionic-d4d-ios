import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {InAppPurchase} from '@ionic-native/in-app-purchase';
import {ApiQuery} from '../../library/api-query';
import {PagePage} from '../page/page';
import {HelloIonicPage} from "../hello-ionic/hello-ionic";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiQuery, private iap: InAppPurchase) {
        if(this.api.register.status != 'not_activated') {
            this.api.http.get(this.api.url + '/faq/payment', this.api.header).subscribe(data => {
                this.faq = data.json().faq;
                this.text = data.json().text;
                // this.text = 'asdf asdf asdf asdfa sdfaraefe';
                //alert(this.text);
            });

            this.api.showLoad();
            this.iap
                .getProducts(['OneMon', 'ThreeMon'])
                .then((products) => {
                    this.products = products;
                    this.api.hideLoad();
                })
                .catch((err) => {
                    //alert('err');
                    //alert(JSON.stringify(err));
                });
            var that = this;
            this.iap.restorePurchases().then(function (data) {
                console.log(data);
                //if(data.length > 0){
                that.api.http.post(that.api.url + '/user/subscription/restore', data, that.api.setHeaders(true)).subscribe(resp => {
                        //alert(JSON.stringify(resp.json()));
                        if (resp.json().payment == 1) {
                            that.navCtrl.push(HelloIonicPage);
                        }
                    },
                    err => {
                        //alert(err);
                        console.log(err);
                    });
                //}
                /*
                 [{
                 transactionId: ...
                 productId: ...
                 state: ...
                 date: ...
                 }]
                 */
            }).catch(function (err) {
                console.log(err);
            });
        }
    }

    subscribe(product) {
        this.api.showLoad();
        var monthsNumber = 1;
        switch(product.productId){
            case 'OneMon':
                monthsNumber = 1;
                break;

            case 'ThreeMon':
                monthsNumber = 3;
                break;

            case 'SixMon':
                monthsNumber = 6;
                break;

            case 'OneY':
                monthsNumber = 12;
                break;
        }
        this.iap
            .subscribe(product.productId)
            .then((data)=> {
                console.log(JSON.stringify(data));
                if(parseInt(data.transactionId) > 0){
                    this.api.http.post(this.api.url + '/user/subscription/monthsNumber:' + monthsNumber, data, this.api.setHeaders(true)).subscribe(data => {
                        this.api.presentToast('Congratulations on your purchase of a paid subscription to Dating4Disabled.com', 10000);
                        this.navCtrl.push(HelloIonicPage);
                    });
                }
                this.api.hideLoad();
            })
            .catch((err)=> {
                this.api.hideLoad();
                console.log(JSON.stringify(err));
                /*this.api.http.post(this.api.url + '/user/subscription/monthsNumber:' + monthsNumber, err, this.api.setHeaders(true)).subscribe(data => {
                    this.api.presentToast('Congratulations on your purchase of a paid subscription to Dating4Disabled.com', 10000);
                    alert(JSON.stringify(data));
                    this.navCtrl.push(HelloIonicPage);
                });*/
                //alert(monthsNumber);
            });
    }

    showed(i,product) {
        this.is_showed[i]=!this.is_showed[i];

        if(this.is_showed[i] == false) {
            this.subscribe(product)
        }
    }

    safeHtml(el): any {
        if(this.text) {
            let html = this.text;
            let div: any = document.createElement('div');
            div.innerHTML = html;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('click');
                if (pageHref) {
                    a.removeAttribute('click');
                    a.onclick = () => this.getPage(pageHref);
                }
            });
            if (el.innerHTML == '' || typeof el.innerHTML == 'undefined') {
                el.appendChild(div);
            }
        }
    }

    getPage(id) {
        this.navCtrl.push(PagePage, {id: id});
    }



    ionViewDidLoad() {
        console.log('ionViewDidLoad SubscriptionPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'SubscriptionPage';
    }
}
