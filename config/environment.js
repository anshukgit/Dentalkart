import {Platform} from 'react-native';
import {Dimensions, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
export const window = Dimensions.get('screen');
export const DeviceHeight = window.height;
export const DeviceWidth = window.width;
export const BASE_URL = 'https://www.dentalkart.com/';
export const productBaseUrl =
  'https://images1.dentalkart.com/media/catalog/product';
export const productBaseUrlSlash =
  'https://images1.dentalkart.com/media/catalog/product/';
export const MEDIA_URL = 'https://images1.dentalkart.com/media/';
export const PrimaryColor = '#f3943d';
export const SecondaryColor = '#2b79ac';
export const PrimaryTextColor = '#fff';
export const HeaderHeight = Platform.select({ios: 50, android: 50});
export const StatusBarColor = '#1e5274';
export const StatusBarHeight = getStatusBarHeight();
export const GoogleLoginConfigs = {
  webClientId:
    '285108782909-ouh6alnd146f1het75vn5lvim26tuvpm.apps.googleusercontent.com',
  iosClientId: '',
};
export const Version = '98.6.15';
export const BrandingStartDate = 1591468200000;
export const BrandingEndDate = 1609396199000;
export const SaleStartDate = 'February 8, 2021 00:00:00';
export const SaleEndDate = 'February 14, 2021 23:59:59';
export const razorPayKeyId = 'rzp_live_aKPnivjFyydsiI';
export const razorPayTestKeyId = 'rzp_test_RbCNWhVGKShTuI';
// export const BrandingEndDate = new Date().getTime("June 07, 2020 00:00:00");
//ToastAndroid
