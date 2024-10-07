import React, {Component} from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import styles from './billing_details.style';
import getCartTotalWithKeys from '@helpers/getCartTotalWithKeys';

export default class BillingDetails extends Component {
  render() {
    const {cartPrices, cart, totalWeight, navigation, totalQuantity} =
      this.props;
    const shippingInformation = cart ? getCartTotalWithKeys(cart) : {};
    return (
      <View>
        <View style={[styles.couponeCodeView, {}]}>
          <View style={styles.couponeSubView}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 13, color: '#292929'}}>
              From now onwards you can apply coupon and use rewards on the
              payment page.
            </Text>
          </View>
        </View>
        <View style={styles.PriceDetailWrapper}>
          <View style={styles.priceDetailView}>
            <Text allowFontScaling={false} style={styles.priceDetailText}>
              Price detail
            </Text>
          </View>
          {Object.keys(shippingInformation).length ? (
            <View style={styles.detailWrapper}>
              <View style={styles.detail}>
                <Text allowFontScaling={false} style={styles.detailTitle}>
                  {'Total Quantity'}
                </Text>
                <Text allowFontScaling={false} style={styles.detailValue}>
                  {totalQuantity}
                </Text>
              </View>
              <View style={styles.detail}>
                <Text allowFontScaling={false} style={styles.detailTitle}>
                  {'Total Weight'}
                </Text>
                <Text allowFontScaling={false} style={styles.detailValue}>
                  {`${totalWeight.toFixed(2)} Kg`}
                </Text>
              </View>
              <FlatList
                data={Object.keys(shippingInformation)}
                renderItem={({item, index}) => {
                  return shippingInformation?.[item].visiblity ? (
                    <View style={styles.detail}>
                      {item === 'shipping' ? (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('DeliveryCharges', {
                              navigation: this.props.navigation,
                            })
                          }>
                          <Text
                            allowFontScaling={false}
                            style={styles.detailTitle}>
                            {'Delivery Charges (View Details)'}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text
                          allowFontScaling={false}
                          style={styles.detailTitle}>
                          {shippingInformation?.[item].key}
                        </Text>
                      )}
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.detailValue,
                          shippingInformation?.[item].style,
                        ]}>
                        {shippingInformation?.[item].currency}
                        {shippingInformation?.[item]?.value || 0}
                      </Text>
                    </View>
                  ) : null;
                }}
                keyExtractor={(item, index) => index.toString()}
                extractData={cart}
              />
              <View
                style={[
                  styles.priceDetailView,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopWidth: 2,
                    borderTopColor: colors.HexColor,
                    borderBottomWidth: 0,
                  },
                ]}>
                <View style={styles.totalAmountTitleWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={styles.totalAmountTitle}>
                    Grand Total
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={styles.totalAmountSubTitle}>
                    (inclusive of all taxes)
                  </Text>
                </View>
                <Text allowFontScaling={false} style={styles.totalAmountValue}>
                  {shippingInformation?.['grand_total']?.currency}
                  {shippingInformation?.['grand_total']?.value}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
