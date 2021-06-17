import {Component, ViewChild} from '@angular/core';
import {Platform, MenuController, Nav, ViewController, AlertController, Events, Content} from 'ionic-angular';
import {Market} from 'ionic-native';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import {StatusBar} from "@ionic-native/status-bar";
import {Geolocation} from '@ionic-native/geolocation';
import {HelloIonicPage} from '../pages/hello-ionic/hello-ionic';
import {ChangePasswordPage} from '../pages/change-password/change-password';
import {SearchPage} from '../pages/search/search';
import {LoginPage} from '../pages/login/login';
import {ChangePhotosPage} from '../pages/change-photos/change-photos';
import {EditProfilePage} from '../pages/edit-profile/edit-profile';
import {ContactUsPage} from '../pages/contact-us/contact-us';
import {ProfilePage} from '../pages/profile/profile';
import {SettingsPage} from '../pages/settings/settings';
import {FreezeAccountPage} from '../pages/freeze-account/freeze-account';
import {ArenaPage} from '../pages/arena/arena';
import {InboxPage} from '../pages/inbox/inbox';
import {NotificationsPage} from '../pages/notifications/notifications';
import {RegistrationOnePage} from '../pages/registration-one/registration-one';
import {DialogPage} from '../pages/dialog/dialog';
import {BingoPage} from '../pages/bingo/bingo';
import {PasswordRecoveryPage} from '../pages/password-recovery/password-recovery';
import {PagePage} from '../pages/page/page';
import {ApiQuery} from '../library/api-query';
import {FaqPage} from "../pages/faq/faq";
import {SubscriptionPage} from "../pages/subscription/subscription";

import * as $ from "jquery";
import {SplashScreen} from "@ionic-native/splash-screen";

@Component({
    templateUrl: 'app.html'

})
export class MyApp {

    @ViewChild(Nav) nav: Nav;
    @ViewChild(ViewController) viewCtrl: ViewController;
    @ViewChild(Content) content: Content;

    // make HelloIonicPage the root (or first) page
    rootPage: any;
    menu_items_logout: any;
    menu_items_login: any;
    menu_items: any;
    menu_items_settings: any
    menu_items_contacts: any;
    menu_items_footer1: any;
    menu_items_footer2: any;
    ajaxInterval: any;

    //deviceToken: any;
    activeMenu: string;
    username: any;
    back: string;

    options = {sortBtn: {isOpen: true}}
    is_login: any = false;
    status: any = '';
    texts: any = {};
    new_message: any = '';
    message: any = {};
    avatar: string = '';
    stats: string = '';
    interval: any = true;
    alowedPages: any = [
        'AdvancedSearchPage','ChangePasswordPage','ChangePhotosPage','ContactUsPage','FaqPage',
        'FreezeAccountPage','HomePage','InboxPage','NotificationsPage','PagePage',
        'ProfilePage','SearchPage','SearchResultsPage','SettingsPage'
    ];

    constructor(public platform: Platform,
                public menu: MenuController,
                public api: ApiQuery,
                public alertCtrl: AlertController,
                public statusBar: StatusBar,
                private geolocation: Geolocation,
                public events: Events,
                public push: Push,
                public splashScreen: SplashScreen) {
        // set status bar to white
        this.statusBar.styleBlackTranslucent();

        //this.splashScreen.hide();

        this.api.showFooter = true;
        //this.api.iosVersion = this.platform.version().num < 11;

        this.initMenuItems(menu);
        var that = this;
        this.api.storage.get('password').then((val) => {
            this.initPushNotification();
            if (!val) {
                this.rootPage = LoginPage;
                this.menu_items = this.menu_items_logout;
                //this.loginPage();
            } else {
                this.menu_items = this.menu_items_login;
                //this.getBingo();
                this.rootPage = HelloIonicPage;

            }
            this.nav.setRoot(this.rootPage);
            this.nav.popToRoot();
            this.splashScreen.hide();
        });

        this.closeMsg();

        setTimeout(function () {
            that.getAppVersion();
        },300);

        this.events.subscribe('interval:updated', () => {
            var that = this;
            if(this.ajaxInterval) {
                clearInterval(this.ajaxInterval);
            }
            this.ajaxInterval = setInterval(function () {
                if (that.api.pageName != 'LoginPage' && that.api.pageName != 'RegisterPage' && that.api.username != false && that.api.username != null) {
                    that.getBingo();
                    // New Message Notification
                    that.getMessage();
                    that.getStatistics();
                }

            }, 10000);
        });

        this.initializeApp();
        this.menu1Active();

        this.events.subscribe('statistics:updated', () => {
            // user and time are the same arguments passed in `events.publish(user, time)`
            console.log('test event');
            this.getStatistics();

        });

    }

    closeMsg() {
        this.new_message = '';
    }


    getStatistics() {

        this.api.storage.get('user_id').then((id) => {
            if (id) {
                let headers = this.api.setHeaders(true);
                if (this.api.pageName == 'ChangePhotosPage') {
                    headers = this.api.setHeaders(true, false, false, '1');
                }
                this.api.http.get(this.api.url + '/user/profile/' + id, headers).subscribe(data => {
                    console.log('TEST STATISTICS');
                    // Contacts Sidebar Menu
                    //this.isPaying = data.json().userIsPaying;
                    this.menu_items_contacts[0].count = data.json().statistics.lookedme;
                    this.menu_items_contacts[1].count = data.json().statistics.looked;
                    this.menu_items_contacts[2].count = data.json().statistics.contacted;
                    this.menu_items_contacts[3].count = data.json().statistics.contactedme;
                    this.menu_items_contacts[4].count = data.json().statistics.fav;
                    this.menu_items_contacts[5].count = data.json().statistics.favedme;
                    this.menu_items_contacts[6].count = data.json().statistics.black;
                    //Footer Menu
                    this.menu_items_footer2[0].count = data.json().statistics.fav;
                    this.menu_items_footer2[1].count = data.json().statistics.favedme;

                    //Change font size depending on digits length
                    $(".footer-menu ul li span").each(function (index) {
                        if ($(this).text().length > 2) {
                            $(this).css({'font-size': '10px'});
                        }
                    });
                }, err => {
                    console.log("Oops!");
                });
            }
        });

        this.getMessage();


    }

    initMenuItems(menu) {

        this.back = 'Back';

        this.stats = menu.stats;

        this.menu_items_logout = [
            {_id: '', icon: 'log-out', title: 'Login', component: LoginPage, count: ''},
            {_id: 'blocked', icon: '', title: 'Forgot Password', component: PasswordRecoveryPage, count: ''},
            {_id: '', icon: 'mail', title: 'Contact Us', component: ContactUsPage, count: ''},
            {_id: '', icon: 'person-add', title: 'Join Free', component: RegistrationOnePage, count: ''},
        ];

        this.menu_items = [
            {_id: 'inbox', icon: '', title: 'Inbox', component: InboxPage, count: ''},
            {_id: 'the_area', icon: '', title: 'The Arena', component: ArenaPage, count: ''},
            {_id: 'notifications', icon: '', title: 'Notifications', component: NotificationsPage, count: ''},
            {_id: 'stats', icon: 'stats', title: 'Contacts', component: ProfilePage, count: ''},
            {_id: '', icon: 'search', title: 'Search', component: SearchPage, count: ''},
            {_id: '', icon: 'mail', title: 'Contact Us', component: ContactUsPage, count: ''},
            {_id: '', icon: 'information-circle', title: 'FAQ', component: FaqPage, count: ''},
            {_id: 'subscription', icon: 'md-ribbon', title: 'Subscription', component: SubscriptionPage, count: ''}
        ];

        this.menu_items_login = [
            {_id: 'inbox', icon: '', title: 'Inbox', component: InboxPage, count: ''},
            {_id: 'the_area', icon: '', title: 'The Arena', component: ArenaPage, count: ''},
            {_id: 'notifications', icon: '', title: 'Notifications', component: NotificationsPage, count: ''},
            {_id: 'stats', icon: 'stats', title: 'Contacts', component: ProfilePage, count: ''},
            {_id: '', icon: 'search', title: 'Search', component: SearchPage, count: ''},
            {_id: '', icon: 'mail', title: 'Contact Us', component: ContactUsPage, count: ''},
            {_id: '', icon: 'information-circle', title: 'FAQ', component: FaqPage, count: ''},
            {_id: 'subscription', icon: 'md-ribbon', title: 'Subscription', component: SubscriptionPage, count: ''}
        ];

        this.menu_items_settings = [
            {_id: 'edit_profile', icon: '', title: 'Edit My Profile', component: EditProfilePage, count: ''},
            {_id: 'edit_photos', icon: '', title: 'Edit Photos', component: ChangePhotosPage, count: ''},
            {_id: '', icon: 'person', title: 'My Profile', component: ProfilePage, count: ''},
            {_id: 'change_password', icon: '', title: 'Change Password', component: ChangePasswordPage, count: ''},
            {_id: 'freeze_account', icon: '', title: 'Freeze Account', component: FreezeAccountPage, count: ''},
            {_id: 'notifications', icon: '', title: 'Notifications', component: NotificationsPage, count: ''},
            {_id: 'settings', icon: 'cog', title: 'Settings', component: SettingsPage, count: ''},
            {_id: '', icon: 'mail', title: 'Contact Us', component: ContactUsPage, count: ''},
            {_id: 'logout', icon: 'log-out', title: 'Logout', component: LoginPage, count: ''}
        ];

        this.menu_items_contacts = [
            {_id: 'viewed', icon: '', title: 'Viewed', component: HelloIonicPage, list: 'looked', count: ''},
            {
                _id: 'viewed_me',
                icon: '',
                title: 'Viewed Me',
                component: HelloIonicPage,
                list: 'lookedMe',
                count: ''
            },
            {
                _id: 'contacted',
                icon: '',
                title: 'Contacted',
                component: HelloIonicPage,
                list: 'contactedThem',
                count: ''
            },
            {
                _id: 'contacted_me',
                icon: '',
                title: 'Contacted Me',
                component: HelloIonicPage,
                list: 'contactedMe',
                count: ''
            },
            {
                _id: 'favorited',
                icon: '',
                title: 'Favorited',
                component: HelloIonicPage,
                list: 'friends',
                count: ''
            },
            {
                _id: 'favorited_me',
                icon: '',
                title: 'Favorited Me',
                component: HelloIonicPage,
                list: 'addedMeToFriends',
                count: ''
            },
            {_id: '', icon: 'lock', title: 'Blocked', component: HelloIonicPage, list: 'blackList', count: ''}
        ];

        this.menu_items_footer1 = [
            {
                _id: 'online',
                src_img: 'assets/img/icons/online.png',
                icon: '',
                list: 'online',
                title: 'Online',
                component: HelloIonicPage,
                count: ''
            },
            {
                _id: 'viewed',
                src_img: 'assets/img/icons/the-arena.png',
                icon: '',
                list: 'looked',
                title: 'The Arena',
                component: ArenaPage,
                count: ''
            },
            {
                _id: 'near-me',
                src_img: '',
                title: 'Near Me',
                list: 'distance',
                icon: 'pin',
                component: HelloIonicPage,
                count: ''
            },
            {
                _id: 'inbox',
                src_img: 'assets/img/icons/inbox.png',
                icon: '',
                list: '',
                title: 'Inbox',
                component: InboxPage,
                count: ''
            },
        ];

        this.menu_items_footer2 = [
            {
                _id: '',
                src_img: 'assets/img/icons/favorited.png',
                icon: '',
                list: 'friends',
                title: 'Favorited',
                component: HelloIonicPage,
                count: ''
            },
            {
                _id: '',
                src_img: 'assets/img/icons/favorited_me.png',
                icon: '',
                list: 'addedMeToFriends',
                title: 'Favorited Me',
                component: HelloIonicPage,
                count: ''
            },

            {
                _id: 'notifications',
                src_img: 'assets/img/icons/notifications_ft.png',
                list: '',
                icon: '',
                title: 'Notifications',
                component: NotificationsPage,
                count: ''
            },
            {_id: '', src_img: '', icon: 'search', title: 'Search', list: '', component: SearchPage, count: ''},
        ];
    }


    menu1Active(bool = true) {
        this.activeMenu = 'menu1';
        this.menu.enable(true, 'menu1');
        this.menu.enable(false, 'menu2');
        this.menu.enable(false, 'menu3');
        if (bool) {
            this.menu.toggle();
        }
    }

    menu2Active() {
        this.activeMenu = 'menu2';
        this.menu.enable(false, 'menu1');
        this.menu.enable(true, 'menu2');
        this.menu.enable(false, 'menu3');
        this.menu.toggle();
    }

    menu3Active() {
        this.activeMenu = 'menu3';
        this.menu.enable(false, 'menu1');
        this.menu.enable(false, 'menu2');
        this.menu.enable(true, 'menu3');
        this.menu.toggle();
    }

    menuCloseAll() {
        if (this.activeMenu != 'menu1') {
            //this.menu.toggle();
            this.activeMenu = 'menu1';
            this.menu.enable(true, 'menu1');
            this.menu.enable(false, 'menu2');
            this.menu.enable(false, 'menu3');
            this.menu.close();
            //this.menu.toggle();
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.splashScreen.hide();
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need
            this.statusBar.show();
            //this.statusBar.styleBlackOpaque();
            //this.statusBar.overlaysWebView(true);
            //this.statusBar.backgroundColorByName('black');
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#F2183e7c');
        });
    }

    initPushNotification() {
        if (!this.platform.is('cordova')) {
            console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
            return;
        }
        const options: PushOptions = {
            android: {
                senderID: "95543012588",
                sound: true
            },
            ios: {
                "alert": "true",
                "sound": "true",
                "badge": "true",
                "clearBadge": "true",
            },
            windows: {}
        };

        const push2: PushObject = this.push.init(options);

        push2.on('registration').subscribe( (data) => {
            //this.deviceToken = data.registrationId;
            this.api.storage.set('deviceToken', data.registrationId);
            console.log("device token ->", data.registrationId);
            this.api.sendPhoneId(data.registrationId);
            //TODO - send device token to server
        });

        push2.on('notification').subscribe( (data) => {
            let self = this;
            //if user using app and push notification comes
            if (data.additionalData.foreground == false) {
                //self.nav.push(InboxPage);
                this.api.storage.get('user_id').then((val) => {
                    if (val) {
                        self.nav.push('InboxPage');
                    } else {
                        self.nav.push('LoginPage');
                    }
                });
            }
        });

        push2.on('error').subscribe( (e) => {
            console.log("PUSH PLUGIN ERROR: " + JSON.stringify(e));
        });
    }


    swipeFooterMenu() {
        if ($('.more-btn').hasClass('menu-left')) {
            $('.more-btn').removeClass('menu-left');

            $('.more-btn').parents('.menu-one').animate({
                'margin-left': '-92%'
            }, 1000);
        } else {
            $('.more-btn').addClass('menu-left');

            $('.more-btn').parents('.menu-one').animate({
                'margin-left': '0'
            }, 1000);
        }
    }

    removeBackground() {
        // $('#menu3, #menu2').find('ion-backdrop').remove();
    }

    openPage(page) {


        if (page._id == 'logout') {
            this.status = '';
        } else if (page._id == 'subscription') {
            this.api.storage.get('user_id').then((user_id) => {
                if(user_id) {
                    window.open('https://m.dating4disabled.com/subscription/?app_user_id=' + user_id, '_blank');
                }
            });
        }

        if (page._id == 'stats') {
            this.menu3Active();
        } else {
            // close the menu when clicking a link from the menu
            this.menu.close();

            let params = '';

            // navigate to the new page if it is not the current page

            if (page.list == 'online') {
                params = JSON.stringify({
                    action: 'online'
                });
            } else if (page.list == 'distance') {
                params = JSON.stringify({
                    action: 'online',
                    list: page.list
                });
            }
            else {

                params = JSON.stringify({
                    action: 'list',
                    list: page.list
                });
            }
            if (page._id != 'subscription') {
                this.nav.push(page.component, {page: page, action: 'list', params: params});
            }
        }
    }


    homePage() {
        this.api.storage.get('user_id').then((val) => {
            if (val) {
                this.nav.push(HelloIonicPage);
            } else {
                this.nav.push(LoginPage);
            }
        });
    }

    getBingo() {
        this.api.storage.get('user_id').then((val) => {
            if (val && this.api.password) {
                let headers = this.api.setHeaders(true);
                if (this.api.pageName == 'ChangePhotosPage') {
                    headers = this.api.setHeaders(true, false, false, '1');
                }
                if (this.api.pageName != 'BingoPage' && this.api.pageName != 'DialogPage') {
                    this.api.http.get(this.api.url + '/user/bingo', headers).subscribe(data => {
                        //this.api.storage.set('status', this.status);
                        this.avatar = data.json().texts.photo;
                        this.texts = data.json().texts;
                        this.checkStatus();

                        if (data.json().bingo.itemsNumber > 0) {
                            this.nav.push(BingoPage, {data: data.json()});
                            let params = JSON.stringify(data.json().bingo.items[0]);
                            this.api.http.post(this.api.url + '/user/bingo/splashed', params, this.api.setHeaders(true)).subscribe(data => {
                                console.log('Splashed',);
                            });
                        }
                    }, err => {
                    });
                }
            }
        });
        //this.nav.push(BingoPage);
    }

    loginPage() {
        this.nav.push(LoginPage);
    }

    dialogPage() {
        let user = {id: this.new_message.userId};
        this.closeMsg();
        this.nav.push(DialogPage, {user: user});
    }

    getMessage() {
        let headers = this.api.setHeaders(true);
        if (this.api.pageName == 'ChangePhotosPage') {
            headers = this.api.setHeaders(true, false, false, '1');
        }
        this.api.http.get(this.api.url + '/user/newMessagesCount', headers).subscribe(data => {

            if ((this.new_message == '' || typeof this.new_message == 'undefined') && this.api.pageName != 'DialogPage') {
                this.new_message = data.json().messages;
                if (typeof this.new_message == 'object') {

                    this.api.http.get(this.api.url + '/messages/notify/' + this.new_message.id, this.api.setHeaders(true)).subscribe(data => {
                    });
                }
            }

            this.message = data.json();
            this.menu_items[2].count = data.json().newNotificationsCount;
            this.menu_items[0].count = data.json().newMessagesCount;
            this.menu_items_footer2[2].count = data.json().newNotificationsCount;
            this.menu_items_footer1[3].count = data.json().newMessagesCount;
        }, err => {
            this.api.hideLoad();
        });
    }

    checkStatus() {

        if (this.api.pageName != 'LoginPage' && this.api.pageName != 'PasswordRecoveryPage' && this.api.pageName != 'ContactUsPage' && this.api.pageName != 'ChangePhotosPage'
            && this.api.pageName != 'RegisterPage' && this.api.pageName != 'PagePage') {
            let headers = this.api.setHeaders(true);
            if (this.api.pageName != 'ChangePhotosPage') {
                headers = this.api.setHeaders(true, false, false, '1');
            }
            this.api.http.get(this.api.url + '/user/login', headers).subscribe(data => {
                    this.api.storage.set('status', 'login');
                    this.api.is_payed = data.json().isPayed;
                },
                err => {
                    //this.api.storage.remove('status');
                    this.api.register.status = false;
                    this.nav.push(LoginPage, {page: {_id: 'logout'}});
                });
        }
    }

    alert(title, subTitle) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: [{
                text: 'Ok',
                handler: data => {
                    Market.open('com.nysd');
                }
            }]
        });
        alert.present();
    }

    getAppVersion() {

        this.api.http.get(this.api.url + '/app/version/', this.api.header).subscribe(data => {
            if (this.platform.is('cordova')) {
                var ios = data.json().ios;
                if (parseInt(ios.version) > parseInt(this.api.version)) {
                    let prompt = this.alertCtrl.create({
                        title: ios.title,
                        message: ios.message,
                        cssClass: 'new-version',
                        buttons: [
                            {
                                text: data.json().cancel,
                                handler: data => {
                                    console.log('Cancel clicked');
                                    if(ios.update){
                                        this.getAppVersion();
                                    }
                                }
                            },
                            {
                                text: data.json().update,
                                handler: data => {
                                    window.open(ios.url, '_system');
                                    if(ios.update){
                                        this.getAppVersion();
                                    }
                                }
                            }
                        ]
                    });
                    prompt.present();
                }
            }
        }, err => {
        });
    }


    getBanner() {
        this.api.http.get(this.api.url + '/user/banner/', this.api.setHeaders(true)).subscribe(data => {
            this.api.banner = data.json().banner;
            console.log(this.api.banner);
        });
    }

    goTo(link, target = '_blank') {
        window.open(link, target);
        return false;
    }


    ngAfterViewInit() {

        this.nav.viewDidEnter.subscribe((view) => {
            console.log(this.api.pageName);
            if(this.api.pageName != 'SelectPage' && this.api.pageName != 'PagePage' && this.api.username && this.api.username) {
                var that = this;
                setTimeout(function () {
                    that.getBanner();
                    that.getBingo();
                    that.getMessage();
                    that.getStatistics();
                }, 300);
                // clearInterval(this.ajaxInterval);
                // this.ajaxInterval = setInterval(function () {
                //     if (that.api.pageName != 'LoginPage' && that.api.pageName != 'RegisterPage' && that.api.username != false && that.api.username != null) {
                //         that.getBingo();
                //         // New Message Notification
                //         that.getMessage();
                //         that.getStatistics();
                //     }
                //
                // }, 10000);
                this.events.publish('interval:updated');
            }


            if (this.api.pageName != 'DialogPage') {
                this.api.showFooter = true;
                console.log( this.api.showFooter + ' 1' );
            }


            if (this.api.pageName == 'HomePage') {
                this.api.setLocation();
            }

            if (this.api.pageName == 'LoginPage') {
                this.interval = false;
            }

            if(this.api.pageName != 'ChangePhotosPage' && this.api.pageName != 'LoginPage' && this.api.pageName != 'PasswordRecoveryPage'
                && this.api.pageName != 'ContactUsPage' && this.api.pageName != 'ChangePhotosPage'
                && this.api.pageName != 'RegisterPage' && this.api.pageName != 'PagePage') {
                this.api.http.get(this.api.url + '/user/login', this.api.setHeaders(true)).subscribe(data => {
                        this.api.register.status = false;
                    },
                    err => {
                        if(this.api.pageName != 'LoginPage' && this.api.pageName != 'PasswordRecoveryPage' && this.api.pageName != 'ContactUsPage' && this.api.pageName != 'ChangePhotosPage'
                            && this.api.pageName != 'RegisterPage' && this.api.pageName != 'PagePage' && this.api.pageName != 'ChangePhotosPage') {
                            if (this.api.register.status == 'not_activated') {
                                let alert = this.alertCtrl.create({
                                    message: this.api.register.text,
                                    buttons: ['ok']
                                });
                                alert.present();
                            }
                        }
                    });
            }

            this.api.setHeaders(true);

            this.api.storage.get('status').then((val) => {
                if (this.status == '') {
                    this.status = val;
                }
                this.checkStatus();

                if (!val) {
                    this.menu_items = this.menu_items_logout;
                    this.is_login = false;
                } else {
                    //this.getStatistics();
                    this.is_login = true;
                    this.menu_items = this.menu_items_login;

                }
                this.api.hideLoad();
            });

            this.api.storage.get('username').then((username) => {
                this.username = username;
            });
        });
    }
}
