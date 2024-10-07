import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Modal,
  ToastAndroid,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import {InstantSearch} from 'react-instantsearch/native';
import {
  connectStateResults,
  connectRefinementList,
} from 'react-instantsearch/connectors';
import {Hits} from './Hits';
import {SearchBox, SearchPage} from './SearchBox.bkp';
import {SearchPageStyle} from './searchPageStyle';
import {DentalkartContext} from '@dentalkartContext';
import {addToCart} from '@screens/cart';
import {client, client2, newclient} from '@apolloClient';
import {ADD_TO_WISHLIST_QUERY} from '@screens/product/graphql';
import tokenClass from '@helpers/token';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import SyncStorage from '@helpers/async_storage';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import {SafeAreaView} from 'react-native';
import {StatusBarScreen} from '../../components/statusbar';
import {Text} from 'native-base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';

class Dummy extends React.PureComponent {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      hits: '',
      isSearched: false,
      productClicked: false,
      productClickedId: '',
      searchTerm: '',
      addToCartResponse: props.addToCartResponse,
      addToWishListResponse: props.addToWishListResponse,
      currentCurrencyCode: '',
      showfilter: false,
      searchState: {},
    };
  }
  saveHits(hits) {
    this.setState({hits});
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Search',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.setState({currentCurrencyCode: this.context?.country?.currency_code});
    this.triggerScreenEvent();
  }
  searchResult(hit) {
    if (this.state.hits) {
      this.setState({
        searchTerm: hit,
        isSearched: true,
        productClicked: false,
        productClickedId: '',
        app_id: '',
        api_key: '',
      });
    }
  }
  async addToWishList(product) {
    let isLoggedIn = await tokenClass.loginStatus();
    if (!isLoggedIn) {
      this.setState({isSearched: false});
      this.props.navigation.navigate('Login', {screen: 'Search'});
    } else {
      try {
        const data = newclient.mutate({
          mutation: ADD_TO_WISHLIST_QUERY,
          variables: {product_ids: [product.objectID], sku: product.sku},
        });
        return showSuccessMessage('Added to Wishlist');
      } catch (err) {
        console.log(err);
      }
    }
  }
  async addToCart(product) {
    if (product.type_id === 'simple') {
      const result = await addToCart(product, this.context);
      this.context.getUserInfo();
      return result;
    } else {
      this.navigateToDetail(product);
    }
  }
  navigateToDetail(item) {
    this.setState({isSearched: false});
    this.props.navigation.push('ProductDetails', {
      productId: item?.id,
      productUrl: item.url_key,
    });
  }

  async componentWillMount() {
    let app_id = await SyncStorage.get('app_id');
    let app_key = await SyncStorage.get('api_key');
    this.setState({app_id, app_key});
  }

  onSearchStateChange = searchState => {
    console.log('ccaleed called', searchState);
    this.setState(() => ({
      searchState,
    }));
  };

  render() {
    const app_id = this.state.app_id || 'UQ589HLQT3';
    const api_key = this.state.app_key || '9acdf6adbc945f1cc46be269df3f8bdb';
    return (
      <View style={{flex: 1}}>
        <StatusBarScreen />
        <InstantSearch
          appId={app_id}
          apiKey={api_key}
          indexName="dentalkart_default_products"
          // searchState={this.state.searchState}
          // onSearchStateChange={this.onSearchStateChange}
        >
          <SearchBox _this={this} />
          <RefinementList attribute="rating_count" heading="Rating" limit={5} />

          <ModalFilter _this={this} />
          <Content
            navigation={this.props.navigation}
            _this={this}
            currentCurrency={this.state.currentCurrencyCode}
          />
        </InstantSearch>
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={this.state.isSearched}
          onRequestClose={() => this.setState({isSearched: false})}>
          <SearchPage
            hits={this.state.hits}
            _this={this}
            currency={this.state.currentCurrencyCode}
          />
        </Modal>
      </View>
    );
  }
}
// <View style={SearchPageStyle.emptySearchWrapper}>
// 	<Image source={{uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/App/SearchHelloTP.png'}} style={SearchPageStyle.searchImage} />
// </View>

// <InstantSearch
// 	appId="UQ589HLQT3"
// 	apiKey="9acdf6adbc945f1cc46be269df3f8bdb"
// 	indexName="dentalkart_default_products"
// >
const ModalFilter = ({_this}) => {
  const app_id = _this.state.app_id || 'UQ589HLQT3';
  const api_key = _this.state.app_key || '9acdf6adbc945f1cc46be269df3f8bdb';
  console.log('sdfsdfsdf', _this.state);
  if (_this.state.showfilter) {
    return (
      // <Modal animationType="slide" visible={_this.state.showfilter}>
      <SafeAreaView
        style={{
          zIndex: 10,
          position: 'absolute',
          width: wp('100%'),
          height: hp('100%'),
          alignSelf: 'center',
          backgroundColor: '#FFF',
        }}>
        <View
          style={{
            width: wp('90%'),
            height: hp('90%'),
            alignSelf: 'center',
          }}>
          <ScrollView>
            {/* <InstantSearch
              appId={app_id}
              apiKey={api_key}
              indexName="dentalkart_default_products"
              searchState={_this.state.searchState}
              onSearchStateChange={_this.onSearchStateChange}
            > */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: wp('5%'),
                  color: '#25303C',
                  fontWeight: '600',
                }}>
                Filters
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => _this.setState({showfilter: false})}
                style={{
                  paddingHorizontal: wp('4%'),
                  paddingVertical: hp('2%'),
                }}>
                <MCIcon name="close" size={wp('6%')} color={'#2E3A59'} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: hp('1%'),
              }}>
              <RefinementList
                attribute="manufacturer"
                heading="Manufacturer"
                items={_this.state.hits}
              />
            </View>
            <View
              style={{
                marginTop: hp('2%'),
              }}>
              <RefinementList
                attribute="rating_count"
                heading="Rating"
                limit={5}
              />
            </View>
            {/* </InstantSearch> */}
          </ScrollView>
        </View>
      </SafeAreaView>
      // </Modal>
    );
  }
  return null;
};
const RefinementList = connectRefinementList(data => {
  console.log('dasdfsfsdf', data);
  const {heading, items, refine} = data;
  console.log('items', items);
  return (
    <View style={{}}>
      <View
        style={{
          marginVertical: hp('1%'),
        }}>
        <Text
          style={{
            color: '#25303C',
            fontWeight: '500',
            fontSize: wp('4.5%'),
          }}>
          {heading}
        </Text>
      </View>
      <View style={{}}>
        {items.map(item => {
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => refine(item.value)}
              style={{
                marginTop: hp('1%'),
                marginLeft: wp('1%'),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                disabled={false}
                value={item.isRefined}
                boxType={'square'}
                onFillColor={'black'}
                onTintColor={'black'}
                onCheckColor={'#FFF'}
                style={{
                  height: 18,
                }}
              />
              {heading === 'Rating' ? (
                <>
                  <MCIcon
                    name="star"
                    style={SearchPageStyle.star}
                    size={18}
                    color={parseInt(item?.label) >= 1 ? '#FFC107' : '#C4C4C4'}
                  />
                  <MCIcon
                    name="star"
                    style={SearchPageStyle.star}
                    size={18}
                    color={parseInt(item?.label) >= 2 ? '#FFC107' : '#C4C4C4'}
                  />
                  <MCIcon
                    name="star"
                    style={SearchPageStyle.star}
                    size={18}
                    color={parseInt(item?.label) >= 3 ? '#FFC107' : '#C4C4C4'}
                  />
                  <MCIcon
                    name="star"
                    style={SearchPageStyle.star}
                    size={18}
                    color={parseInt(item?.label) >= 4 ? '#FFC107' : '#C4C4C4'}
                  />
                  <MCIcon
                    name="star"
                    style={SearchPageStyle.star}
                    size={18}
                    color={parseInt(item?.label) >= 5 ? '#FFC107' : '#C4C4C4'}
                  />
                  <Text style={{color: '#C4C4C4'}}>{` & Up to`}</Text>
                </>
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#666666',
                    fontSize: wp('4%'),
                  }}>
                  {item.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const Content = connectStateResults(
  ({searchState, searchResults, props, _this, currentCurrency}) => {
    const hasResults =
      searchState.query && searchResults && searchResults.nbHits !== 0;
    const currencyCode = currentCurrency || 'INR';
    return !searchState.query ? (
      <>
        <View style={SearchPageStyle.textFilterContainer}>
          <Text style={{color: '#696969'}}>
            Showing <Text style={{fontWeight: 'bold'}}>100</Text> result
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => _this.setState({showfilter: true})}
            style={SearchPageStyle.filterContainer}>
            <MCIcon name="filter" size={wp('5%')} color={'#C4C4C4'} />
            <Text style={SearchPageStyle.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <Hits
          currency={currencyCode}
          navigation={props.navigation}
          _this={_this}
        />
      </>
    ) : hasResults ? (
      <>
        <View style={SearchPageStyle.textFilterContainer}>
          <Text style={{color: 'gray'}}>
            Showing{' '}
            <Text style={{fontWeight: 'bold'}}>
              {searchResults.hits.length}
            </Text>{' '}
            result
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => _this.setState({showfilter: true})}
            style={SearchPageStyle.filterContainer}>
            <MCIcon name="filter" size={wp('5%')} color={'#C4C4C4'} />
            <Text style={SearchPageStyle.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <Hits
          currency={currencyCode}
          navigation={props.navigation}
          _this={_this}
        />
      </>
    ) : (
      <View style={SearchPageStyle.emptySearchWrapper}>
        <Image
          resizeMode="contain"
          source={require('../../assets/notfound.png')}
          style={SearchPageStyle.searchImage}
        />
        <Text style={SearchPageStyle.notFoundHeading}>We're Sorry!</Text>
        <Text style={SearchPageStyle.notFoundSubHeading}>
          We can seem to find any product(s) that match your search for '
          <Text style={SearchPageStyle.notFoundText}>{searchState.query}</Text>'
        </Text>
      </View>
    );
  },
);

export default Dummy;
