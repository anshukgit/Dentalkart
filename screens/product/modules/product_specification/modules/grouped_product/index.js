import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import QuantitySelector from '@components/quantity_selector';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MUIcon from 'react-native-vector-icons/MaterialIcons';
import {GET_GROUP_PRODUCT_QUERY} from '../../../../graphql';
import {Query} from 'react-apollo';
import styles from './grouped_product.style';
import {showInfoMessage} from '@helpers/show_messages';
import {ExpiryInfoComponent} from '../product_expiry_dispatch_info';
import SubscribeForStockAlert from '../../../stock_alert';
import {client, client2, newclient} from '@apolloClient';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {FlatList} from '@react-navigation/native';
import copy from '../../../../../../assets/copy.png';
// import {Icon} from 'native-base';
import {DentalkartContext} from '@dentalkartContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {postRequest} from '@helpers/network';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';
import {Label} from 'native-base';
import tokenClass from '@helpers/token';

export default class GroupedProduct extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.onUpdateQuantity = this.onUpdateQuantity.bind(this);
    this.state = {
      _this: props._this,
      product: props.product,
      infoModal: false,
      childId: '',
      messages: [],
      tierPriceIndex: 0,
      uniqueValuesArray: '',
      totalAmountTierPrice: '',
      transformedTierPrices: '',
      totalTierAmount: 0,
      totalOriginalAmount: 0,
      totalItemCount: 0,
      shareReferModal: false,
      referralRecord: '',
    };
  }

  arrayWithSoldOutAtBottom = arr => {
    let inStockArray = [],
      outOfStockArray = [];
    arr.map((data, index) => {
      if (data.is_in_stock) {
        inStockArray.push(data);
      } else {
        outOfStockArray.push(data);
      }
      return null;
    });

    inStockArray.filter((item, index) => arr.indexOf(item) === index);

    const resultingArray = inStockArray.concat(outOfStockArray);

    return resultingArray;
  };

  transformTierPrices(apiResponse) {
    const result = {};
    console.log(
      'apiResponse================================',
      JSON.stringify(apiResponse),
    );
    if (apiResponse && apiResponse.items && Array.isArray(apiResponse.items)) {
      for (const item of apiResponse.items) {
        const priceValue =
          item.price &&
          item.price.minimalPrice &&
          item.price.minimalPrice.amount &&
          item.price.minimalPrice.amount.value;
        const regularPrice =
          item.price &&
          item.price.regularPrice &&
          item.price.regularPrice.amount &&
          item.price.regularPrice.amount.value;
        console.log('upper==priceValue', priceValue);
        if (priceValue !== undefined) {
          console.log('under==priceValue', priceValue);
          const tierPrices =
            item.tier_prices && Array.isArray(item.tier_prices)
              ? item.tier_prices.map(tierPrice => ({
                  text: `Buy ${tierPrice.qty} or above for ₹${tierPrice.value} each`,
                  savings: (100 - (tierPrice.value * 100) / priceValue).toFixed(
                    2,
                  ),
                  active: true,
                  qty: 0,
                  qtyLimit: tierPrice.qty,
                  priceLimit: tierPrice.value,
                  regularPrice: regularPrice || 0,
                  minimalPrice: priceValue || 0,
                }))
              : [];
          console.log(
            'tierPrices==================priceValue==============',
            priceValue,
            tierPrices,
          );
          if (tierPrices.length > 0) {
            result[priceValue] = {rows: tierPrices, items: []};
          } else {
            result[priceValue] = {
              rows: [
                {
                  text: ``,
                  savings: 0,
                  active: false,
                  qty: 0,
                  qtyLimit: 0,
                  priceLimit: 0,
                  regularPrice: regularPrice || 0,
                  minimalPrice: priceValue || 0,
                },
              ],
              items: [],
            };
          }
        }
      }
    }
    console.log('result===of===newPrices==!!', JSON.stringify(result));
    if (Object.values(result).some(o => o.rows.some(i => i.active === true))) {
      this.state.transformedTierPrices = result;
    } else {
      this.state.transformedTierPrices = {};
    }

    return result;
  }

  componentDidMount() {
    const {childProducts} = this.props;
    if (childProducts) {
      this.transformTierPrices(childProducts);
    }
  }

  findFirstActiveIndex(object) {
    // let a = Object.values(this.state.transformedTierPrices)?.rows?.some(
    //   j => j.active === true,
    // );
    let index = Object.keys(object).find(key =>
      object[key]?.rows?.some(i => i.active === true),
    );
    return index;
  }

  onUpdateQuantity(quantity, productPrice, sku) {
    if (Object.keys(this.state.transformedTierPrices)?.length === 0) return;
    var newArray = this.state.transformedTierPrices?.[productPrice]?.rows;
    var items = this.state.transformedTierPrices?.[productPrice]?.items;
    this.state.transformedTierPrices?.[productPrice]?.rows?.map(
      (item, index) => {
        let skuItemIndex = items?.findIndex(i => i.sku === sku);
        if (skuItemIndex !== -1) {
          items[skuItemIndex].qty = quantity;
        } else {
          items.push({sku, qty: quantity});
        }
        const totalQty = items.reduce(
          (prev, current) => Number(current?.qty) + prev,
          0,
        );
        this.state.transformedTierPrices[productPrice].items = items;
        console.log(
          'totalQty, newArray[index]?.qtyLimit, newArray[index + 1]?.qtyLimit',
          totalQty,
          newArray[index]?.qtyLimit,
          newArray[index + 1]?.qtyLimit,
        );
        if (index === 0 && totalQty < newArray[index]?.qtyLimit) {
          newArray[index].qty = totalQty;
        } else if (
          totalQty >= newArray[index]?.qtyLimit &&
          (totalQty < newArray[index + 1]?.qtyLimit ||
            index + 1 === newArray.length)
        ) {
          newArray[index].qty = totalQty;
        } else {
          newArray[index].qty = 0;
        }
      },
    );
    const totalTierAmount = Object.values(
      this.state.transformedTierPrices,
    )?.reduce((prev, current) => {
      const total = current.rows.reduce((last, next) => {
        return (
          (next?.qtyLimit > next?.qty || next.active === false
            ? next.minimalPrice
            : next?.priceLimit) *
            next?.qty +
          last
        );
      }, 0);
      return prev + total;
    }, 0);
    const totalRegularPriceAmount = Object.values(
      this.state.transformedTierPrices,
    )?.reduce((prev, current) => {
      const total = current.rows.reduce(
        (last, next) => next?.regularPrice * next?.qty + last,
        0,
      );
      return prev + total;
    }, 0);
    const totalItemCount = Object.values(
      this.state.transformedTierPrices,
    )?.reduce((prev, current) => {
      const total = current.rows.reduce((last, next) => next?.qty + last, 0);
      return prev + total;
    }, 0);

    console.log('newArray==newArray==!', newArray);
    console.log(
      'this.state.transformedTierPrices',
      JSON.stringify(this.state.transformedTierPrices),
    );

    this.state.transformedTierPrices[productPrice]['rows'] = newArray;
    if (
      this.state.transformedTierPrices[productPrice]['rows']?.some(
        i => i.active === true,
      )
    ) {
      this.setState({tierPriceIndex: String(productPrice)});
    }

    this.setState({totalTierAmount: totalTierAmount});
    this.setState({totalOriginalAmount: totalRegularPriceAmount});
    this.setState({totalItemCount: totalItemCount});
  }

  getReferralRecord = async (sku, url_key) => {
    let isLoggedIn = await tokenClass.loginStatus();
    if (!isLoggedIn) {
      showInfoMessage('Login First.');
      return this.props._this.props.navigation.navigate('Login', {
        screen: 'UrlResolver',
        params: {url_key: this.state.product?.url_key},
      });
    }
    this.setState({shareReferModal: true});
    let res = await postRequest(
      // 'https://referral-staging.dentalkart.com/rewards/referral-record',
      // 'https://referral-prod.dentalkart.com/rewards/referral-record',
      'https://referral-prod.dentalkart.com/rewards/referral-record',
      {
        product_sku: sku,
        refer_type: 'PRODUCT',
        url_key: url_key,
      },
      {
        'x-api-key': 'XUQVEomDnXBI5IaZabnujPkbS1rpPlSseG',
      },
    );
    let result = await res.json();
    // console.log(
    //   'referralRecord==referralRecord==grouped',
    //   JSON.stringify(result),
    // );
    this.setState({referralRecord: result});
  };

  copyToClipboard = data => {
    Clipboard.setString(data);
    ToastAndroid.show('Copied !', ToastAndroid.SHORT);
  };

  referralShare = async (url, socialName) => {
    // console.log('url===url==', url);
    // console.log('socialName===socialName==', socialName);
    try {
      const shareResponse = await Share.shareSingle({
        url: url,
        social: socialName,
      });
      console.log('shareResponse===!shareResponse', shareResponse);
    } catch (error) {
      ToastAndroid.show(
        'This App is not installed in your phone !',
        ToastAndroid.SHORT,
      );
      console.log('catch===referralShare=referralShare', error);
    }
  };

  render() {
    const {product, _this} = this.state;
    const {childProducts, deliveryDays, productPriceQty, productPrice} =
      this.props;
    const {navigation} = _this.props;
    const productProperties = childProducts?.items;
    const getSoldOutAtBottomArray = productProperties?.length
      ? this.arrayWithSoldOutAtBottom(productProperties)
      : null;
    return (
      <View>
        {/* {product.is_in_stock && ( */}
        <>
          {/* <View>
            <View style={styles.diractionView}>
              <Image
                style={styles.imageOffer}
                resizeMode="contain"
                source={require('../../../../../../assets/offerIcon.png')}
              />
              <Text style={styles.availableText}>Available Offers</Text>
            </View>
            <View style={{width: '100%'}}>
              <FlatList
                data={[{}, {}, {}]}
                horizontal
                ItemSeparatorComponent={() => <View style={{width: 5}} />}
                renderItem={({item, index}) => (
                  <View style={styles.boxOffer}>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.discrapton}>
                      Get 3 Bestseller Waldent RCTcal Calcium Hydroxide Paste on
                      order above ₹4000! *Offer valid till stock last. Receive
                      one complimentary Waldent RCTcal with every purchase.
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                // extraData={addressData}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View> */}
          {!childProducts && <ActivityIndicator size="large" color="#343434" />}
          {childProducts && productProperties?.length ? (
            <>
              {Object.keys(this.state.transformedTierPrices)?.length > 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {this.state.totalItemCount > 0 ? (
                      <Text style={styles.itemCountPrice}>
                        ₹{this.state.totalTierAmount}
                      </Text>
                    ) : null}
                    <Text style={styles.itemCount}>
                      Item - {this.state.totalItemCount}
                    </Text>
                  </View>
                  <Text style={{paddingVertical: 6}}>
                    MRP{' '}
                    <Text style={styles.mrp}>
                      ₹{this.state.totalOriginalAmount}
                    </Text>
                    <Text style={styles.productDiscount}>
                      {' '}
                      {isNaN(
                        (
                          100 -
                          (this.state.totalTierAmount * 100) /
                            this.state.totalOriginalAmount
                        ).toFixed(2),
                      )
                        ? '0% OFF'
                        : `${(
                            100 -
                            (this.state.totalTierAmount * 100) /
                              this.state.totalOriginalAmount
                          ).toFixed(2)}% OFF`}
                    </Text>
                  </Text>

                  <FlatList
                    data={Object.keys(this.state.transformedTierPrices)}
                    horizontal
                    ItemSeparatorComponent={() => <View style={{width: 5}} />}
                    renderItem={({item, index}) => {
                      return this.state.transformedTierPrices?.[
                        item
                      ]?.rows?.some(j => j.active === true) ? (
                        <Pressable
                          onPress={() => {
                            this.setState({tierPriceIndex: item});
                          }}>
                          <View
                            style={[
                              styles.tierPrices,
                              this.state.tierPriceIndex === item ||
                              (this.findFirstActiveIndex(
                                this.state.transformedTierPrices,
                              ) === item &&
                                !this.state.tierPriceIndex)
                                ? {backgroundColor: '#25303c'}
                                : '',
                            ]}>
                            <Text
                              style={[
                                styles.tierPricesText,
                                this.state.tierPriceIndex === item ||
                                (this.findFirstActiveIndex(
                                  this.state.transformedTierPrices,
                                ) === item &&
                                  !this.state.tierPriceIndex)
                                  ? {color: 'white'}
                                  : '',
                              ]}>
                              {item}
                            </Text>
                          </View>
                        </Pressable>
                      ) : null;
                    }}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.tierTable}>
                      <Text style={styles.tierTableText}>Offer</Text>
                    </View>
                    <View style={styles.tierTablee}>
                      <Text style={styles.tierTableText}>Add On Savings</Text>
                    </View>
                  </View>
                </>
              ) : null}

              {Object.keys(this.state.transformedTierPrices)?.length > 0 &&
                this.state.transformedTierPrices?.[
                  this.state?.tierPriceIndex ||
                    this.findFirstActiveIndex(this.state.transformedTierPrices)
                ]?.rows?.map((item, index) => {
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <View
                        key={index}
                        style={[
                          styles.tierTableList,
                          item.qty >= item.qtyLimit
                            ? // (item?.qty <
                              //   this.state.transformedTierPrices?.[productPrice]
                              //     ?.rows?.[index + 1]?.qtyLimit ||
                              //   index + 1 ===
                              //     this.state.transformedTierPrices?.[productPrice]
                              //       ?.rows?.length)
                              {backgroundColor: '#fad091'}
                            : {},
                        ]}>
                        <Text style={styles.tierTableListText}>
                          {item.text}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tierTableList2,
                          item?.qty >= item?.qtyLimit
                            ? // (item?.qty <
                              //   this.state.transformedTierPrices?.[productPrice]
                              //     ?.rows?.[index + 1]?.qtyLimit ||
                              //   index + 1 ===
                              //     this.state.transformedTierPrices?.[productPrice]
                              //       ?.rows?.length)
                              {backgroundColor: '#fad091'}
                            : {},
                        ]}>
                        <Text style={styles.tierTableListText}>
                          {item.savings}%
                        </Text>
                      </View>
                    </View>
                  );
                })}
              <View>
                {getSoldOutAtBottomArray.map((item, index) => {
                  const product = item;
                  let minimalPrice = product.price.minimalPrice.amount.value;
                  return (
                    <View style={styles.groupedWrapper} key={index}>
                      {product.is_in_stock &&
                      this.props?.promotionProduct?.group_messages?.length >
                        0 &&
                      this.props?.promotionProduct?.group_messages?.some(
                        e => e?.sku === product?.sku,
                      ) ? (
                        <Image
                          style={{width: 100, height: 25}}
                          resizeMode="contain"
                          source={require('../../../../../../assets/freebie.png')}
                        />
                      ) : null}

                      <View style={styles.groupedProductNameWrapper}>
                        <Text
                          allowFontScaling={false}
                          style={styles.groupedProductName}
                          numberOfLines={2}>
                          {product.name}
                        </Text>
                      </View>

                      <View
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <View style={styles.productGroupedPriceInfoWrapper}>
                          {product.price.minimalPrice.amount.value ? (
                            <View style={styles.productNewpriceWrapper}>
                              <Text
                                allowFontScaling={false}
                                style={styles.currency}>
                                {
                                  product.price.minimalPrice.amount
                                    .currency_symbol
                                }
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={styles.productNewprice}>
                                {product.price.minimalPrice.amount.value}
                              </Text>
                            </View>
                          ) : null}
                          {product.price.regularPrice.amount.value >
                          product.price.minimalPrice.amount.value ? (
                            <Text
                              allowFontScaling={false}
                              style={styles.productOldprice}>
                              {product.price.regularPrice.amount.value}
                            </Text>
                          ) : null}
                          {product.price.regularPrice.amount.value >
                          product.price.minimalPrice.amount.value ? (
                            <Text
                              allowFontScaling={false}
                              style={styles.productDiscount}>
                              {(
                                100 -
                                (product.price.minimalPrice.amount.value *
                                  100) /
                                  product.price.regularPrice.amount.value
                              ).toFixed(2)}
                              %
                            </Text>
                          ) : null}
                          {product.dentalkart_custom_fee != null &&
                          product.dentalkart_custom_fee > 0 ? (
                            <View>
                              <Text
                                allowFontScaling={false}
                                style={styles.deliveryFee}>
                                {' '}
                                +{' '}
                                {product.price.regularPrice.amount
                                  .currency_symbol +
                                  product.dentalkart_custom_fee}{' '}
                                Delivery Fee
                              </Text>
                            </View>
                          ) : null}
                          {product.average_rating &&
                          product.rating_count > 0 ? (
                            <View style={styles.reviewsWrapper}>
                              <View style={styles.ratingBoxWrapper}>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.ratingBox}>
                                  {parseFloat(product.average_rating).toFixed(
                                    1,
                                  )}
                                </Text>
                                <MCIcon
                                  name="star"
                                  style={styles.ratingBoxIcon}
                                />
                              </View>
                              <Text
                                allowFontScaling={false}
                                style={styles.reviewsQty}>
                                ({product.rating_count})
                              </Text>
                            </View>
                          ) : (
                            false
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.sharePressIcon}
                          onPress={() => {
                            this.getReferralRecord(
                              product?.sku,
                              product?.url_key,
                            );
                          }}>
                          <Image
                            source={require('../../../../../../assets/referAndEarn.png')}
                            style={styles.shareIconOnProduct}
                          />
                        </TouchableOpacity>
                      </View>
                      {this.context?.country?.country_id === 'IN' &&
                      product.reward_point_product ? (
                        <View style={styles.rewardWrapper}>
                          <Image
                            source={{
                              uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/coin.png',
                            }}
                            style={styles.rewardIcon}
                          />
                          <Text
                            allowFontScaling={false}
                            style={styles.rewardPoints}>
                            {product.reward_point_product}
                          </Text>
                        </View>
                      ) : null}
                      {!product.is_in_stock ? (
                        <View
                          style={[
                            styles.availablityWrapper,
                            !product.is_in_stock && {top: 10},
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={styles.soldOutText}>
                            Sold out
                          </Text>
                        </View>
                      ) : null}
                      {!product.is_in_stock ? null : (
                        <>
                          {product.tier_prices ? (
                            <View style={styles.tierPriceWrapper}>
                              {product.tier_prices.map(
                                (tierItem, index) =>
                                  tierItem.value < minimalPrice && (
                                    <Text
                                      allowFontScaling={false}
                                      style={styles.tierPrice}
                                      key={index}>
                                      Buy {tierItem.qty} or above for{' '}
                                      {
                                        product.price.regularPrice.amount
                                          .currency_symbol
                                      }
                                      {tierItem.value} each and save{' '}
                                      {(
                                        100 -
                                        (tierItem.value * 100) /
                                          product.price.minimalPrice.amount
                                            .value
                                      ).toFixed(2)}
                                      %
                                    </Text>
                                  ),
                              )}
                            </View>
                          ) : null}
                          {console.log(
                            'this.props?.promotionProduct====this.props?.promotionProduct',
                            this.props?.promotionProduct,
                          )}
                          {this.props?.promotionProduct?.group_messages
                            ?.length > 0 ? (
                            <Text style={[styles.tierPrice, {color: 'blue'}]}>
                              {
                                this.props?.promotionProduct?.group_messages?.find(
                                  e => e?.sku === product?.sku,
                                )?.message
                              }
                            </Text>
                          ) : null}
                        </>
                      )}

                      {!product.is_in_stock ? (
                        <SubscribeForStockAlert
                          productId={product.id}
                          navigation={navigation}
                        />
                      ) : null}
                      {product.is_in_stock ? (
                        <View style={styles.groupedQuantityWrapper}>
                          <QuantitySelector
                            qty={0}
                            max_quantity={this.state.product?.max_sale_qty}
                            type="grouped"
                            id={product.id}
                            sku={product.sku}
                            product_this={_this}
                            title="product"
                            productPrice={
                              product?.special_price ||
                              product?.price?.minimalPrice?.amount?.value
                            }
                            onUpdateQuantity={this.onUpdateQuantity}
                          />
                          {deliveryDays ? (
                            <>
                              <View>
                                {!!deliveryDays?.delivery_days?.find(
                                  deliveryDaysItem =>
                                    deliveryDaysItem?.product_id ===
                                    product?.id,
                                )?.delivery_days ? (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      paddingTop: 4,
                                      alignItems: 'center',
                                    }}>
                                    {/* <MUIcon
                                        size={20}
                                        name="local-shipping"
                                        style={{paddingRight: 8}}
                                        color="#6f6f6f"
                                      /> */}
                                    <Image
                                      style={{
                                        height: 20,
                                        width: 20,
                                        marginRight: 8,
                                        tintColor: '#1c60dc',
                                      }}
                                      source={require('../../../../../../assets/delivery.png')}
                                    />

                                    <Text
                                      style={{
                                        color: '#1c60dc',
                                        fontSize: 12,
                                      }}>
                                      {
                                        deliveryDays?.delivery_days?.find(
                                          deliveryDaysItem =>
                                            deliveryDaysItem?.product_id ===
                                            product?.id,
                                        )?.success_msg
                                      }
                                    </Text>
                                  </View>
                                ) : null}
                                {!!deliveryDays?.checkcod?.find(
                                  deliveryDaysItem =>
                                    deliveryDaysItem?.product_id ===
                                    product?.id,
                                )?.message ? (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      paddingTop: 4,
                                      alignItems: 'center',
                                    }}>
                                    <Image
                                      style={{
                                        height: 20,
                                        width: 20,
                                        marginRight: 8,
                                        tintColor: '#1c60dc',
                                      }}
                                      source={require('../../../../../../assets/payments.png')}
                                    />

                                    <Text
                                      style={{
                                        color: '#1c60dc',
                                        fontSize: 12,
                                      }}>
                                      {
                                        deliveryDays?.checkcod?.find(
                                          deliveryDaysItem =>
                                            deliveryDaysItem?.product_id ===
                                            product?.id,
                                        )?.message
                                      }
                                    </Text>

                                    {deliveryDays?.checkcod?.find(
                                      deliveryDaysItem =>
                                        deliveryDaysItem?.product_id ===
                                        product?.id,
                                    )?.message_arr?.length > 0 ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.setState({
                                            infoModal: true,
                                            messages:
                                              deliveryDays?.checkcod?.find(
                                                deliveryDaysItem =>
                                                  deliveryDaysItem?.product_id ===
                                                  product?.id,
                                              )?.message_arr,
                                          });
                                        }}>
                                        <AntDesignIcon
                                          size={12}
                                          name="infocirlce"
                                          style={{
                                            paddingLeft: 8,
                                            paddingTop: 5,
                                          }}
                                          color="#6f6f6f"
                                        />
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                ) : null}
                              </View>
                            </>
                          ) : null}
                          {/* {deliveryDays?.length &&
                          !deliveryDays.some(
                            item =>
                              item?.product_id === product?.id &&
                              item?.delivery_days === undefined &&
                              item?.message === undefined,
                          ) ? (
                            <>
                              <View>
                                <View
                                  style={{flexDirection: 'row', paddingTop: 4}}>
                                  {deliveryDays.find(
                                    deliveryDaysItem =>
                                      deliveryDaysItem?.product_id ===
                                      product?.id,
                                  )?.message !== undefined && (
                                    <>
                                      <Image
                                        style={{
                                          height: 20,
                                          width: 20,
                                          marginRight: 8,
                                          tintColor: '#6f6f6f',
                                        }}
                                        source={require('../../../../../../assets/payments.png')}
                                      />

                                      <Text style={{color: '#1c60dc'}}>
                                        {
                                          deliveryDays?.checkcod?.find(
                                            deliveryDaysItem =>
                                              deliveryDaysItem?.product_id ===
                                              product?.id,
                                          )?.message
                                        }
                                      </Text>
                                    </>
                                  )}
                                </View>
                                <View
                                  style={{flexDirection: 'row', paddingTop: 4}}>
                                  {deliveryDays.find(
                                    deliveryDaysItem =>
                                      deliveryDaysItem?.product_id ===
                                      product?.id,
                                  )?.delivery_days !== undefined && (
                                    <>
                                      <Image
                                        style={{
                                          height: 20,
                                          width: 20,
                                          marginRight: 8,
                                          tintColor: '#6f6f6f',
                                        }}
                                        source={require('../../../../../../assets/delivery.png')}
                                      />

                                      <Text style={{color: '#1c60dc'}}>
                                        {'Get it within ' +
                                          deliveryDays?.delivery_days?.find(
                                            deliveryDaysItem =>
                                              deliveryDaysItem?.product_id ===
                                              product?.id,
                                          )?.delivery_days +
                                          ' days'}
                                      </Text>
                                    </>
                                  )}
                                </View>
                              </View>
                            </>
                          ) : null} */}
                        </View>
                      ) : null}

                      <ExpiryInfoComponent
                        productExpiry={product.pd_expiry_date}
                        infoToDisplay={'Expires in/after'}
                        producType={'grouped'}
                      />
                    </View>
                  );
                })}
              </View>
              <Modal
                visible={this.state.infoModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => this.setState({infoModal: false})}>
                <View style={styles.modalWrapper}>
                  <View style={{alignSelf: 'center'}}>
                    {this.state.messages?.map(message => {
                      return <Text>{message}</Text>;
                    })}
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({infoModal: false})}>
                      <Text
                        allowFontScaling={false}
                        style={styles.modalCloseButton}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Modal
                visible={this.state.shareReferModal}
                // visible={true}
                transparent={true}
                animationType="fade"
                onRequestClose={() => this.setState({shareReferModal: false})}>
                <View style={styles.shareReferModalView}>
                  <View style={styles.shareReferModalContainer}>
                    <View style={styles.shareTitle}>
                      <Text style={styles.shareTitleText}>
                        Share this product with your friend and get reward
                        coins.
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.setState({shareReferModal: false})}>
                        <Image
                          source={require('../../../../../../assets/close.png')}
                          style={styles.shareModalCloseIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    <Pressable
                      disabled={!!!this.state.referralRecord?.onelink_url}
                      onPress={() =>
                        this.copyToClipboard(
                          this.state.referralRecord?.onelink_url,
                        )
                      }
                      style={styles.referLinkView}>
                      <Text style={styles.referLink}>
                        {this.state.referralRecord?.onelink_url?.length > 36
                          ? this.state.referralRecord?.onelink_url?.substr(
                              0,
                              36,
                            ) + '...'
                          : this.state.referralRecord?.onelink_url?.substr(
                              0,
                              36,
                            )}
                      </Text>
                      {!!this.state.referralRecord?.onelink_url ? (
                        <Image style={styles.copyImg} source={copy} />
                      ) : (
                        <ActivityIndicator size="small" />
                      )}
                    </Pressable>

                    <View style={styles.socialIconsView}>
                      <TouchableOpacity
                        onPress={() =>
                          this.referralShare(
                            this.state.referralRecord?.onelink_url,
                            Share.Social.WHATSAPP,
                          )
                        }>
                        <Icon
                          size={27}
                          style={styles.socialIcons}
                          name="whatsapp"
                          type="Feather"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          this.referralShare(
                            this.state.referralRecord?.onelink_url,
                            Share.Social.TWITTER,
                          )
                        }>
                        <Icon
                          size={27}
                          style={styles.socialIcons}
                          name="twitter"
                          type="Feather"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          this.referralShare(
                            this.state.referralRecord?.onelink_url,
                            Share.Social.INSTAGRAM,
                          )
                        }>
                        <Icon
                          size={27}
                          style={styles.socialIcons}
                          name="instagram"
                          type="Feather"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          this.referralShare(
                            this.state.referralRecord?.onelink_url,
                            Share.Social.PINTEREST,
                          )
                        }>
                        <Icon
                          size={27}
                          style={styles.socialIcons}
                          name="pinterest"
                          type="MaterialCommunityIcons"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          this.referralShare(
                            this.state.referralRecord?.onelink_url,
                            Share.Social.LINKEDIN,
                          )
                        }>
                        <Icon
                          size={27}
                          style={styles.socialIcons}
                          name="linkedin"
                          type="Feather"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          this.referralShare(
                            this.state.referralRecord?.onelink_url,
                            Share.Social.FACEBOOK,
                          )
                        }>
                        <Icon
                          size={27}
                          style={styles.socialIcons}
                          name="facebook"
                          type="Feather"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Text allowFontScaling={false}>No group Products Available.</Text>
          )}
        </>
        {/* // )} */}
      </View>
    );
  }
}
