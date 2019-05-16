import {Component} from '@angular/core';
import {NavController, NavParams, ActionSheetController, AlertController} from 'ionic-angular';
import {ImagePicker, Camera, Transfer} from 'ionic-native';
import {ApiQuery} from '../../library/api-query';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import {PagePage} from '../page/page';
import set = Reflect.set;
/*
 Generated class for the ChangePhotos page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-change-photos',
    templateUrl: 'change-photos.html'

})
export class ChangePhotosPage {

    image: any;
    photos: any;
    imagePath: any;
    username: any = false;
    password: any = false;
    new_user: any = false;

    dataPage: any =
    {noPhoto: '', photos: []};

    texts : any;
    description: any;

    constructor(public actionSheetCtrl: ActionSheetController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public api: ApiQuery) {

        if (navParams.get('new_user')) {
            this.new_user = navParams.get('new_user');
        }

        this.getPageData();

        this.image = navParams.get('images');
    }

    delete(photo) {
        let confirm = this.alertCtrl.create({
            title: 'Delete this photo?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.postPageData('deleteImage', photo);
                    }
                }
            ]
        });
        confirm.present();
    }


    getCount(num) {
        return parseInt(num) + 1;
    }

    getPageData() {
        this.api.http.get(this.api.url + '/user/images', this.api.setHeaders(true,false,false,this.new_user)).subscribe(data => {
            this.dataPage.photos = data.json().images.items;
            this.texts = data.json().texts;
            this.description = data.json().texts.description;
            this.dataPage.noPhoto = data.json().images.noPhoto;
            this.photos = Object.keys(this.dataPage.photos);
            this.api.hideLoad();
        });
    }

    getPage(id) {
        this.navCtrl.push(PagePage, {id: id});
    }


    postPageData(type, params) {
        let url, data;
        if (type == 'mainImage') {
            data = JSON.stringify({setMain: params.id});
            url = '/user/images/setMain/' + params.id;

        } else if ('deletePage') {
            url = '/user/images/delete/' + params.id;
            data = JSON.stringify({
                delete: params.id
            });
        }

        this.api.http.post(this.api.url + url, data, this.api.setHeaders(true)).subscribe(data => {

            this.dataPage.photos = data.json().images.items;
            this.photos = Object.keys(this.dataPage.photos);
        });
    }


    edit(photo) {

        let mainOpt = [];

        console.log(photo);
        if ( photo.main != "1" && photo.isValid == "1") {

            mainOpt.push({
                    text: 'Set as main photo',
                    icon: 'contact',
                    handler: () => {
                        this.postPageData('mainImage', photo);
                    }
                }
            );
        }
        mainOpt.push({
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
                this.delete(photo);
            }
        });
        mainOpt.push({
            text: 'Cancel',
            role: 'destructive',
            icon: 'close',
            handler: () => {
                console.log('Cancel clicked');
            }
        });


        var status = photo.isValid == "0" ?
            'Waiting for approval': 'Approved';

        let actionSheet = this.actionSheetCtrl.create({
            title: 'Edit Photo',

            subTitle: 'Status' + ': ' + status,

            buttons: mainOpt
        });
        actionSheet.present();
    }

    add() {

        let actionSheet = this.actionSheetCtrl.create({
            title: 'Add Photo',
            buttons: [
                {
                    text: 'Choose from camera',
                    icon: 'aperture',
                    handler: () => {
                        this.openCamera();
                    }
                }, {
                    text: 'Choose from gallery',
                    icon: 'photos',
                    handler: () => {
                        this.openGallery();
                    }
                }, {
                    text: 'Cancel',
                    role: 'destructive',
                    icon: 'close',
                    handler: () => {
                        this.api.hideLoad();
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    openGallery() {

        let options = {
            maximumImagesCount: 1,
            width: 600,
            height: 600,
            quality: 100
        };
        let that = this;
        setTimeout(function(){ that.api.showLoad(); },500);
        ImagePicker.getPictures(options).then(
            (file_uris) => {
                this.api.showLoad();
                this.uploadPhoto(file_uris[0]);
            }, (err) => {
                this.api.hideLoad();
            }
        );
    }

    openCamera() {
        let cameraOptions = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 600,
            targetHeight: 600,
            saveToPhotoAlbum: true,
            chunkedMode: true,
            correctOrientation: true
        };
        let that = this;
        setTimeout(function(){ that.api.showLoad(); },500);
        Camera.getPicture(cameraOptions).then((imageData) => {
            this.api.showLoad();
            this.uploadPhoto(imageData);
        }, (err) => {
            this.api.hideLoad();
        });
    }

    uploadPhoto(url) {

        this.api.showLoad();

        this.api.storage.get('user_id').then((val) => {

            let options = {
                fileKey: "file",
                fileName: 'test.jpg',
                chunkedMode: false,
                mimeType: "image/jpg",
                headers: {
                    Authorization: "Basic " + btoa(this.api.username + ":" + this.api.password),
                    appVersion: this.api.version
                }

            };

            const fileTransfer = new Transfer();

            fileTransfer.upload(url, this.api.url + '/user/image', options).then((entry) => {

                if(this.new_user) {
                    this.navCtrl.push(ChangePhotosPage, {new_user: true});

                }else{
                    this.navCtrl.push(ChangePhotosPage, {});

                }

                this.api.hideLoad();
            }, (err) => {
                this.api.hideLoad();
            });
        });
    }

    onHomePage() {
        this.api.register = {
            text: this.texts.reg_success,
            status: 'not_activated'
        };


        this.navCtrl.push(HelloIonicPage);
    }

    ionViewWillEnter() {
        this.api.pageName = 'ChangePhotosPage';
    }
}
