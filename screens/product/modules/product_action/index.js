import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Loader from '@components/loader';
import TouchableCustom from '@helpers/touchable_custom';
import styles from './product_action.style';
import {hasNotch} from 'react-native-device-info';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export default class ProductAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bnloading: false,
      acloading: false,
    };
  }
  handleAction = async type => {
    if (type === 'BN') {
      this.setState({bnloading: true});
      await this.props.buyNowPress();
    } else {
      this.setState({acloading: true});
      await this.props.addToCartPress();
    }
    setTimeout(() => {
      this.setState({
        bnloading: false,
        acloading: false,
      });
    }, 2000);
  };
  render() {
    const {bnloading, acloading} = this.state;
    const {product, openBulkModal} = this.props;
    const disabled = this.props.disabled;
    const bothTrue = product.msrp !== null && product?.demo_available === '1';

    console.log('VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVv', product);

    return (
      <View>
        <Loader
          loading={this.state.acloading || this.state.bnloading}
          transparent={true}
        />
        {product.msrp !== null || product?.demo_available === '1' ? (
          <View style={styles.productActionWrapper}>
            {product.msrp !== null ? (
              <View style={styles.requestPriceContainer}>
                <TouchableCustom
                  underlayColor={'#ffffff10'}
                  onPress={() => openBulkModal(1)}>
                  <View
                    style={[
                      styles.requestPriceWrapper,
                      {width: widthPercentageToDP(bothTrue ? '40%' : '90%')},
                      bothTrue && styles.outlineButton,
                    ]}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.actionButtonText,
                        bothTrue && styles.actionButtonTextColor,
                      ]}>
                      REQUEST PRICE
                    </Text>
                  </View>
                </TouchableCustom>
              </View>
            ) : null}
            {product?.demo_available === '1' ? (
              <View style={styles.requestPriceContainer}>
                <TouchableCustom
                  underlayColor={'#ffffff10'}
                  onPress={() => openBulkModal(2)}>
                  <View
                    style={[
                      styles.requestPriceWrapper,
                      {width: widthPercentageToDP(bothTrue ? '40%' : '90%')},
                    ]}>
                    <Text
                      allowFontScaling={false}
                      style={styles.actionButtonText}>
                      REQUEST FREE DEMO
                    </Text>
                  </View>
                </TouchableCustom>
              </View>
            ) : null}
          </View>
        ) : (
          <View
            style={[
              styles.productActionWrapper,
              hasNotch() ? styles.buttonNotchIssue : '',
            ]}>
            <View
              style={[
                styles.buyNowContainer,
                disabled ? styles.disabled : null,
              ]}>
              <TouchableCustom
                disabled={
                  disabled || this.state.acloading || this.state.bnloading
                }
                underlayColor={'#ffffff10'}
                onPress={() => (!bnloading ? this.handleAction('BN') : null)}>
                <View style={styles.buyNowWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={styles.actionButtonText}>
                    BUY NOW
                  </Text>
                </View>
              </TouchableCustom>
            </View>
            <View
              style={[
                styles.buyNowContainer,
                styles.borderLeft,
                disabled ? styles.disabled : null,
              ]}>
              <TouchableCustom
                underlayColor={'#ffffff10'}
                disabled={
                  disabled || this.state.acloading || this.state.bnloading
                }
                onPress={() => (!acloading ? this.handleAction('AC') : null)}>
                <View style={styles.addToCartWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={styles.actionButtonText}>
                    ADD TO CART
                  </Text>
                </View>
              </TouchableCustom>
            </View>
          </View>
        )}
      </View>
    );
  }
}
