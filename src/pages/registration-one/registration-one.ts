import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController, Content, Events} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {PagePage} from '../page/page'
import {ChangePhotosPage} from "../change-photos/change-photos";
import {SelectPage} from "../select/select";


/*
 Generated class for the RegistrationOne page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

import * as $ from "jquery";

@Component({
    selector: 'page-registration',
    templateUrl: 'registration-one.html'
})

export class RegistrationOnePage {
    @ViewChild(Content) content: Content;

    form: any =
    {
        userNick: {value: ''},
        userEmail: {value: '', label: ''},
        userPass: {value: ''},
        userPass2: {value: ''},
        userGender: {choices: [[]], value: ''},
        sexPrefId: {choices: [[]], value: ''},
        userBirthday: {value: {d: {}, m: {}, y: {}}},
        region: {},
        countryCode: {choices: [[]], value: ''},
        countryOfOriginCode: {choices: [[]], value: ''},
        regionCode: {choices: [[]], value: ''},
        userCityName: {value: ''},
        zipCode: {value: ''},
        agree: {value: 0},
        userfName: '',
        userlName: '',
        maritalStatusId: {choices: [[]], value: ''},
        userChildren: {choices: [[]], value: ''},
        ethnicOriginId: {choices: [[]], value: ''},
        religionId: {choices: [[]], value: ''},
        educationId: {choices: [[]], value: ''},
        occupationId: {choices: [[]], value: ''},
        incomeId: {choices: [[]], value: ''},
        languageId: {choices: [[]], value: ''},
        appearanceId: {choices: [[]], value: ''},
        bodyTypeId: {choices: [[]], value: ''},
        userHight: {choices: [[]], value: ''},
        userWeight: {choices: [[]], value: ''},
        hairLengthId: {choices: [[]], value: ''},
        hairColorId: {choices: [[]], value: ''},
        eyesColorId: {choices: [[]], value: ''},
        smokingId: {choices: [[]], value: ''},
        drinkingId: {choices: [[]], value: ''},
        hobbyIds: {choices: [[]], value: ''},
        userAboutMe: '',
        userLookingFor: '',
        userHobbies: {choices: [[]], value: ''},
        characteristicIds: {choices: [[]], value: ''},
        lookingForIds: {choices: [[]], value: ''},
        healthId: {choices: [[]], value: ''},
        mobilityId: {choices: [[]], value: ''},
        step: {value: ''},
    };

    user: any = {};

    error: any = {
        userNick: '',
        userEmail: '',
        userPass: '',
        userPass2: '',
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
        agree: ''
    };

    texts: any = {errText: ''};

    birth: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public api: ApiQuery,
                public events: Events) {

        this.getPage();
    }

    openSelect(field, index) {
        this.events.publish('interval:updated');
        if(typeof field == 'undefined'){
            field = false;
        }

        let profileModal = this.api.modalCtrl.create(SelectPage, {data: field});
        profileModal.present();

        profileModal.onDidDismiss(data => {
            if (data) {

                let choosedVal = data.value;
                this.user[index] = this.form[index]['value'] = choosedVal;

                this.form[index]['valLabel'] = (data.label == 'Choose') ? data.val : data.label;

                if(index == 'countryCode'){
                    this.festSelected();
                }
            }
        });
    }

    getPage() {
        console.log(this.api.url + '/register');
        this.api.http.post(this.api.url + '/register','' ,this.api.setHeaders(false)).subscribe(data => {
            console.log(data.json());
            this.form = data.json().form;
        });
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

    back() {

        var data = JSON.stringify({
            userNick: this.user.userNick,
            userEmail: this.user.userEmail,
            userPass: this.user.userPass,
            userPass2: this.user.userPass2,
            userGender: this.user.userGender,
            sexPrefId: this.user.sexPrefId,
            countryCode: this.user.countryCode,
            userCityName: this.user.userCityName,
            countryOfOriginCode: this.user.countryOfOriginCode,
            userBirthday: {
                d: this.user.userBirthday.d,
                m: this.user.userBirthday.m,
                y: this.user.userBirthday.y
            },
            regionCode: this.user.regionCode,
            zipCode: this.user.zipCode ? this.user.zipCode : '',
            agree: this.user.agree,
            step: this.user.step,

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
            stepBack: 1
        });

        this.api.http.post(this.api.url + '/register', data, this.api.header).subscribe(data => this.validate(data.json()));
    }

    getTermsAndConditions() {
        this.navCtrl.push(PagePage, {id: 1});
    }

    formSubmit() {

        this.api.showLoad();

        this.texts.errText = '';

        var date_arr = ['', '', ''];

        if (typeof this.birth != 'undefined') {
            date_arr = this.birth.split('-');
        }
        let data;
        if (this.form.step.value == 1) {
            data = JSON.stringify({
                userNick: this.form.userNick.value,
                userEmail: this.form.userEmail.value,
                userPass: this.form.userPass.value,
                userPass2: this.form.userPass2.value,
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
                agree: this.form.agree.value,
                step: this.form.step.value
            });
        } else {
            data = JSON.stringify({
                userNick: this.user.userNick,
                userEmail: this.user.userEmail,
                userPass: this.user.userPass,
                userPass2: this.user.userPass2,
                userGender: this.user.userGender,
                sexPrefId: this.user.sexPrefId,
                countryCode: this.user.countryCode,
                userCityName: this.user.userCityName,
                countryOfOriginCode: this.user.countryOfOriginCode,
                userBirthday: {
                    d: this.user.userBirthday.d,
                    m: this.user.userBirthday.m,
                    y: this.user.userBirthday.y
                },
                regionCode: this.user.regionCode,
                zipCode: this.user.zipCode ? this.user.zipCode : '',
                agree: this.user.agree,
                step: this.user.step,

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


        this.api.http.post(this.api.url + '/register', data, this.api.header).subscribe(data => this.validate(data.json()));
    }

    scrollToTop() {
        this.content.scrollTo(0, 0, 300);
    }

    validate(response) {

        this.api.hideLoad();

        this.user = response.user;
        this.form = response.form;
        this.texts.errText = response.texts.errText;
        this.error = response.error;

        //If there are no errors - scroll to the top for next step
        if (response.error.length == 0) {
            this.scrollToTop();
            this.texts.errText = '';
        }

        if (response.error.length == 0 && response.form.step.value == 2 && response.user.userId) {

            this.api.storage.set('username', this.user.userNick);
            this.api.storage.set('password', this.user.userPass);
            this.api.storage.set('user_id', response.user.userId);
            this.api.storage.set('user_photo', response.user.photo);

            this.api.setHeaders(true, this.user.userNick, this.user.userPass, "1");

            this.navCtrl.push(ChangePhotosPage, {new_user: true});
        }

    }

    ionViewWillEnter() {
        this.api.pageName = 'RegisterPage';
    }

}
