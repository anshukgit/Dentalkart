import React, {useContext} from 'react';
// First, we need to add the connectInfiniteHits connector to our import
import {connectInfiniteHits} from 'react-instantsearch/connectors';
// We also need to import the FlatList and other React Native component
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Highlight} from './HighlightQuery';
import {SearchPageStyle} from './searchPageStyle';
import {DentalkartContext} from '@dentalkartContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {addToCart} from '@screens/cart';
import {ADD_TO_WISHLIST_QUERY} from '../product/graphql';
import {newclient} from '@apolloClient';
import {addToCartClick} from '../../helpers/sendData';
import {showSuccessMessage} from '../../helpers/show_messages';
import {SecondaryColor} from '@config/environment';
import colors from '../../config/colors';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';
import tokenClass from '@helpers/token';

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
  console.log(JSON.stringify(item, null, '\t'));
  const {push} = navigation;
  const url = getProductUrl(item);
  this.requestAnimationFrame(() => {
    push('UrlResolver', {
      productId: item?.objectID,
      productUrl: url,
      url_key: url,
    });
  });
};

export const Hits = connectInfiniteHits(
  ({hits, hasMore, refine, currency = '', navigation, _this, searchData}) => {
    const context = useContext(DentalkartContext);
    const {country, userInfo} = context;
    /* if there are still results, you can call the refine function to load more */
    const onEndReached = function () {
      if (hasMore) {
        refine();
      }
    };
    const searchResult = function () {
      if (hits) {
        _this.saveHits(hits);
      }
    };

    const addToCartPress = async product => {
      let data = {
        origin_page: 'Search',
        landing_page: 'cart',
        section: '',
        position: '',
        customer_id:
          userInfo && userInfo.getCustomer ? userInfo.getCustomer.email : null,
        created_at: new Date(),
        product_id: product?.objectID,
      };
      addToCartClick(data);
      await addToCart(product, context);
    };

    const addToWishlist = async product => {
      let isLoggedIn = await tokenClass.loginStatus();
      console.log('Sdfksjdfkl', isLoggedIn);
      if (!isLoggedIn) {
        navigation.navigate('Login', {
          screen: 'Search',
        });
      } else {
        try {
          const data = await newclient.mutate({
            mutation: ADD_TO_WISHLIST_QUERY,
            variables: {product_ids: [parseInt(product?.objectID)]},
            fetchPolicy: 'no-cache',
          });
          showSuccessMessage('Added to Wishlist');
        } catch (err) {
          console.log(err);
        }
      }
    };

    searchResult();
    if (hits && hits.length) {
      console.log('hits', hits);
      return (
        <FlatList
          data={hits}
          keyboardShouldPersistTaps={'always'}
          onEndReached={onEndReached}
          keyExtractor={(item, index) => item.objectID}
          style={SearchPageStyle.searchResultWrapper}
          keyboardDismissMode="interactive"
          numColumns={2}
          ListHeaderComponent={() => <View style={{height: hp('1.5%')}} />}
          ItemSeparatorComponent={() => <View style={{height: hp('1%')}} />}
          ListFooterComponent={() => <View style={{height: hp('5%')}} />}
          renderItem={({item}) => {
            const isPriceVisible = !item.msrp;
            let ratingCount = (item?.rating_summary / 100) * 5;
            if (
              item.international_active === 'No' &&
              country?.country_id !== 'IN'
            ) {
              return null;
            }
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                style={SearchPageStyle.mainContainer}
                onPress={() => {
                  AnalyticsEvents(
                    'PRODUCT_SEARCHED',
                    'Product searched',
                    searchData,
                  );
                  handlePress(navigation, item);
                }}>
                <View style={SearchPageStyle.viewContainer}>
                  <Image
                    style={{
                      width: '100%',
                      height: hp('15%'),
                      marginVertical: hp('1%'),
                    }}
                    source={{uri: 'https:' + item.thumbnail_url}}
                    resizeMode="contain"
                  />
                  <View>
                    <Text
                      style={{
                        fontWeight: '500',
                        lineHeight: 20,
                        color: '#25303C',
                      }}
                      numberOfLines={1}
                      allowFontScaling={false}>
                      <Highlight attribute="name" hit={item} />
                    </Text>
                    <Text
                      style={{color: '#7C8697', lineHeight: 20}}
                      numberOfLines={1}
                      allowFontScaling={false}>
                      {item?.short_description ? item?.short_description : null}
                    </Text>
                    <View style={SearchPageStyle.pricePercentageContainer}>
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
                      <View>
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

                    <View style={SearchPageStyle.ratingContainer}>
                      {ratingCount > 0 ? (
                        <>
                          <MCIcon
                            name="star"
                            style={SearchPageStyle.star}
                            size={18}
                            color={
                              parseInt(ratingCount) >= 1 ? '#FFC107' : '#C4C4C4'
                            }
                          />
                          <MCIcon
                            name="star"
                            style={SearchPageStyle.star}
                            size={18}
                            color={
                              parseInt(ratingCount) >= 2 ? '#FFC107' : '#C4C4C4'
                            }
                          />
                          <MCIcon
                            name="star"
                            style={SearchPageStyle.star}
                            size={18}
                            color={
                              parseInt(ratingCount) >= 3 ? '#FFC107' : '#C4C4C4'
                            }
                          />
                          <MCIcon
                            name="star"
                            style={SearchPageStyle.star}
                            size={18}
                            color={
                              parseInt(ratingCount) >= 4 ? '#FFC107' : '#C4C4C4'
                            }
                          />
                          <MCIcon
                            name="star"
                            style={SearchPageStyle.star}
                            size={18}
                            color={
                              parseInt(ratingCount) >= 5 ? '#FFC107' : '#C4C4C4'
                            }
                          />
                          {item?.rating_count ? (
                            <Text style={SearchPageStyle.ratingText}>
                              {' '}
                              {'(' + item?.rating_count + ')'}
                            </Text>
                          ) : null}
                        </>
                      ) : null}
                    </View>
                    <View style={SearchPageStyle.buttonContainer}>
                      {item?.type_id === 'simple' &&
                      item?.demo_available === 'No' &&
                      (item?.msrp ? item?.msrp === null : true) ? (
                        <>
                          <TouchableOpacity
                            onPress={() =>
                              'in_stock' in item && item?.in_stock !== 1
                                ? null
                                : addToCartPress(item)
                            }
                            style={[
                              SearchPageStyle.addToCartButton,
                              'in_stock' in item &&
                                item?.in_stock !== 1 && {
                                  backgroundColor: colors.LightGray,
                                  borderColor: colors.LightGray,
                                },
                            ]}
                            activeOpacity={
                              'in_stock' in item && item?.in_stock !== 1
                                ? 1
                                : 0.5
                            }>
                            <Text
                              style={[
                                SearchPageStyle.addToCartText,
                                'in_stock' in item &&
                                  item?.in_stock !== 1 && {color: '#FFF'},
                              ]}>
                              Add to cart
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => addToWishlist(item)}
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
                          style={[
                            SearchPageStyle.addToCartButton,
                            {width: wp('42%')},
                          ]}
                          activeOpacity={0.5}>
                          <Text style={SearchPageStyle.addToCartText}>
                            View product
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            height: hp('65%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={SecondaryColor} />
        </View>
      );
    }
  },
);
