import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler, Nav} from 'ionic-angular';
import {MyApp} from './app.component';
import {HelloIonicPage} from '../pages/hello-ionic/hello-ionic';
import {LoginPage} from '../pages/login/login';
import {ChangePasswordPage} from '../pages/change-password/change-password';
import {SearchPage} from '../pages/search/search';
import {ChangePhotosPage} from '../pages/change-photos/change-photos';
import {EditProfilePage} from '../pages/edit-profile/edit-profile';
import {ContactUsPage} from '../pages/contact-us/contact-us';
import {ProfilePage} from '../pages/profile/profile';
import {FullScreenProfilePage} from '../pages/full-screen-profile/full-screen-profile';
import {SettingsPage} from '../pages/settings/settings';
import {FreezeAccountPage} from '../pages/freeze-account/freeze-account';
import {ArenaPage} from '../pages/arena/arena';
import {InboxPage} from '../pages/inbox/inbox';
import {NotificationsPage} from '../pages/notifications/notifications';
import {DialogPage} from '../pages/dialog/dialog';
import {ApiQuery} from '../library/api-query';
import {PasswordRecoveryPage} from '../pages/password-recovery/password-recovery';
import {RegistrationOnePage} from '../pages/registration-one/registration-one';
import {BingoPage} from '../pages/bingo/bingo';
import {PagePage} from '../pages/page/page';
import {FaqPage} from "../pages/faq/faq";
import {IonicStorageModule} from '@ionic/storage';
import {AdvancedSearchPage} from "../pages/advanced-search/advanced-search";
import {SubscriptionPage} from "../pages/subscription/subscription";
import {SearchResultsPage} from "../pages/search-results/search-results";
import { Keyboard } from '@ionic-native/keyboard';
import {SelectPageModule} from "../pages/select/select.module";
import {HttpModule} from "@angular/http";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Device} from "@ionic-native/device";
import {ImagePicker} from "@ionic-native/image-picker";
import {FileTransfer} from "@ionic-native/file-transfer";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {Camera} from "@ionic-native/camera";
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {Geolocation} from "@ionic-native/geolocation";
import {BrowserModule} from "@angular/platform-browser";
import {Push} from "@ionic-native/push";
import {Deeplinks} from "@ionic-native/deeplinks";



@NgModule({
    declarations: [
        MyApp,
        HelloIonicPage,
        LoginPage,
        ChangePasswordPage,
        SearchPage,
        ChangePhotosPage,
        ContactUsPage,
        ProfilePage,
        FullScreenProfilePage,
        SettingsPage,
        FreezeAccountPage,
        ArenaPage,
        InboxPage,
        NotificationsPage,
        DialogPage,
        EditProfilePage,
        PasswordRecoveryPage,
        RegistrationOnePage,
        BingoPage,
        PagePage,
        FaqPage,
        ApiQuery,
        AdvancedSearchPage,
        SearchResultsPage,
        SubscriptionPage
    ],
    imports: [
        IonicModule.forRoot(MyApp, {
            menuType: 'overlay',
            preloadModules: true
           // statusbarPadding: true
        }),
        SelectPageModule,
        IonicStorageModule.forRoot(),
        HttpModule,
        BrowserModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AdvancedSearchPage,
        HelloIonicPage,
        SearchResultsPage,
        LoginPage,
        ChangePasswordPage,
        SearchPage,
        ChangePhotosPage,
        ContactUsPage,
        ProfilePage,
        FullScreenProfilePage,
        SettingsPage,
        FreezeAccountPage,
        ArenaPage,
        InboxPage,
        NotificationsPage,
        DialogPage,
        EditProfilePage,
        PasswordRecoveryPage,
        RegistrationOnePage,
        BingoPage,
        PagePage,
        FaqPage,
        SubscriptionPage
    ],
    providers: [
        Nav,
        Keyboard,
        StatusBar,
        SplashScreen,
        Device,
        Geolocation,
        ImagePicker,
        FileTransfer,
        InAppPurchase,
        Camera,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiQuery,
        ArenaPage,
        Media, File,
        Push,
        Geolocation,
        Deeplinks
    ]
})

export class AppModule {
}
