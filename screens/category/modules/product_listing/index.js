import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  InteractionManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './product_listing.style';
import getImageUrl from '@helpers/getImageUrl';
import {addToCart} from '@screens/cart';
import {client, client2, newclient} from '@apolloClient';
import {ADD_TO_WISHLIST_QUERY} from '@screens/product/graphql';
import {DentalkartContext} from '@dentalkartContext';
import tokenClass from '@helpers/token';
import getDiscount from '@helpers/getDiscount';
import Loader from '@components/loader';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';

export default class ProductListing extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  async addToWishList(product) {
    this.setState({loading: true});
    InteractionManager.runAfterInteractions(async () => {
      let isLoggedIn = await tokenClass.loginStatus();
      const {categoryId, _this} = this.props;
      if (!isLoggedIn) {
        _this.props.navigation.navigate('Login', {
          screen: 'Category',
          params: {categoryId: categoryId},
        });
      } else {
        try {
          const data = await newclient.mutate({
            mutation: ADD_TO_WISHLIST_QUERY,
            variables: {product_ids: [product.id]},
          });
          this.setState({loading: false});
          AnalyticsEvents('ADDED_TO_WHISHLIST', 'Addtowishlist', product);
          return showSuccessMessage('Added to Wishlist');
        } catch (err) {
          console.log(err);
        }
      }
    });
  }
  async addToCart(product) {
    if (product.type_id === 'simple') {
      this.setState({loading: true});
      const result = await addToCart(product, this.context);
      this.setState({loading: false});
      this.context.getUserInfo();
      return result;
    } else {
      this.navigateToDetail(product);
    }
  }
  navigateToDetail(item) {
    const {_this} = this.props;
    _this.props.navigation.push('ProductDetails', {
      productId: item?.id,
      productUrl: item.url_key,
    });
  }
  render() {
    const {_this, item} = this.props;
    const regular_price = item?.price?.regularPrice?.amount?.value;
    const minimal_price = item?.price?.minimalPrice?.amount?.value;
    const isPriceVisible = !item.msrp;
    const discount = getDiscount(item);
    const {loading} = this.state;
    // const getImageObj = item.media_gallery_entries
    //   .filter(data => data.types.length > 0)
    //   .find(data => data.file);
    const imageUrl = item?.image_url;
    if (!item) {
      return null;
    }
    return (
      <View>
        <TouchableOpacity
          style={styles.categoryProductWrapper}
          onPress={() => {
            let data = {
              origin_page: 'category',
              landing_page: 'product',
              position: '',
              product_id: item?.id,
            };
            this.props.onProductClick(data);
            _this.props.navigation.push('ProductDetails', {
              productId: item?.id,
              productUrl: item.url_key,
            });
          }}>
          <View style={styles.categoryProduct}>
            <View style={styles.productImageWrapper}>
              <Image
                resizeMethod={'resize'}
                source={{uri: getImageUrl(imageUrl)}}
                style={styles.categoryProductImage}
              />
              {!item.is_in_stock ? (
                <Text allowFontScaling={false} style={styles.soldOut}>
                  Sold Out
                </Text>
              ) : (
                false
              )}
            </View>
            <View style={styles.productDetailsWrapper}>
              <Text
                allowFontScaling={false}
                style={styles.productItemName}
                numberOfLines={2}>
                {item.name}
              </Text>
              <Text
                allowFontScaling={false}
                style={styles.description}
                numberOfLines={1}>
                {item.short_description}
              </Text>
              {item.average_rating && item.rating_count > 0 ? (
                <View style={styles.reviewsWrapper}>
                  <View style={styles.ratingBoxWrapper}>
                    <Text allowFontScaling={false} style={styles.ratingBox}>
                      {parseFloat(item.average_rating).toFixed(1)}
                    </Text>
                    <MCIcon name="star" style={styles.star} />
                  </View>
                  <Text allowFontScaling={false} style={styles.reviewsQty}>
                    ({item.rating_count})
                  </Text>
                </View>
              ) : (
                false
              )}
              {isPriceVisible && (
                <View style={styles.productItemPriceWrapper}>
                  {item.type_id === 'grouped' ? (
                    <Text
                      allowFontScaling={false}
                      style={styles.productItemNewPrice}>
                      Starting at:{' '}
                      {item?.price?.minimalPrice?.amount?.currency_symbol}{' '}
                      {minimal_price}
                    </Text>
                  ) : (
                    <Text
                      allowFontScaling={false}
                      style={styles.productItemNewPrice}>
                      {item?.price?.minimalPrice?.amount?.currency_symbol}{' '}
                      {minimal_price}
                    </Text>
                  )}
                  {minimal_price !== regular_price && regular_price > 0 && (
                    <View style={styles.priceDiscountWrapper}>
                      <Text
                        allowFontScaling={false}
                        style={styles.productItemOldPrice}>
                        {item?.price?.regularPrice?.amount?.currency_symbol}{' '}
                        {regular_price}
                      </Text>
                      {discount > 0 && (
                        <Text allowFontScaling={false} style={styles.product}>
                          {discount}% Off
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              )}
              {this.context.country &&
              this.context?.country?.country_id === 'IN' &&
              item.reward_point_product ? (
                <View style={styles.rewardWrapper}>
                  <Image
                    source={{
                      uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/coin.png',
                    }}
                    style={styles.rewardIcon}
                  />
                  <Text allowFontScaling={false} style={styles.rewardPoints}>
                    {item.reward_point_product}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
        {item.is_in_stock ? (
          <TouchableOpacity
            style={styles.categoryProductCart}
            hitSlop={{top: 20, right: 20, bottom: 5, left: 20}}
            onPress={() => this.addToCart(item)}>
            <Icon name="cart" style={styles.categoryProductIcon} />
          </TouchableOpacity>
        ) : (
          false
        )}
        <TouchableOpacity
          style={styles.categoryProductWishlist}
          hitSlop={{top: 5, right: 20, bottom: 20, left: 20}}
          onPress={() => this.addToWishList(item)}>
          <Icon name="heart" style={styles.categoryProductIcon} />
        </TouchableOpacity>
        <Loader loading={loading} transparent={true} />
      </View>
    );
  }
}
