import React, {useContext, useCallback, useState, useEffect} from 'react';
// First, we need to add the connectInfiniteHits connector to our import
// We also need to import the FlatList and other React Native component
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import {CustomHighlight} from './HighlightQuery';
import {AddToCartButton} from './addToCartButton';
import {SearchPageStyle} from './searchPageStyle';
import {DentalkartContext} from '@dentalkartContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ADD_TO_WISHLIST_QUERY} from '../product/graphql';
import {newclient} from '@apolloClient';
import {showSuccessMessage} from '@helpers/show_messages';
import {SecondaryColor} from '@config/environment';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';
import tokenClass from '@helpers/token';
import {GET_ALL_PROMOTION_PRODUCT} from '../home/graphql';
import {freeGiftClient, promotionBySkuClient} from '../../apollo_client';

const getProductUrl = product => {
  let url = '#';
  const indexedPrefix = 'https://www.dentalkart.com/';
  if (product && product.url) {
    const urlsub = product.url.replace('.html', '');
    url = urlsub.replace(indexedPrefix, '');
  }

  if (product && product.url_key) {
    url = `${product.url_key}`;
  }
  return url;
};
const handlePress = (navigation, item) => {
  const {push} = navigation;
  const url = getProductUrl(item);
  push('UrlResolver', {
    productId: item?.object_id,
    productUrl: url,
    url_key: url,
  });
};

const addToCartButtonVisibility = product => {
  const demoPrice =
    product.demo_available &&
    (product.demo_available === '1' || product.demo_available === 'Yes')
      ? true
      : false;
  const reqPrice = product.msrp ? true : false;
  const hideButton = reqPrice || demoPrice;

  return hideButton;
};

export const ProductList = ({
  products,
  pageNumber,
  loading,
  totalPages,
  navigation,
  searchData,
  setPageNumber,
  flatListRef,
}) => {
  const context = useContext(DentalkartContext);
  const {country} = context;
  const [freeProduct, setFreeProduct] = useState('');
  /* if there are still results, you can call the refine function to load more */
  // const {allPromotionProducts} = this.props;
  // console.log(
  //   'allPromotionProducts=====================',
  //   allPromotionProducts,
  // );
  console.log('freeProduct============33', freeProduct);
  const addToWishlist = useCallback(async product => {
    let isLoggedIn = await tokenClass.loginStatus();
    if (!isLoggedIn) {
      navigation.navigate('Login', {
        screen: 'Search',
      });
    } else {
      try {
        const data = await newclient.mutate({
          mutation: ADD_TO_WISHLIST_QUERY,
          variables: {product_ids: [parseInt(product?.object_id)]},
          fetchPolicy: 'no-cache',
        });
        showSuccessMessage('Added to Wishlist', 'top');
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const getAllItemPromotionProducts = async () => {
    try {
      const {data} = await freeGiftClient.query({
        query: GET_ALL_PROMOTION_PRODUCT,
      });
      // console.log('data==ddd===ddd===09090@@@==', data);
      if (data?.getAllItemPromotionProducts) {
        setFreeProduct(data?.getAllItemPromotionProducts);
      }
    } catch (error) {
      console.log('error========== getAllItemPromotionProducts', error);
      // showErrorMessage(`${error.message}. Please try again.`);
    }
  };
  useEffect(() => {
    getAllItemPromotionProducts();
  }, []);
  const renderItem = useCallback(
    ({item}) => {
      if (item.international_active === 'No' && country?.country_id !== 'IN') {
        return null;
      }
      return (
        <TouchableOpacity
          key={item?.sku?.toString()}
          activeOpacity={0.5}
          style={SearchPageStyle.mainContainer}
          onPress={() => {
            AnalyticsEvents('PRODUCT_SEARCHED', 'Product searched', searchData);
            handlePress(navigation, item);
          }}>
          <View
            style={SearchPageStyle.viewContainer}
            key={'view' + item?.sku?.toString()}>
            <View style={SearchPageStyle.cardBody}>
              <Image
                style={{
                  width: '100%',
                  height: hp('15%'),
                  marginVertical: hp('1%'),
                }}
                source={{uri: 'https:' + item.thumbnail_url}}
                resizeMode="contain"
              />
              <View key={item.object_id.toString()}>
                <Text
                  style={{
                    fontWeight: '500',
                    lineHeight: 20,
                    color: '#25303C',
                    height: Platform.OS === 'ios' ? 42 : 48,
                  }}
                  numberOfLines={2}
                  allowFontScaling={false}>
                  <CustomHighlight
                    searched={searchData['Search Keyword']}
                    text={item?.name}
                  />
                </Text>
                <Text
                  style={{color: '#7C8697', lineHeight: 20}}
                  numberOfLines={1}
                  allowFontScaling={false}>
                  {item?.short_description ? item?.short_description : null}
                </Text>
                <View
                  style={SearchPageStyle.pricePercentageContainer}
                  key={'view4' + item?.sku?.toString()}>
                  <View style={SearchPageStyle.priceContainer}>
                    <Text style={SearchPageStyle.mainPriceText}>
                      {item.prices.minimalPrice.amount.currency === 'INR'
                        ? '\u20B9'
                        : item.prices.minimalPrice.amount.currency}
                      {item.prices.minimalPrice.amount.value}
                    </Text>
                    {item.prices.regularPrice.amount.value >
                    item.prices.minimalPrice.amount.value ? (
                      <Text
                        allowFontScaling={false}
                        style={SearchPageStyle.cutPrice}>
                        {item.prices.regularPrice.amount.currency === 'INR'
                          ? '\u20B9'
                          : item.prices.regularPrice.amount.currency}
                        {item.prices.regularPrice.amount.value}
                      </Text>
                    ) : null}
                  </View>
                  <View key={'view5' + item?.sku?.toString()}>
                    {item.prices.regularPrice.amount.value >
                    item.prices.minimalPrice.amount.value ? (
                      <Text
                        allowFontScaling={false}
                        style={SearchPageStyle.precentageText}>
                        {(
                          100 -
                          (item.prices.minimalPrice.amount.value * 100) /
                            item.prices.regularPrice.amount.value
                        ).toFixed(2)}
                        %
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View
                  style={SearchPageStyle.ratingContainer}
                  key={'view2' + item?.sku?.toString()}>
                  <>
                    <MCIcon
                      name="star"
                      style={SearchPageStyle.star}
                      size={18}
                      color={
                        parseInt(item?.rating) >= 1 ? '#FFC107' : '#C4C4C4'
                      }
                    />
                    <MCIcon
                      name="star"
                      style={SearchPageStyle.star}
                      size={18}
                      color={
                        parseInt(item?.rating) >= 2 ? '#FFC107' : '#C4C4C4'
                      }
                    />
                    <MCIcon
                      name="star"
                      style={SearchPageStyle.star}
                      size={18}
                      color={
                        parseInt(item?.rating) >= 3 ? '#FFC107' : '#C4C4C4'
                      }
                    />
                    <MCIcon
                      name="star"
                      style={SearchPageStyle.star}
                      size={18}
                      color={
                        parseInt(item?.rating) >= 4 ? '#FFC107' : '#C4C4C4'
                      }
                    />
                    <MCIcon
                      name="star"
                      style={SearchPageStyle.star}
                      size={18}
                      color={
                        parseInt(item?.rating) >= 5 ? '#FFC107' : '#C4C4C4'
                      }
                    />
                    {item?.rating_count ? (
                      <Text style={SearchPageStyle.ratingText}>
                        {' '}
                        {'(' + item?.rating_count + ')'}
                      </Text>
                    ) : null}
                  </>
                </View>
                {/* <Text
                style={{
                  color: '#388E3C',
                  fontSize: 12,
                  fontWeight: '500',
                  textAlign: 'center',
                  marginVertical: 3,
                }}>
                Enjoy Free Product
              </Text> */}

                {/* {(freeProduct &&
                  freeProduct?.some(e => e?.product_sku === item?.sku)) ||
                (freeProduct &&
                  freeProduct?.some(e => e?.parent_sku === item?.sku)) ? (
                     */}

                {(freeProduct &&
                  freeProduct?.some(e => e?.product_sku === item?.sku)) ||
                (freeProduct &&
                  freeProduct?.some(e => e?.parent_id == item?.object_id)) ? (
                  <Text
                    style={{
                      color: '#388E3C',
                      fontSize: 12,
                      fontWeight: '500',
                      textAlign: 'center',
                      marginVertical: 3,
                    }}>
                    Enjoy Free Gift
                  </Text>
                ) : null}
              </View>
            </View>
            <View
              style={SearchPageStyle.buttonContainer}
              key={'view3' + item?.sku?.toString()}>
              {item?.type_id === 'simple' &&
              !addToCartButtonVisibility(item) ? (
                <>
                  <AddToCartButton product={item} />
                  <TouchableOpacity
                    onPress={() => {
                      addToWishlist(item);
                      Keyboard.dismiss();
                    }}
                    style={SearchPageStyle.wishlistButton}
                    activeOpacity={0.5}>
                    <MCIcon
                      name="heart-outline"
                      style={SearchPageStyle.star}
                      size={18}
                      color={'#7C8697'}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => handlePress(navigation, item)}
                  style={[SearchPageStyle.addToCartButton, {width: wp('42%')}]}
                  activeOpacity={0.5}>
                  <Text style={SearchPageStyle.addToCartText}>
                    View product
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [freeProduct],
  );

  const footer = useCallback(() => {
    return loading ? (
      <View
        style={{
          height: hp('5%'),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={SecondaryColor} />
      </View>
    ) : null;
  }, [loading]);
  const fetchMoreData = () => {
    if (!loading && pageNumber < totalPages - 1) {
      setPageNumber(no => no + 1);
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      data={products}
      // extraData={products}
      keyboardShouldPersistTaps={'always'}
      onEndReached={fetchMoreData}
      keyExtractor={(item, index) => item?.sku?.toString() + index.toString()}
      style={SearchPageStyle.searchResultWrapper}
      keyboardDismissMode="interactive"
      numColumns={2}
      ListHeaderComponent={() => <View style={{height: hp('1.5%')}} />}
      ItemSeparatorComponent={() => <View style={{height: hp('1%')}} />}
      ListFooterComponent={footer}
      renderItem={renderItem}
      onScroll={() => Keyboard.dismiss()}
      // extraData={freeProduct}
    />
  );
};
