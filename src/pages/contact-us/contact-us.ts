import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import * as $ from "jquery";


/*
 Generated class for the ContactUs page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-contact-us',
    templateUrl: 'contact-us.html'
})
export class ContactUsPage {

    form: { form: any } = {form: {username: {}, subject: {}, email: {value: ''}, _token: {}, text: {value: ''}}};

    email_err: any;
    text_err: any;
    subject_err: any;
    user_id = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public toastCtrl: ToastController) {

        this.api.storage.get('user_id').then((user_id) => {
            this.user_id = user_id;
        });
    }

    formSubmit() {

        var params = JSON.stringify({
            userId: this.user_id,
            messageToAdmin: this.form.form.text.value,
            email: this.form.form.email.value
        });


        if (!this.user_id && !this.api.validateEmail(this.form.form.email.value)) {
            this.text_err = 'Incorrect Email';
        } else if (this.form.form.text.value == '') {
            this.text_err = 'Incorrect text message';
        } else {
            this.api.http.post(this.api.url + '/contactUs', params, this.api.header).subscribe(data => this.validate(data.json()));
        }

    }

    back() {
        //Keyboard.close();
        this.navCtrl.pop();
        setTimeout(function () {
            $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
        }, 500);
    }

    validate(response) {

        this.text_err = '';

        if (this.form.form.text.value) {

            if (response.result == true) {

                this.form.form.text.value = "";
                this.form.form.email.value = "";

                const toast = this.toastCtrl.create({
                    message: 'Message was sent successfully',
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                });
                toast.present();
            }
        }
    }

    ionViewWillEnter() {
        this.api.pageName = 'ContactUsPage';
    }
}
