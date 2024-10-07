import React from 'react';
import WhatsApp from '@components/whatsApp';
import {Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '@screens/home';
import MemberShip from '../../screens/membership';
import MyMemberShip from '../../screens/membership/myMembership';
import UrlResolver from '@screens/url_resolver';
import Account from '@screens/account';
import Profile from '@screens/account/modules/profile';
import MyReferral from '@screens/account/modules/referral';
import OrdersList from '@screens/account/modules/orders/modules/orders_list';
import PastReturns from '@screens/account/modules/orders/modules/past_returns';
import OrderDetails from '@screens/account/modules/orders/modules/order_details';
import TrackingDetails from '@screens/account/modules/orders/modules/tracking_details';
import TicketList from '@screens/account/modules/tickets/modules/ticket_list';
import TicketDetails from '@screens/account/modules/tickets/modules/ticket_details';
import MyRewards from '@screens/account/modules/rewards';
import ShopByCategory from '@screens/shopbycategory';
import Category from '@screens/category';
import ProductListing from '@screens/category/modules/product_listing';
import ProductDetails from '@screens/product';
import Cart from '@screens/cart';
import HelpCenter from '@screens/helpcenter';
import FaqQuestions from '@screens/helpcenter/modules/questions';
import FaqAnswers from '@screens/helpcenter/modules/answers';
import ContactUs from '@screens/helpcenter/modules/contact_us';
import {Reviews} from '@screens/reviews';
import Search from '@screens/search';
import Wishlist from '@screens/wishlist';
import Country from '@screens/country/country';
import Branding from '@screens/branding';
import {Address, EditAddress} from '@screens/address';
import {
  ReturnListScreen,
  RmaHistoryScreen,
  CreateReturnScreen,
} from '@screens/account/modules/return_and_refunds';
import Payment from '@screens/payment';
import Webview from '@screens/webview';
import OrderSuccess from '@screens/orderSuccess';
import BrandPageScreen from '@screens/brandPage';
import News from '@screens/news';
import NewsDetails from '@screens/news/modules/NewsDetails';
import VideoPlay from '@screens/news/modules/VideoPlay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PrimaryColor, SecondaryColor} from '@config/environment';
import trackDetails from '@screens/account/modules/orders/modules/track_details';
import orderSummary from '@screens/account/modules/orders/modules/order_summary';
import transitDetails from '@screens/account/modules/orders/modules/transit_details';
import colors from '../colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SavedNews from '../../screens/news/modules/SavedNews';
// import Multimedia from '../../screens/news/modules/Multimedia';
import MultimediaNew from '../../screens/news/modules/MultimediaNew';
import VideoNews from '../../screens/news/modules/VideoNews';
import OrderReturnSection from '../../screens/account/modules/orderReturnItemsSection';
import ReturnTnC from '../../screens/account/modules/orderReturnItemsSection/components/returnTnC';
import DeliveryCharges from '../../screens/cart/modules/delivery_charges';

console.disableYellowBox = true;
const Tabs = createBottomTabNavigator(
  {
    Home: Home,
    Category: ShopByCategory,
    Video: MultimediaNew,
    Account: Account,
    WhatsApp: Home,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let imageName;
        let color;
        if (routeName === 'Home') {
          imageName = focused
            ? require('../../assets/Tabs/Selected/Home.png')
            : require('../../assets/Tabs/Home.png');
        } else if (routeName === 'Video') {
          color = focused ? '#0ea1e0' : '';
          imageName = focused
            ? require('../../assets/Tabs/Multimedia.png')
            : require('../../assets/Tabs/Multimedia.png');
        } else if (routeName === 'Account') {
          imageName = focused
            ? require('../../assets/Tabs/Selected/Profile.png')
            : require('../../assets/Tabs/Profile.png');
        } else if (routeName === 'Category') {
          imageName = focused
            ? require('../../assets/Tabs/Selected/Category.png')
            : require('../../assets/Tabs/Category.png');
        } else if (routeName === 'WhatsApp') {
          return <WhatsApp />;
        }
        return (
          <Image
            source={imageName}
            resizeMode="contain"
            style={{
              tintColor: color,
              width: wp('5%'),
              height: wp('5%'),
            }}
          />
        );
      },
      tabBarOnPress: ({navigation, defaultHandler}) => {
        if (navigation.state.routeName === 'WhatsApp') {
          return true;
        } else {
          defaultHandler();
        }
      },
    }),
    tabBarOptions: {
      tabStyle: {
        marginVertical: hp('.5%'),
      },
      labelStyle: {
        fontSize: wp('3.5%'),
      },
      style: {
        backgroundColor: colors.LightBlue,
        height: hp('7%'),
      },
      activeTintColor: colors.DarkBlue,
      inactiveTintColor: '#383838',
      safeAreaInset: 'bottom',
    },
  },
);

const NewsTabs = createBottomTabNavigator(
  {
    Shop: Home,
    News: News,
    // Multimedia: Multimedia,
    Shorts: MultimediaNew,
    Saved: SavedNews,
  },
  {
    initialRouteName: 'News',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let imageName;
        let color;
        if (routeName === 'Shop') {
          imageName = focused
            ? require('../../assets/Tabs/Selected/Home.png')
            : require('../../assets/Tabs/Home.png');
          color = focused ? '#0ea1e0' : '';
        } else if (routeName === 'News') {
          imageName = focused
            ? require('../../assets/Tabs/Selected/News.png')
            : require('../../assets/Tabs/News.png');
          color = focused ? '#0ea1e0' : '';
          // } else if (routeName === 'Multimedia') {
        } else if (routeName === 'Shorts') {
          imageName = focused
            ? require('../../assets/Tabs/Multimedia.png')
            : require('../../assets/Tabs/Multimedia.png');
          color = focused ? '#0ea1e0' : '';
        } else if (routeName === 'Saved') {
          imageName = focused
            ? require('../../assets/Tabs/Saved.png')
            : require('../../assets/Tabs/Saved.png');
          color = focused ? '#0ea1e0' : '';
        }
        return (
          <Image
            source={imageName}
            resizeMode="contain"
            style={{
              tintColor: color,
              width: wp('5%'),
              height: wp('5%'),
            }}
          />
        );
      },
      tabBarOnPress: ({navigation, defaultHandler}) => {
        if (navigation.state.routeName === 'Shop') {
          navigation.replace('Tabs');
        } else {
          defaultHandler();
        }
      },
    }),
    tabBarOptions: {
      tabStyle: {
        marginVertical: hp('.5%'),
      },
      labelStyle: {
        fontSize: wp('3.5%'),
      },
      style: {
        backgroundColor: colors.LightBlue,
        height: hp('7%'),
      },
      activeTintColor: colors.DarkBlue,
      inactiveTintColor: '#383838',
      safeAreaInset: 'bottom',
    },
  },
);

export const AppStack = createStackNavigator(
  {
    Tabs,
    NewsTabs,
    UrlResolver: UrlResolver,
    Account: Account,
    Profile: Profile,
    MyReferral: MyReferral,
    ShopByCategory: ShopByCategory,
    OrdersList: OrdersList,
    OrderDetails: OrderDetails,
    TrackingDetails: TrackingDetails,
    BrandPageScreen: BrandPageScreen,
    MyRewards: MyRewards,
    TicketList: TicketList,
    TicketDetails: TicketDetails,
    Category: Category,
    Reviews: Reviews,
    HelpCenter: HelpCenter,
    FaqQuestions: FaqQuestions,
    FaqAnswers: FaqAnswers,
    ContactUs: ContactUs,
    ProductListing: ProductListing,
    ReturnListScreen: ReturnListScreen,
    RmaHistoryScreen: RmaHistoryScreen,
    CreateReturnScreen: CreateReturnScreen,
    orderSummary: orderSummary,
    transitDetails: transitDetails,
    trackDetails: trackDetails,
    ProductDetails: {
      screen: ProductDetails,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        header: null,
      },
    },
    Wishlist: Wishlist,
    Cart: Cart,
    Search,
    Address,
    EditAddress,
    Country,
    Branding,
    Payment,
    Webview,
    NewsDetails,
    OrderSuccess,
    OrderReturnSection,
    DeliveryCharges,
    VideoPlay,
    MemberShip,
    MyMemberShip,
    VideoNews,
    ReturnTnC,
    PastReturns,
  },
  {
    initialRouteName: 'Tabs',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);
