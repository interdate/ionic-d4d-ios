import {Component} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {SearchResultsPage} from "../search-results/search-results";
import {SelectPage} from "../select/select";

/*
 Generated class for the AdvancedSearch page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-advanced-search',
    templateUrl: 'advanced-search.html'
})
export class AdvancedSearchPage {

    ages: any = [];

    form: any;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public events: Events) {



        this.api.http.get(api.url + '/user/advanced/search', api.setHeaders(true)).subscribe(data => {
            this.form = data.json().form;
            for (let i = parseInt(this.form.age.min); i <= parseInt(this.form.age.max); i++) {
                this.ages.push({value: i, label: i});
            }

            // this.form.ageFrom.choices = this.form.ageTo.choices = this.ages;
            //
            // this.form.ageFrom.value = this.form.ageFrom.valLabel = this.form.age.valueFrom;
            // this.form.ageTo.value = this.form.ageTo.valLabel = this.form.age.valueTo;

            this.form.ageFrom = {choices: this.ages, label: 'Age From', valLabel: this.form.age.valueFrom, value: this.form.age.valueFrom};
            this.form.ageTo = {choices: this.ages, label: 'Age To', valLabel: this.form.age.valueTo, value: this.form.age.valueTo};
        });


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
                this.form[index]['value'] = choosedVal;
                if(index == 'ageTo'){
                    this.form.age.valueTo = choosedVal;
                }
                if(index == 'ageFrom'){
                    this.form.age.valueFrom = choosedVal;
                }

                this.form[index]['valLabel'] = (data.label == 'Choose') ? data.val : data.label;;

            }
        });
    }

    toSearchResultsPage() {
        let params = JSON.stringify({
            countryCode: this.form.countryCode.value,
            regionCode: this.form.regionCode.value,
            ageFrom: this.form.age.valueFrom,
            ageTo: this.form.age.valueTo,
            count: 10,
            appearanceId: this.form.appearanceId.value,
            bodyTypeId: this.form.bodyTypeId.value,
            drinkingId: this.form.drinkingId.value,
            educationId: this.form.educationId.value,
            ethnicOriginId: this.form.ethnicOriginId.value,
            eyesColorId: this.form.eyesColorId.value,
            hairColorId: this.form.hairColorId.value,
            hairLengthId: this.form.hairLengthId.value,
            healthId: this.form.healthId.value,
            incomeId: this.form.incomeId.value,
            languageId: this.form.languageId.value,
            lookingForIds: this.form.lookingForIds.value,
            maritalStatusId: this.form.maritalStatusId.value,
            mobilityId: this.form.mobilityId.value,
            occupationId: this.form.occupationId.value,
            religionId: this.form.religionId.value,
            sexPrefId: this.form.sexPrefId.value,
            smokingId: this.form.smokingId.value,
            userChildren: this.form.userChildren.value,
            userCityName: this.form.userCityName.value,
            userGender: this.form.userGender.value,
            withPhotos: this.form.withPhotos.value,
            zipCode: this.form.countryCode.value == 'US' ? this.form.zipCode.value : '',

        });
        this.navCtrl.push(SearchResultsPage, {params: params});
    }

    photoValue() {
        this.form.withPhotos.value = this.form.withPhotos.value ? false : true;
    }

    back() {
        this.navCtrl.pop();
    }

    getRegions() {
        if (this.form.countryCode.value) {
            this.api.http.get(this.api.url + '/user/advanced/search/regions/' + this.form.countryCode.value, this.api.setHeaders(true)).subscribe(data => {
                this.form.regionCode = data.json().form.regionCode;
                if (data.json().form.zipCode) {
                    this.form.zipCode = data.json().form.zipCode;
                } else {
                    this.form.zipCode = {};
                }
            });
        } else {
            this.form.regionCode.value = [];
            this.form.regionCode.choices = [];
        }
    }

    ionViewWillEnter() {
        this.api.pageName = 'AdvancedSearchPage';
    }
}
