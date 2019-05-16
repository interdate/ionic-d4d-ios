import {Component} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import {ApiQuery} from '../../library/api-query';
import {AdvancedSearchPage} from "../advanced-search/advanced-search";
import {SelectPage} from "../select/select";

import * as $ from "jquery";

/*
 Generated class for the Search page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {

    age: any;
    params: any = {countryCode: false};
    countries: any = [];//Array<{ countryCode: any, countryName: any }>;
    regions: any = [];//Array<{ regionCode: any, regionName: any }>;
    disabilities: any = [];//Array<{ healthId: any, healthName: any }>;
    ages: any = [];
    form: any = {
        username: {value: ''},
        country: {label: 'Country', value: '', valLabel: ''},
        region: {label: '', value: '', valLabel: ''},
        disability: {label: 'Disability', value: '', valLabel: ''},
        ageFrom: {choices: [[]], label: 'Age From', valLabel: ''},
        ageTo: {choices: [[]], label: 'Age To', valLabel: ''},
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public events: Events) {

        this.getCountries();
        this.getDisabilities();
        this.getDefaultRegion();
        for (let i = 18; i <= 80; i++) {
            this.ages.push({val: i, label: i});
        }

        this.form.ageFrom.choices = this.form.ageTo.choices = this.ages;

        this.form.ageFrom.value = this.form.ageFrom.valLabel = 20;
        this.form.ageTo.value = this.form.ageTo.valLabel = 50;
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

                let choosedVal = data.val;
                this.form[index]['value'] = choosedVal;

                this.form[index]['valLabel'] = (data.label == 'Choose') ? data.val : data.label;
                if(index == 'country'){
                    this.festSelected();
                }

            }
        });
    }

    getDefaultRegion() {
        this.api.http.get(this.api.url + '/list/search/regions/', this.api.setHeaders(true)).subscribe(data => {
            //this.regions = data.json().items;
            this.regions = [];
            var that = this;
            data.json().items.forEach(function (obj) {
                that.regions.push({
                    val: obj.regionCode,
                    label: obj.regionName
                });
                if(data.json().value == obj.regionCode){
                    that.form.region.valLabel = obj.regionName;
                }
            });

            this.form.region.label = data.json().label;
            this.form.region.value = data.json().value;
            this.form.region.choices = this.regions;
            // this.regions.forEach(function (obj) {
            //     if(this.form.region.value == obj.regionCode){
            //         this.form.region.valLabel = obj.regionName;
            //     }
            // });
        });
    }

    getCountries() {
        this.api.http.get(this.api.url + '/list/countries', this.api.setHeaders(true)).subscribe(data => {
            //this.countries = data.json().items;
            this.countries = [];
            var that = this;
            data.json().items.forEach(function (obj) {
                that.countries.push({
                    val: obj.countryCode,
                    label: obj.countryName
                });
                if(data.json().defaultValue == obj.countryCode){
                    that.form.country.valLabel = obj.countryName;
                }
            });
            this.form.country.value = data.json().defaultValue;
            this.form.country.choices = this.countries;
            // this.countries.forEach(function (obj) {
            //     if(this.form.country.value == obj.countryCode){
            //         this.form.country.valLabel = obj.countryName;
            //     }
            // });
        });
    }

    getRegion(country) {

        this.api.http.get(this.api.url + '/list/regions/' + country, this.api.setHeaders(true)).subscribe(data => {
            //this.regions = data.json().items;
            this.regions = [];
            var that = this;
            data.json().items.forEach(function (obj) {
                that.regions.push({
                    val: obj.regionCode,
                    label: obj.regionName
                });
            });
            this.form.region.value = this.form.region.valLabel = '';
            this.form.region.choices = this.regions;
        });
    }

    festSelected() {
        this.getRegion(this.form.country.value);
    }

    getDisabilities() {
        this.api.http.get(this.api.url + '/list/health', this.api.setHeaders(true)).subscribe(data => {
            //this.disabilities = data.json().items;
            this.disabilities = [];
            var that = this;
            data.json().items.forEach(function (obj) {
                that.disabilities.push({
                    val: obj.healthId,
                    label: obj.healthName
                });
            });
            this.form.disability.choices = that.disabilities;
        });
    }

    toAdvancedSearch() {
        this.navCtrl.push(AdvancedSearchPage);
    }

    toSearchResultsPage() {

        let params = JSON.stringify({
            action: 'search',
            search: {
                nickName: this.form.username.value,
                countryCode: (this.form.country.value) ? this.form.country.value : "",
                regionCode: (this.form.region.value) ? this.form.region.value : "",
                disability: (this.form.disability.value) ? this.form.disability.value : "",
                ageFrom: (this.form.ageFrom.value) ? this.form.ageFrom.value : "0",
                ageTo: (this.form.ageTo.value) ? this.form.ageTo.value : "0"
            }

        });
        //console.log(this.form.country.value)
        //console.log(params);

        this.navCtrl.push(HelloIonicPage, {params: params});
    }

    ionViewWillEnter() {
        this.api.pageName = 'SearchPage';
    }
}
