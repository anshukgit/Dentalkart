import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './homepagecarousel.style';
import getImageUrl from '@helpers/getImageUrl';
import getDiscount from '@helpers/getDiscount';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DentalkartContext} from '@dentalkartContext';
import {productClick} from '../../../../helpers/sendData';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';
export default class HomepageCarousel extends PureComponent {
  static contextType = DentalkartContext;
  getProductBlock = (product, index, heading) => {
    if (product) {
      return (
        <View
          style={[
            styles.container,
            index % 2 == 0 ? styles.productBoxBorderRight : null,
            index === 0 || index === 1 ? styles.productBoxBorderBottom : null,
          ]}>
          {this.productsCardTemplate(product, index, heading)}
        </View>
      );
    }
    // return <Text allowFontScaling={false}>No product data</Text>;
    return (
      <View
        style={[
          styles.container,
          index % 2 == 0 ? styles.productBoxBorderRight : null,
          index === 0 || index === 1 ? styles.productBoxBorderBottom : null,
        ]}>
        <View style={styles.productBox}></View>
      </View>
    );
  };
  productsCardTemplate = (product, index, heading) => {
    const {navigation} = this.props;
    const {allPromotionProducts} = this.props;
    const isPriceVisible = !product.msrp;
    const regularPrice = product.price.regularPrice.amount.value;
    const minimalPrice = product.price.minimalPrice.amount.value;
    const discountPercentage = getDiscount(product);
    const currency = product.price.regularPrice.amount.currency_symbol;
    return (
      <TouchableOpacity
        onPress={() => {
          const {userInfo} = this.context;
          let data = {
            customer_id: userInfo?.getCustomer.email
              ? userInfo?.getCustomer.email
              : null,
            origin_page: 'home',
            landing_page: 'product',
            section: heading,
            position: '',
            product_id: product?.id,
          };
          productClick(data);
          navigation.navigate('UrlResolver', {url_key: product.url_key});
        }}>
        <View
          style={[
            styles.productBox,

            // index % 2 == 0 ? styles.productBoxBorderRight : null,
            // index === 0 || index === 1 ? styles.productBoxBorderBottom : null,
            // allPromotionProducts?.some(e => e.product_sku === product?.sku) && {
            //   maxHeight: 510,
            //   paddingBottom: 10,
            // },
          ]}>
          <View style={styles.productImageWrapper}>
            <Image
              resizeMethod={'resize'}
              source={{uri: getImageUrl(product?.thumbnail_url)}}
              style={styles.productImage}
            />
          </View>
          <View style={styles.productNameWrapper}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={styles.productName}>
              {product.name}
            </Text>
          </View>
          {/* =========rating and amount÷ */}
          <View style={styles.priceWrapper}>
            <View style={styles.reviewWrapper}>
              {product.average_rating &&
              parseFloat(product.average_rating) > 0 ? (
                <View style={styles.ratingWrapper}>
                  <Text allowFontScaling={false} style={styles.rating}>
                    {parseFloat(product.average_rating).toFixed(1)}
                    <MCIcon name="star" style={styles.star} />
                  </Text>
                </View>
              ) : null}
              {product.rating_count && (
                <View>
                  <Text allowFontScaling={false} style={styles.numbers}>
                    ({product.rating_count} reviews)
                  </Text>
                </View>
              )}
            </View>
            {isPriceVisible && (
              <View style={styles.pricingWrapper}>
                {
                  <View style={styles.pricingWrapper}>
                    {product.type_id === 'grouped' ? (
                      <Text allowFontScaling={false} style={styles.numbers}>
                        Starting at:{' '}
                      </Text>
                    ) : null}
                    <Text
                      allowFontScaling={false}
                      style={
                        styles.specialPrice
                      }>{`${currency} ${minimalPrice} `}</Text>
                  </View>
                }
                {(minimalPrice !== regularPrice) & (regularPrice > 0) ? (
                  <Text allowFontScaling={false} style={styles.newPrice}>
                    {currency}
                    {regularPrice}
                  </Text>
                ) : null}
                {/*discountPercentage > 0 ? (<Text allowFontScaling={false} style={styles.discount}>{discountPercentage}% Off</Text>) : null*/}
              </View>
            )}
          </View>
          {this.context.country &&
          this.context?.country?.country_id === 'IN' &&
          product.reward_point_product &&
          product.reward_point_product !== 0 ? (
            <View style={{alignItems: 'center'}}>
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

              {/* {allPromotionProducts?.some(
                e => e.product_sku === product?.sku,
              ) ||
              allPromotionProducts?.some(e => e.parent_sku === product?.sku) ? (
                <Text
                  style={{color: '#388E3C', fontWeight: '600', fontSize: 13}}>
                  Enjoy Free Product
                </Text>
              ) : null} */}
            </View>
          ) : null}
          {!!allPromotionProducts &&
          (allPromotionProducts?.some(e => e.product_sku === product?.sku) ||
            allPromotionProducts?.some(e => e.parent_sku === product?.sku)) ? (
            <View
              style={
                product.reward_point_product &&
                product.reward_point_product !== 0
                  ? {}
                  : {marginTop: 5}
              }>
              <Text style={{color: '#388E3C', fontWeight: '600', fontSize: 13}}>
                Enjoy Free Gift
              </Text>
            </View>
          ) : null}
          {product.discount > 0 ? (
            <Text allowFontScaling={false} style={styles.discount}>
              {product.discount}%
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const {gridData, getProduct, navigation} = this.props;
    const skus = gridData && gridData.sku.slice(0, 4);
    return (
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={['#2b79ac', '#fff']}
          start={{x: 0, y: 0}}
          style={[styles.cardWrapper, {height: 600}]}>
          <View style={styles.categoryTitleWrapper}>
            <View style={styles.categoryTitle}>
              <Text allowFontScaling={false} style={styles.categoryName}>
                {gridData.heading}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                AnalyticsEvents('VIEW_ALL', 'All Click', {}),
                  navigation.navigate('UrlResolver', {
                    url_key: gridData.heading_url,
                  });
              }}>
              <View style={styles.categoryButtonWrapper}>
                <View style={styles.categoryButton}>
                  <Text
                    allowFontScaling={false}
                    style={styles.categoryButtonText}>
                    View All
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <FlatList
            data={skus}
            renderItem={({item, index}) =>
              this.getProductBlock(getProduct(item), index, gridData.heading)
            }
            numColumns={2}
            keyExtractor={(sku, index) => index}
            style={styles.productsCard}
            initialNumToRender={4}
          />
        </LinearGradient>
      </View>
    );
  }
}
