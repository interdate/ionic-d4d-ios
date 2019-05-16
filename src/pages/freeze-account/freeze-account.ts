import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {ApiQuery} from '../../library/api-query';

/*
 Generated class for the FreezeAccount page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-freeze-account',
    templateUrl: 'freeze-account.html'
})
export class FreezeAccountPage {

    form: any = {text: { value: '' }};

    constructor(public navCtrl: NavController, public api: ApiQuery, public navParams: NavParams) {

    }

    submit() {

        var params = JSON.stringify({
            'freeze_account_reason': this.form.text.value
        });

        this.api.http.post(this.api.url + '/freeze', params, this.api.header).subscribe(data => this.validate(data.json()));

        this.navCtrl.push(LoginPage, {page: {_id: "logout"}});
    }

    validate(response) {
        console.log(response);
    }

    ionViewWillEnter() {
        this.api.pageName = 'FreezeAccountPage';
    }
}
