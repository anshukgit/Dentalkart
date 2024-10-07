import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from 'native-base';
import styles from './order_Summary.style';
import {newclient} from '@apolloClient';
import {
  GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY,
  GET_ORDER_INVOICE,
} from '../../graphql';
import {showErrorMessage} from '../../../../../../helpers/show_messages';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import {showSuccessMessage} from '../../../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';

export default class orderSummary extends Component {
  constructor(props) {
    super(props);
    const fetchData = null;
    this.state = {
      orderDetailsData: null,
      orderDetailsLoader: false,
      orderDetailsError: false,
      orderInvoiceData: null,
      orderInvoiceLoader: false,
      orderArr: [],
      isModalVisibal: false,
      items: [],
      shippingAddress: '2398 House, 589 Road, 1234 New york, NY, USA',
      totalItem: 2,
      totalWeight: '9.20',
      subTotal: '49.10',
      couponapplied: '2.90',
      deliveryCharge: '10.10',
      totalSaving: '3.10',
      grandTotal: '46.00',
      earned: 0,
      used: 0,
      cartItem: [
        {
          pName: 'Finger Pulse oximete with OLED display',
          qty: '02',
          totalprice: '2.00',
          rewards: '02',
          unitPrice: '2.00',
        },
        {
          pName: 'ChlorHex Mouthwash',
          type: 'Manufacture: Waldent',
          qty: '02',
          totalprice: '2.00',
          rewards: '02',
          unitPrice: '2.00',
        },
      ],
    };
  }

  getOrderDetailsData = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');
    try {
      this.setState({orderDetailsLoader: true});
      const {data} = await newclient.query({
        query: GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY,
        fetchPolicy: 'network-only',
        variables: {order_id: orderId},
      });
      if (data && data.OrderDetailsV4) {
        if (this.state.orderDetailsError) {
          this.setState({orderDetailsError: false});
        }
        this.setState(
          {orderDetailsData: data, orderDetailsLoader: false},
          () => {},
        );
      }
    } catch (e) {
      console.log('renderError', e);
      this.setState({orderDetailsLoader: false});
      this.setState({orderDetailsError: true});
      showErrorMessage(e.message);
    }
  };

  getOrderInvoice = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');
    try {
      this.setState({orderInvoiceLoader: true});
      const {data} = await newclient.query({
        query: GET_ORDER_INVOICE,
        fetchPolicy: 'network-only',
        variables: {order_id: orderId},
      });
      if (data && data.GetInvoiceLink) {
        if (data.GetInvoiceLink.link) {
          this.setState({orderInvoiceData: data.GetInvoiceLink});
        }
      }
    } catch (e) {
      console.log('renderError', e);
      this.setState({orderInvoiceLoader: false});
    }
  };

  componentDidMount() {
    // this.triggerScreenEvent();
    this.getOrderDetailsData();
    this.getOrderInvoice();
  }

  dispItemListMappling() {
    const {OrderDetailsV4} = this.state.orderDetailsData;
    const order = OrderDetailsV4.order_summary;
    return order.map((data, index) => {
      return (
        <View style={styles.itemView}>
          <Text
            allowFontScaling={false}
            style={[
              styles.itemText,
              {
                fontWeight: data.code == 'grand_total' ? 'bold' : '500',
                fontSize: data.code == 'grand_total' ? 16 : 15,
              },
            ]}>
            {[data.label]}
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.itemTextCount,
              {
                fontWeight: data.code == 'grand_total' ? 'bold' : '500',
                fontSize: data.code == 'grand_total' ? 16 : 15,
              },
            ]}>
            {' '}
            <Icon
              name="rupee"
              type="FontAwesome"
              style={{fontSize: 13, color: colors.blueColor}}
            />{' '}
            {data.value}
          </Text>
        </View>
      );
    });
  }

  addressMapping() {
    const {OrderDetailsV4} = this.state.orderDetailsData;
    const order = OrderDetailsV4.shipping_address;
    return Object.entries(order).map(([key, value]) => {
      return value ? (
        <Text allowFontScaling={false} style={styles.address}>
          {value} ,{' '}
        </Text>
      ) : null;
    });
    // })
  }

  downloadDoc = async () => {
    var pdf_url = this.state.orderInvoiceData.link;
    const dirs = RNFetchBlob.fs.dirs;
    let options = {
      path: dirs.DocumentDir + `/${this.state.orderInvoiceData.order_id}.pdf`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: `${this.state.orderInvoiceData.order_id}.pdf`,
        path: dirs.DownloadDir + `/${this.state.orderInvoiceData.order_id}.pdf`,
      },
    };
    RNFetchBlob.config(options)
      .fetch('GET', pdf_url)
      .then(res => {
        console.log('res', res);
        showSuccessMessage('Invoice downloaded');
        {
          setTimeout(() => {
            FileViewer.open(res.path());
          }, 1000);
        }
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage, statusCode);
      });
  };

  render() {
    const order = this.state.orderDetailsData
      ? this.state.orderDetailsData.OrderDetailsV4.rewards
      : null;
    return (
      <View style={{backgroundColor: '#EBFBFF'}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Order Summary'}
          style={{height: 40}}
        />
        <ScrollView style={{height: '91%'}}>
          <View style={styles.shippingAddressView}>
            <Text allowFontScaling={false} style={styles.shippingAddressText}>
              Shipping Address
            </Text>

            {this.state.orderDetailsData ? (
              <Text
                allowFontScaling={false}
                style={{marginTop: 3, paddingBottom: 3}}>
                {this.addressMapping()}
              </Text>
            ) : null}
          </View>

          <View style={[styles.priceDetailView, {}]}>
            <Text allowFontScaling={false} style={styles.priceDetailText}>
              Order total
            </Text>
          </View>
          <View style={styles.billMainView}>
            {this.state.orderDetailsData ? this.dispItemListMappling() : null}
          </View>

          <View style={styles.rewardsPointsView}>
            <Text allowFontScaling={false} style={styles.rewardsPointsText}>
              Rewards points
            </Text>
            <View style={styles.earnedView}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 13, marginRight: 18}}>
                Earned:{' '}
                {this.state.orderDetailsData ? order.rewardpoints_earned : 0}
              </Text>
              <Text allowFontScaling={false} style={{fontSize: 13}}>
                Used:{' '}
                {this.state.orderDetailsData ? order.rewardpoints_used : 0}
              </Text>
            </View>
          </View>
          {this.state.orderInvoiceData && (
            <View style={styles.invoiceView}>
              <Text allowFontScaling={false} style={styles.invoiceText}>
                Invoices
              </Text>
              <View
                style={{
                  backgroundColor: '#f7f7f7',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}>
                <TouchableOpacity
                  onPress={() => this.downloadDoc()}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FeatherIcon name="download" size={20} color="gray" />
                  <Text
                    allowFontScaling={false}
                    style={{paddingStart: 10, color: 'gray'}}>
                    Download
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
