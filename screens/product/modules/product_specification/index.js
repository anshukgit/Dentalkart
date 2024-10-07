import React, {Component, useCallback} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './product_specification.style';
import SimpleProduct from './modules/simple_product';
import GroupedProduct from './modules/grouped_product';
import ConfigurableProduct from './modules/configurable_product';
import BundleProduct from './modules/bundle_product';
import HTML from 'react-native-render-html';
import {DentalkartContext} from '@dentalkartContext';
import {newclient} from '@apolloClient';
import {GET_GROUP_PRODUCT_QUERY, GET_PROMOTION_BY_SKU} from '../../graphql';
import {
  ExpiryInfoComponent,
  DispatchInfoComponent,
} from './modules/product_expiry_dispatch_info';
import SubscribeForStockAlert from '../stock_alert';
import TouchableDebounce from '@components/touchableDebounce';
import {showErrorMessage} from '../../../../helpers/show_messages';
import {promotionBySkuClient} from '../../../../apollo_client';

export default class ProductSpecification extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      _this: props._this,
      product: props.product,
      childProducts: null,
      deliveryDays: [],
      promotionBySku: '',
    };
  }

  getGroupProduct = async () => {
    if (this.props.product.type_id === 'grouped') {
      try {
        const {data} = await newclient.query({
          query: GET_GROUP_PRODUCT_QUERY,
          variables: {id: this.state.product.id},
          fetchPolicy: 'cache-first',
        });
        if (data?.childProductV2) {
          this.setState({childProducts: data?.childProductV2});
        }
      } catch (error) {
        showErrorMessage(`${error.message}. Please try again.`);
      }
    }
  };

  promotionOfferBySku = async () => {
    const {product} = this.props;
    try {
      const {data} = await promotionBySkuClient.query({
        query: GET_PROMOTION_BY_SKU,
        variables: {
          sku: product?.type_id === 'simple' ? this.props?.product?.sku : '',
          parent_id: product?.type_id === 'simple' ? undefined : product?.id,
        },
      });
      // console.log(
      //   'GET_PROMOTION_BY_SKU==GET_PROMOTION_BY_SKU!!!====--**',
      //   JSON.stringify(data),
      // );
      if (data?.getItemPromotionOfferBySku) {
        this.setState({
          promotionBySku: data?.getItemPromotionOfferBySku,
        });
      }
    } catch (error) {
      // showErrorMessage(`${error.message}. Please try again.`);
    }
  };

  componentDidMount() {
    this.getGroupProduct();
    this.promotionOfferBySku();
  }

  setDeliveryDays = value => {
    this.setState({deliveryDays: value});
  };

  render() {
    const {_this, childProducts} = this.state;
    const {product} = this.props;
    const isPriceVisible = !product.msrp;
    const {navigation} = _this.props;

    let minimalPrice = product?.price?.minimalPrice?.amount?.value;
    let regularPrice = product?.price?.regularPrice?.amount?.value;
    let BRANDSS = this.props?.brand?.filter(
      item =>
        item.brand_id &&
        String(item.brand_id) === String(product?.manufacturer),
    );

    const renderItem = ({item, index}) => {
      console.log('item========item===item', item);
      return (
        <>
          <View style={{paddingHorizontal: 2, flex: 1}}>
            {Array.isArray(item) && item.length > 0 ? (
              <View
                style={[
                  !!this.state.promotionBySku ? {width: 'auto'} : {width: 361},
                  styles.boxOffer,
                ]}>
                <View
                  style={{
                    padding: 4,
                  }}>
                  {item.map(e => (
                    <View>
                      {/* <Text style={styles.dot}>•</Text> */}
                      <Text
                        allowFontScaling={false}
                        style={styles.tierPrice}
                        key={index}>
                        {`${
                          e?.message
                            ? e?.message
                            : 'Buy ' +
                              e?.qty +
                              ' or above for ' +
                              product?.price?.regularPrice?.amount
                                ?.currency_symbol +
                              '' +
                              e.value +
                              ' each and save ' +
                              (100 - (e.value * 100) / minimalPrice).toFixed(
                                2,
                              ) +
                              '%'
                        }`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : item?.message ? (
              // <>
              //   {item?.message?.map(e => (
              <View
                style={[
                  styles.boxOffer,
                  // {width: 360},
                  product?.tier_prices?.length > 0
                    ? {width: 320}
                    : {width: 350},
                ]}>
                <View
                  style={{
                    padding: 4,
                  }}>
                  {/* <Text style={[styles.dot, {bottom: 3}]}>•</Text> */}
                  <Text
                    allowFontScaling={false}
                    style={styles.tierPrice}
                    key={index}>
                    {/* {e?.message} */}
                    {this.state.promotionBySku?.message}
                  </Text>
                </View>
              </View>
            ) : //   ))}
            // </>
            null}
          </View>
        </>
      );
    };

    return (
      <View style={styles.productDetailsContainer}>
        <View id={product.id} style={styles.productDetailsWrapper}>
          <View style={styles.productNameWrapper}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={styles.productName}>
              {product.name}
            </Text>
          </View>
          {product.short_description ? (
            <View style={styles.shortDescriptionWrapper}>
              <HTML
                baseStyle={styles.shortDescription}
                source={{html: product.short_description}}
              />
            </View>
          ) : null}
          {BRANDSS?.length > 0 && BRANDSS?.[0]?.is_active ? (
            <Text allowFontScaling={false}>
              Manufacturer :{' '}
              <TouchableDebounce
                onPress={() =>
                  navigation.navigate('UrlResolver', {
                    url_key: `/${BRANDSS?.[0]?.url_path}.html`,
                  })
                }>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 12,
                    color: '#666',
                    textDecorationLine: 'underline',
                  }}>
                  {BRANDSS?.[0]?.name}
                </Text>
              </TouchableDebounce>
            </Text>
          ) : null}
          {isPriceVisible && product.price.minimalPrice.amount.value ? (
            <View style={styles.productNewpriceWrapper}>
              {product.type_id === 'grouped' ? (
                <>
                  <Text
                    allowFontScaling={false}
                    style={styles.productStartingAtPrice}>
                    Starting at:{' '}
                    {product.price.regularPrice.amount.currency_symbol}{' '}
                  </Text>
                  <Text allowFontScaling={false} style={styles.productNewprice}>
                    {this.props?.groupedProductData?.parent_price}
                  </Text>
                </>
              ) : (
                <>
                  <Text allowFontScaling={false} style={styles.currency}>
                    {product.price.regularPrice.amount.currency_symbol}
                  </Text>
                  <Text allowFontScaling={false} style={styles.productNewprice}>
                    {product.price.minimalPrice.amount.value}
                  </Text>
                </>
              )}
            </View>
          ) : null}
          {product.dentalkart_custom_fee != null &&
          product.dentalkart_custom_fee > 0 ? (
            <View>
              <Text allowFontScaling={false} style={styles.deliveryFee}>
                {' '}
                +{' '}
                {product.price.regularPrice.amount.currency_symbol +
                  product.dentalkart_custom_fee}{' '}
                Delivery Fee
              </Text>
            </View>
          ) : null}
          <View style={styles.productPriceInfoWrapper}>
            {product.price &&
            product.type_id !== 'grouped' &&
            product.price.regularPrice.amount.value >
              product.price.minimalPrice.amount.value ? (
              <Text allowFontScaling={false} style={styles.productOldprice}>
                {product.price.regularPrice.amount.currency_symbol}
                {product.price.regularPrice.amount.value}
              </Text>
            ) : null}
            {product.price &&
            product.type_id !== 'grouped' &&
            product.price.regularPrice.amount.value >
              product.price.minimalPrice.amount.value ? (
              <Text allowFontScaling={false} style={styles.productDiscount}>
                {(
                  100 -
                  (product.price.minimalPrice.amount.value * 100) /
                    product.price.regularPrice.amount.value
                ).toFixed(2)}
                % Off
              </Text>
            ) : null}
            {product.average_rating && product.rating_count > 0 ? (
              <View style={styles.reviewsWrapper}>
                <View style={styles.ratingBoxWrapper}>
                  <Text allowFontScaling={false} style={styles.ratingBox}>
                    {parseFloat(product.average_rating).toFixed(1)}
                  </Text>
                  <MCIcon name="star" style={styles.ratingBoxIcon} />
                </View>
                <Text allowFontScaling={false} style={styles.reviewsQty}>
                  ({product.rating_count})
                </Text>
              </View>
            ) : (
              false
            )}
          </View>
          {product.dispatch_days &&
            childProducts &&
            product.type_id === 'grouped' && (
              <DispatchInfoComponent
                dispatchDays={product.dispatch_days}
                infoToDisplay={'-Dispatches from warehouse in - '}
                producType={'grouped'}
                productId={product.id}
                navigation={navigation}
                childProducts={childProducts}
                setDeliveryDays={this.setDeliveryDays}
              />
            )}
          {product.type_id === 'simple' && !product.is_in_stock ? (
            <View style={styles.availablityWrapper}>
              <Text allowFontScaling={false} style={styles.soldOutText}>
                Sold out
              </Text>
            </View>
          ) : null}
          {this.props?.groupedProductData?.parent_price === undefined ? null : (
            <>
              {product.type_id === 'grouped' &&
              !this.props?.groupedProductData.parent_stock_status ? (
                <View style={styles.availablityWrapper}>
                  <Text allowFontScaling={false} style={styles.soldOutText}>
                    Sold out
                  </Text>
                </View>
              ) : null}
            </>
          )}
          {this.context?.country?.country_id === 'IN' &&
          product.reward_point_product ? (
            <View style={styles.rewardWrapper}>
              <Image
                source={{
                  uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/coin.png',
                }}
                style={styles.rewardIcon}
              />
              <Text allowFontScaling={false} style={styles.rewardPoints}>
                {product.reward_point_product}
              </Text>
            </View>
          ) : null}
          {(product.type_id === 'grouped' && !!this.state.promotionBySku) ||
          (product.type_id === 'simple' && this.state.promotionBySku) ? (
            <>
              <View style={styles.diractionView}>
                <Image
                  style={styles.imageOffer}
                  resizeMode="contain"
                  source={require('../../../../assets/offerIcon.png')}
                />
                <Text style={styles.availableText}>Available Offers</Text>
              </View>
              <View style={{width: '100%', marginBottom: 10}}>
                <FlatList
                  data={[
                    product?.tier_prices,
                    {
                      message:
                        product?.type_id !== 'gropued' &&
                        product?.type_id === 'simple'
                          ? this.state.promotionBySku?.message
                          : '',
                    },
                  ]}
                  horizontal
                  ItemSeparatorComponent={() => <View style={{width: 5}} />}
                  renderItem={renderItem}
                  // renderItem={({item, index}) => (

                  //   <View style={styles.boxOffer}>
                  //     <Text style={styles.dot}>•</Text>
                  //     {/* <Text style={styles.discrapton}>{item.}</Text> */}
                  //     <Text
                  //       allowFontScaling={false}
                  //       style={styles.tierPrice}
                  //       key={index}>
                  //       Buy {item?.tier_prices.qty} or above for{' '}
                  //       {item.price.regularPrice.amount.currency_symbol}
                  //       {item.value} each and save{' '}
                  //       {(
                  //         100 -
                  //         (item.value * 100) /
                  //           item.price.minimalPrice.amount.value
                  //       ).toFixed(2)}
                  //       %
                  //     </Text>
                  //   </View>
                  // )}
                  keyExtractor={(item, index) => index.toString()}
                  // extraData={addressData}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </>
          ) : null}
          {/* {isPriceVisible && product.tier_prices ? (
            <View style={styles.tierPriceWrapper}>
              {product.tier_prices.map(
                (tierItem, index) =>
                  tierItem.value < minimalPrice && (
                    <Text
                      allowFontScaling={false}
                      style={styles.tierPrice}
                      key={index}>
                      Buy {tierItem.qty} or above for{' '}
                      {product.price.regularPrice.amount.currency_symbol}
                      {tierItem.value} each and save{' '}
                      {(
                        100 -
                        (tierItem.value * 100) /
                          product.price.minimalPrice.amount.value
                      ).toFixed(2)}
                      %
                    </Text>
                  ),
              )}
              {!!this.state.promotionBySku && (
                <Text allowFontScaling={false} style={styles.tierPrice}>
                  {this.state.promotionBySku}
                </Text>
              )}
            </View>
          ) : null} */}
          {product.only_x_left_in_stock ? (
            <View style={styles.leftInStockWrapper}>
              <Text allowFontScaling={false} style={styles.leftInStock}>
                Only {product.only_x_left_in_stock} left in stock
              </Text>
            </View>
          ) : null}

          {console.log('childProducts===childProducts', childProducts)}
          {product.type_id === 'simple' ? (
            <SimpleProduct _this={_this} product={product} />
          ) : product.type_id === 'grouped' &&
            childProducts?.items?.length > 0 ? (
            <GroupedProduct
              promotionProduct={this.state.promotionBySku}
              _this={_this}
              navigation={navigation}
              product={product}
              childProducts={childProducts}
              deliveryDays={this.state?.deliveryDays}
              productPrice={this.props.productPrice}
              productPriceQty={this.props.productPriceQty}
            />
          ) : product.type_id === 'configurable' ? (
            <ConfigurableProduct
              _this={_this}
              setConfigurableProductOptions={
                _this.setConfigurableProductOptions
              }
              product={product}
            />
          ) : product.type_id === 'bundle' ? (
            <BundleProduct
              _this={_this}
              setProductOptions={_this.setProductOptions}
              product={product}
            />
          ) : (
            <Text allowFontScaling={false}>No Product type</Text>
          )}
          {product.type_id !== 'grouped' ? (
            <View style={{}}>
              <ExpiryInfoComponent
                productExpiry={product.pd_expiry_date}
                infoToDisplay={'Expiry Date'}
                producType={product.type_id}
              />

              <DispatchInfoComponent
                dispatchDays={product.dispatch_days}
                infoToDisplay={'Dispatch time'}
                producType={product.type_id}
                productId={product.id}
                navigation={navigation}
              />
            </View>
          ) : null}
        </View>

        {/* {!product.is_in_stock ? (
          <SubscribeForStockAlert
            productId={product.id}
            navigation={navigation}
          />
        ) : null} */}

        {/* {this.props?.groupedProductData?.parent_price === undefined ? null : (
          <>
            {product.type_id === 'grouped' &&
            !this.props?.groupedProductData.parent_stock_status ? (
              <SubscribeForStockAlert
                productId={product.id}
                navigation={navigation}
              />
            ) : null}
          </>
        )} */}

        {product.type_id === 'simple' && !product.is_in_stock ? (
          <SubscribeForStockAlert
            productId={product.id}
            navigation={navigation}
          />
        ) : null}

        <View style={styles.buttonsWrapper}>
          <TouchableCustom
            onPress={() => _this.share(product)}
            underlayColor={'#ffffff10'}>
            <View style={styles.shareButton}>
              <MCIcon name="share" size={14} color="#21212180" />
              <Text allowFontScaling={false} style={styles.shareButtonText}>
                Share
              </Text>
            </View>
          </TouchableCustom>
          <TouchableCustom
            onPress={() => _this.addToWishlist(product.id, product.sku)}
            underlayColor={'#ffffff10'}>
            <View style={styles.shareButton}>
              <MCIcon name="heart" size={14} color="#21212180" />
              <Text allowFontScaling={false} style={styles.shareButtonText}>
                Add To Wishlist
              </Text>
            </View>
          </TouchableCustom>
        </View>
      </View>
    );
  }
}
