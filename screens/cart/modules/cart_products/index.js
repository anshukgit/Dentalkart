import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {Mutation} from 'react-apollo';
import {cartClient} from '@apolloClient';
import {UPDATE_CART_ITEM, REMOVE_CART_ITEM} from '../../graphql';
import {ADD_TO_WISHLIST_QUERY} from '../../../product/graphql';
import styles from './cart_products.style';
import getImageUrl from '@helpers/getImageUrl';
import QuantitySelector from '@components/quantity_selector';
import TouchableCustom from '@helpers/touchable_custom';
import Loader from '@components/loader';
import {DentalkartContext} from '@dentalkartContext';
import SyncStorage from '@helpers/async_storage';
import tokenClass from '@helpers/token';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import {Icon} from 'native-base';
import Modal from 'react-native-modal';
import {newclient} from '@apolloClient';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';
import SimilarProducts from '../similarProducts';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CartProducts extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      showQuantity: true,
      guest_cart_id: 0,
      customer_cart_id: 0,
      loginStatus: false,
      isheart: false,
      isStockOutmodal: false,
    };
  }

  getStorageValue = async key => {
    return await SyncStorage.get(key);
  };
  componentDidUpdate() {
    if (this.state.item.qty !== this.props.item.qty) {
      this.setState({
        showQuantity: false,
        item: this.props.item,
      });
      setTimeout(() => this.setState({showQuantity: true}), 100);
    }
  }
  async componentWillMount() {
    let guest_cart_id = await SyncStorage.get('guest_cart_id');
    let customer_cart_id = await SyncStorage.get('customer_cart_id');
    let loginStatus = await tokenClass.loginStatus();
    this.setState({guest_cart_id, customer_cart_id, loginStatus});
  }

  async addToWishlist(id) {
    const {navigation} = this.props;
    let isLoggedIn = await tokenClass.loginStatus();
    let productUrl = this.getProductUrl();
    if (!isLoggedIn) {
      console.warn('false');
      navigation.navigate('Login', {
        screen: 'Cart',
        params: {productUrl: productUrl},
      });
    } else {
      try {
        const data = await newclient.mutate({
          mutation: ADD_TO_WISHLIST_QUERY,
          variables: {product_ids: [id]},
          fetchPolicy: 'no-cache',
        });
        return showSuccessMessage('Added to Wishlist');
      } catch (err) {}
    }
  }

  openModal(id, removeFromCart) {
    Alert.alert(
      'Delete Cart Item',
      'Are you sure to delete this cart item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removeFromCart({variables: {id: id}}),
        },
      ],
      {cancelable: false},
    );
  }

  getProductUrl(product) {
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
  }

  handlePress(navigation, item) {
    const {push} = navigation;
    const url = this.getProductUrl(item?.product);
    push('UrlResolver', {
      productId: item?.id,
      productUrl: url,
      url_key: url,
    });
  }

  render() {
    const {
      item,
      currency,
      _this,
      postUpdateCart,
      getCart,
      navigation,
      shippingAddress,
    } = this.props;
    const guest_cart_id = this.state.guest_cart_id;
    const customer_cart_id = this.state.customer_cart_id;
    const cart_id = this.state.loginStatus ? customer_cart_id : guest_cart_id;
    const {
      prices: {
        row_total_including_tax: {value},
      },
    } = item;
    console.log('item   vvvvfvfvff===============', item);
    const tier_prices = item.product;
    const diss = tier_prices.tier_prices;
    return (
      <View
        allowFontScaling={false}
        style={[styles.cartItemMainView, {flexDirection: 'row'}]}>
        {item?.is_free_product && (
          <View style={styles.freeContinuer}>
            <Text style={styles.freeText}>Free</Text>
          </View>
        )}

        <View style={[styles.cartItemSubView, {width: '96%'}]}>
          <View style={styles.cartItemImg}>
            {item.product.stock_status == 'OUT_OF_STOCK' ? (
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => {
                  this.handlePress(navigation, item);
                }}>
                <View style={styles.outOfStockImgView}>
                  {item?.product?.thumbnail?.url ? (
                    <Image
                      resizeMethod={'resize'}
                      resizeMode={'contain'}
                      source={{uri: getImageUrl(item.product.thumbnail.url)}}
                      style={styles.cartProductImage}
                    />
                  ) : (
                    <Image
                      // resizeMethod={'resize'}
                      resizeMode={'cover'}
                      source={{
                        uri: 'https://images.dentalkart.com/placeholder_oLMT6qIw9.png',
                      }}
                      style={styles.cartProductImage}
                    />
                  )}
                  <View style={styles.outOfStockTextView}>
                    <Text allowFontScaling={false} style={styles.outOfStockTxt}>
                      This products
                    </Text>
                    <Text allowFontScaling={false} style={styles.outOfStockTxt}>
                      is out of stock
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.handlePress(navigation, item);
                }}
                style={styles.cartProductImage}>
                <Image
                  resizeMethod={'resize'}
                  resizeMode={'contain'}
                  source={{uri: getImageUrl(item.product.thumbnail.url)}}
                  style={styles.cartProductImage}
                />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={[
              styles.poductDessView,
              !item.is_free_product && {width: '90%'},
            ]}>
            <TouchableOpacity
              onPress={() => {
                this.handlePress(navigation, item);
              }}>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.poductname}>
                {item.product.name}
              </Text>
            </TouchableOpacity>
            {this.context?.country?.country_id === 'IN' &&
            item.reward_point_product &&
            !item.is_free_product &&
            item.reward_point_product !== 0 ? (
              <View style={styles.rewardWrapper}>
                <Image
                  source={{
                    uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/coin.png',
                  }}
                  style={styles.rewardIcon}
                  resizeMode={'contain'}
                />
                <Text allowFontScaling={false} style={styles.rewardPoints}>
                  {item.reward_point_product}
                </Text>
              </View>
            ) : null}
            <View
              style={[
                styles.priceView,
                item.quantity != 1 ? styles.priceWrapperMargin : false,
                item.is_free_product && {justifyContent: 'space-between'},
              ]}>
              <Text allowFontScaling={false} style={[styles.priceText]}>
                <Text
                  style={[
                    {
                      textDecorationLine: item?.is_free_product
                        ? 'line-through'
                        : 'none',
                    },
                    item.is_free_product
                      ? {color: '#666666', fontSize: 14}
                      : {},
                  ]}>
                  {`${currency} ${value}`}
                </Text>
                {item?.is_free_product ? (
                  <Text
                    style={[
                      {textDecorationLine: 'none'},
                      item.is_free_product
                        ? {color: '#407D51', fontSize: 14}
                        : {},
                    ]}>
                    {`   ${currency} 0.00`}
                  </Text>
                ) : null}
              </Text>
              {item.quantity > 1 && !item?.is_free_product ? (
                <Text allowFontScaling={false} style={[styles.priceText, {}]}>
                  {` (${currency} ${(value / item.quantity).toFixed(2)} each)`}
                </Text>
              ) : null}
              {item?.is_free_product && (
                <Text allowFontScaling={false} style={styles.freeProductQty}>
                  Quantity : {item.quantity}
                </Text>
              )}
            </View>

            {/* {item.product?.average_rating && item?.is_free_product && (
              <View style={styles.reviewsWrapper}>
                <View style={styles.ratingBoxWrapper}>
                  <MCIcon name="star" style={styles.star} />
                  <Text allowFontScaling={false} style={styles.ratingBox}>
                    {parseFloat(item.product?.average_rating).toFixed(1)}
                  </Text>
                </View>
              </View>
            )} */}

            {item.product.dentalkart_custom_fee != null &&
            item.product.dentalkart_custom_fee > 0 ? (
              <View>
                <Text allowFontScaling={false} style={styles.deliveryFee}>
                  + {currency + item.product.dentalkart_custom_fee} Delivery
                  Charges
                </Text>
              </View>
            ) : null}

            {item.product.stock_status == 'OUT_OF_STOCK' ? null : (
              <View style={[styles.cartItemOfferView, {top: 2}]}>
                {!item.is_free_product ? (
                  <Text
                    allowFontScaling={false}
                    style={
                      styles.offerView
                    }>{`(${item?.discount} %  off on MRP)`}</Text>
                ) : null}
              </View>
            )}
            {item?.is_free_product ? null : (
              // <Text allowFontScaling={false} style={styles.freeProductQty}>
              //   Quantity : {item.quantity}
              // </Text>
              <View style={styles.qtyBtnView}>
                <View style={styles.stockOutBtnView}>
                  {item.product.stock_status == 'OUT_OF_STOCK' ? null : (
                    <Mutation
                      client={cartClient}
                      mutation={UPDATE_CART_ITEM}
                      variables={{
                        cart_item_id: item.id,
                        quantity: item.quantity,
                        cart_id: cart_id,
                      }}
                      onCompleted={async () => {
                        showSuccessMessage('Cart updated successfully.');
                      }}
                      update={postUpdateCart}
                      onError={error => {
                        showErrorMessage(`${error.message}. Please try again.`);
                      }}>
                      {(updateCart, {loading, error}) => {
                        if (loading || !this.state.showQuantity) {
                          return <Loader loading={true} transparent={true} />;
                        }
                        return (
                          <View style={styles.quantityWrapper}>
                            <QuantitySelector
                              max_quantity={item.product.max_sale_qty}
                              qty={item.quantity}
                              id={item.id}
                              sku={item.sku}
                              cart_this={_this}
                              title="cart"
                              updateQuantity={(qty, id) => {
                                AnalyticsEvents(
                                  'CART_ITEM_QUANTITY_UPDATED',
                                  'cart_prod_qty_updated',
                                  {...item, updated_quantity: qty},
                                );
                                updateCart({
                                  variables: {
                                    cart_item_id: parseInt(item.id),
                                    quantity: parseFloat(qty),
                                    cart_id: cart_id,
                                  },
                                });
                              }}
                            />
                          </View>
                        );
                      }}
                    </Mutation>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.shadow, styles.heartBtnView, {}]}
                  onPress={() =>
                    this.addToWishlist(item.product.id, item.sku, navigation)
                  }>
                  <Icon
                    name={'heart'}
                    type={'AntDesign'}
                    style={styles.heartIcon}
                  />
                </TouchableOpacity>
                <View style={[styles.shadow, styles.heartBtnView]}>
                  <Mutation
                    mutation={REMOVE_CART_ITEM}
                    client={cartClient}
                    variables={{
                      cart_item_id: parseInt(item.id),
                      cart_id: cart_id,
                    }}
                    update={postUpdateCart}
                    onCompleted={async () => {
                      showSuccessMessage(
                        'Removed items from cart successfully.',
                      );
                      // await getCart();
                    }}
                    onError={error => {
                      console.log('error msg in remove vart', error);
                      showErrorMessage(`${error.message}. Please try again.`);
                    }}>
                    {(removeFromCart, {loading, error, data}) => {
                      return (
                        <View>
                          <TouchableCustom
                            underlayColor={'#ffffff10'}
                            onPress={() => {
                              AnalyticsEvents(
                                'REMOVED_FROM_CART',
                                'removeFromCart',
                                item,
                              );
                              this.openModal(item.id, removeFromCart);
                            }}>
                            <View style={[styles.productRemoveAction, {}]}>
                              <Icon
                                name={'delete'}
                                type={'AntDesign'}
                                style={styles.deleteImg}
                              />
                            </View>
                          </TouchableCustom>
                          {loading && (
                            <Loader loading={true} transparent={true} />
                          )}
                        </View>
                      );
                    }}
                  </Mutation>
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={styles.cartItemErrorView}>
          {item?.error_messages?.map(e => {
            return !shippingAddress?.country_code ||
              (shippingAddress?.country_code === 'IN' &&
                e?.code === 'internationally_inactive') ? null : (
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Icon
                  name="close-circle"
                  type="MaterialCommunityIcons"
                  style={styles.closeIcon}
                />
                <Text allowFontScaling={false} style={styles.ItemErrorText}>
                  {e?.message}
                </Text>
              </View>
            );
          })}
        </View>

        <Modal
          isVisible={this.state.isStockOutmodal}
          animationInTiming={1000}
          animationOutTiming={1000}
          transparent={true}
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{margin: 0, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modalMainView}>
            <View style={styles.stockOutModalEmptyView} />
            <View style={styles.modalSubView}>
              <ScrollView>
                <View style={styles.StockOutmodalSubView}>
                  <Text allowFontScaling={false} style={styles.StockOutText}>
                    This product is stock out
                  </Text>

                  <Text allowFontScaling={false} style={styles.eitherTxt}>
                    Either remove the unavailable item or replace with
                    recommended similar item
                  </Text>
                </View>

                <View style={styles.StockOutProView}>
                  <View style={styles.StockOutProimgView}></View>
                  <View style={styles.StockOutDisView}>
                    <Text
                      allowFontScaling={false}
                      style={styles.StockOutDisText}>
                      ChlorHex Mouthwash
                    </Text>
                    <Text allowFontScaling={false} style={styles.dispersible}>
                      Ketormore tromethamine dispersible tablets
                    </Text>
                    <View style={styles.priceMainView}>
                      <View style={styles.priceView}>
                        <Icon
                          name="rupee"
                          type="FontAwesome"
                          style={styles.priceIcon}
                        />
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.pricetext,
                            {color: colors.blueColor, fontSize: 20},
                          ]}>
                          {1300}
                        </Text>
                      </View>

                      <Pressable style={styles.unavilableView}>
                        <Text
                          allowFontScaling={false}
                          style={styles.unavilableText}>
                          Unavailable
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <View style={styles.StockOutFooterBtnView}>
                  <Pressable style={styles.norecomendationsView}>
                    <Text
                      allowFontScaling={false}
                      style={styles.norecomendationTxt}>
                      No recommendations available
                    </Text>
                  </Pressable>
                  <Pressable style={styles.notifyView}>
                    <Text allowFontScaling={false} style={styles.notifyText}>
                      Notify Me
                    </Text>
                  </Pressable>
                </View>

                <View style={[styles.similarProductMainView, {height: 190}]}>
                  <Text allowFontScaling={false} style={styles.youalsoLikeText}>
                    You also may like
                  </Text>
                  <View
                    style={[
                      styles.similarProductSubView,
                      {backgroundColor: colors.HexColor},
                    ]}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <SimilarProducts />
                    </ScrollView>
                  </View>
                </View>

                <Pressable
                  style={styles.footerBtnView}
                  onPress={() => this.removeBtnPress()}>
                  <Text allowFontScaling={false} style={styles.removeBtnTxt}>
                    Remove 1 product and proceed
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
