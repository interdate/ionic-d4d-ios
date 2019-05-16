import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController, ToastController, Content, Events} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {ChangePhotosPage} from '../change-photos/change-photos';
import {SelectPage} from "../select/select";

/*
 Generated class for the EditProfile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

import * as $ from "jquery";

@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
    @ViewChild(Content) content: Content;

    form: any;

    user: any;

    error: any = {
        userNick: '',
        userEmail: '',
        userGender: '',
        sexPrefId: '',
        userBirthday: '',
        region: '',
        countryCode: '',
        countryOfOriginCode: '',
        regionCode: '',
        userCityName: '',
        zipCode: '',
        userfName: '',
        userlName: '',
        maritalStatusId: '',
        userChildren: '',
        ethnicOriginId: '',
        religionId: '',
        educationId: '',
        occupationId: '',
        incomeId: '',
        languageId: '',
        appearanceId: '',
        bodyTypeId: '',
        userHight: '',
        userWeight: '',
        hairLengthId: '',
        hairColorId: '',
        eyesColorId: '',
        smokingId: '',
        drinkingId: '',
        hobbyIds: '',
        userAboutMe: '',
        userLookingFor: '',
        userHobbies: '',
        characteristicIds: '',
        lookingForIds: '',
        healthId: '',
        mobilityId: '',
    };

    texts: any = {errText: ''};

    birth: any;
    public profileModal: any;
    public click: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public api: ApiQuery,
                public toastCtrl: ToastController,
                public events: Events
    ) {
        this.getPage();
    }


    getPage(step = 1) {

        this.texts.errText = '';

        this.api.http.post(this.api.url + '/edit', {step: step}, this.api.setHeaders(true)).subscribe(data => {
            this.form = data.json().form;
            this.user = data.json().user;
            if (step == 1) {
                this.birth = new Date(this.form.userBirthday.value.y, this.form.userBirthday.value.m, this.form.userBirthday.value.d).toISOString();
            }
        });
    }

    openSelect(field, index) {
        this.click = true;
        console.log(this.click);
        //this.events.publish('interval:updated');
        console.log('click Select');
        if (!this.profileModal) {
            this.profileModal = this.api.modalCtrl.create(SelectPage, {data: field});

            this.profileModal.onDidDismiss(data => {
                if (data) {
                    this.user[index] = this.form[index]['value'] = data.value;

                    this.form[index]['valLabel'] = (data.label == 'Choose') ? data.val : data.label;

                    if (index == 'countryCode') {
                        this.festSelected();
                    }
                }
                delete this.profileModal;
                this.click = false;
            });

            this.profileModal.present();
        }else{
            this.openSelect(field, index);
        }
        //return false;
    }

    festSelected() {

        let params = JSON.stringify({step: 1, getRegions: 1, countryCode: this.form.countryCode.value});

        this.api.http.post(this.api.url + '/register', params, this.api.setHeaders(false)).subscribe(data => {

            if (this.form.countryCode.value.toString() == "US") {
                this.form.regionCode = data.json().form.regionCode;
                this.form.zipCode = data.json().form.zipCode;
            } else {
                delete this.form.zipCode;
                this.form.regionCode = data.json().form.regionCode;
            }
        });
    }

    formSubmit() {

        /*this.storage.set('user_data', {
         username: this.form.userNick.value,
         password: this.form.userPass.value
         });

         this.api.setUserData({username: this.form.userNick.value, password: this.form.userPass.value});
         */
        var date_arr = ['', '', ''];
        let data;

        if (typeof this.birth != 'undefined') {
            date_arr = this.birth.split('-');
        }

        if (this.form.step.value == 1) {

            data = JSON.stringify({
                userNick: this.form.userNick.value,
                userEmail: this.form.userEmail.value,
                userGender: this.form.userGender.value,
                sexPrefId: this.form.sexPrefId.value,
                countryCode: this.form.countryCode.value,
                userCityName: this.form.userCityName.value,
                countryOfOriginCode: this.form.countryOfOriginCode.value,
                userBirthday: {
                    d: parseInt(date_arr[2]),
                    m: parseInt(date_arr[1]),
                    y: parseInt(date_arr[0])
                },
                regionCode: this.form.regionCode.value,
                zipCode: this.form.zipCode ? this.form.zipCode.value : '',
                step: this.form.step.value
            });
        } else {
            data = JSON.stringify({
                step: this.form.step.value,
                userfName: this.form.userfName.value,
                userlName: this.form.userlName.value,
                maritalStatusId: this.form.maritalStatusId.value,
                userChildren: this.form.userChildren.value,
                ethnicOriginId: this.form.ethnicOriginId.value,
                religionId: this.form.religionId.value,
                educationId: this.form.educationId.value,
                occupationId: this.form.occupationId.value,
                incomeId: this.form.incomeId.value,
                languageId: this.form.languageId.value,
                appearanceId: this.form.appearanceId ? this.form.appearanceId.value : '',
                bodyTypeId: this.form.bodyTypeId ? this.form.bodyTypeId.value : '',
                userHight: this.form.userHight ? this.form.userHight.value : '',
                userWeight: this.form.userWeight ? this.form.userWeight.value : '',
                hairLengthId: this.form.hairLengthId ? this.form.hairLengthId.value : '',
                hairColorId: this.form.hairColorId ? this.form.hairColorId.value : '',
                eyesColorId: this.form.eyesColorId ? this.form.eyesColorId.value : '',
                smokingId: this.form.smokingId ? this.form.smokingId.value : '',
                drinkingId: this.form.drinkingId ? this.form.drinkingId.value : '',
                hobbyIds: this.form.hobbyIds ? this.form.hobbyIds.value : '',
                userAboutMe: this.form.userAboutMe ? this.form.userAboutMe.value : '',
                userLookingFor: this.form.userLookingFor ? this.form.userLookingFor.value : '',
                userHobbies: this.form.userHobbies ? this.form.userHobbies.value : '',
                characteristicIds: this.form.characteristicIds ? this.form.characteristicIds.value : '',
                lookingForIds: this.form.lookingForIds ? this.form.lookingForIds.value : '',
                healthId: this.form.healthId ? this.form.healthId.value : '',
                mobilityId: this.form.mobilityId ? this.form.mobilityId.value : '',
            });
        }


        this.api.http.post(this.api.url + '/edit', data, this.api.header).subscribe(data => this.validate(data.json()));
    }

    scrollToTop() {
        this.content.scrollTo(0, 0, 300);
    }

    validate(response) {

        this.user = response.user;
        this.form = response.form;
        this.texts.errText = response.texts.errText;
        this.error = response.error;

        //If there are no errors - scroll to the top for next step
        if (response.error.length == 0) {
            this.scrollToTop();
            this.api.presentToast(response.texts.successText);
        }

        if (response.error.length == 0 && response.form.step.value == 2 && response.user.userId) {
            this.api.storage.set('user_photo', response.user.photo);
            this.navCtrl.push(ChangePhotosPage);

        } else if (response.error.length == 0 && response.form.step.value == 1) {
            this.api.storage.set('username', this.user.userNick);
            this.api.setHeaders(true, this.user.userNick);
            this.getPage(2);
        }
    }

    changePhotosPage() {
        this.navCtrl.push(ChangePhotosPage);
    }

    ionViewWillEnter() {
        this.api.pageName = 'EditProfilePage';
    }
}
