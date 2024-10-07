import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './transit_details.style';
import {newclient} from '@apolloClient';
import {GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY} from '../../graphql';
import {showErrorMessage} from '../../../../../../helpers/show_messages';
import Timeline from 'react-native-timeline-flatlist';
import HeaderComponent from '@components/HeaderComponent';

export default class transitDetails extends Component {
  constructor(props) {
    super(props);
    const fetchData = null;
    this.state = {
      orderDetailsData: null,
      orderDetailsLoader: false,
      orderDetailsError: false,
      orderArr: [],
      isModalVisibal: false,
      items: [],
      transDetails: '',
      tracking: [],
      TrackingData: [],
    };
  }

  getOrderDetailsData = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');
    const transDetails = navigation.getParam('transDetails');

    const {trackByTrackNumberV2} = transDetails;

    const transData = trackByTrackNumberV2;
    console.warn('trans data : ', transData);
    if (transData.response) {
      var trackeArr = transData.response.scan;
      if (trackeArr) {
        trackeArr.map((val) => {
          val.title = val.status_detail;
          val.description = val.location;
        });

        this.setState({tracking: trackeArr});
      }
    }

    this.setState({transDetails: transDetails});
    try {
      this.setState({orderDetailsLoader: true});
      const {data} = await newclient.query({
        query: GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY,
        fetchPolicy: 'network-only',
        variables: {order_id: orderId},
      });
      if (data && data.OrderDetailsV4) {
        // this.getRefetchRes();
        if (this.state.orderDetailsError) {
          this.setState({orderDetailsError: false});
        }
        this.setState({orderDetailsData: data, orderDetailsLoader: false});
      }
    } catch (e) {
      console.log('rderError', e);
      this.setState({orderDetailsLoader: false});
      this.setState({orderDetailsError: true});
      showErrorMessage(e.message);
    }
  };

  componentDidMount() {
    this.getOrderDetailsData();
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
  }

  render() {
    const {trackByTrackNumberV2} = this.state.transDetails;
    // const { error } = trackByTrackNumberV2;
    const transData = trackByTrackNumberV2;

    return (
      <View style={{backgroundColor: '#EBFBFF'}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Transit Details'}
          style={{height: 40}}
        />
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

        {transData ? (
          transData.error ? (
            <View style={styles.shippingAddressView}>
              <Text allowFontScaling={false} style={styles.shippingAddressText}>
                We have dispatched your order through{' '}
                <Text
                  allowFontScaling={false}
                  style={{color: '#42A9E2', fontWeight: 'bold'}}>
                  {transData.error.transporter}
                </Text>
                . Our system has not updated details yet, but you can check the
                same at{' '}
                <Text
                  allowFontScaling={false}
                  style={{color: '#42A9E2', fontWeight: 'bold'}}>
                  {transData.error.transporter} Website
                </Text>
                . Find below the details to track your order:
              </Text>
              <Text allowFontScaling={false} style={{marginTop: 10}}>
                Website URL{' '}
                <Text
                  allowFontScaling={false}
                  style={{color: '#42A9E2', fontWeight: 'bold'}}>
                  {transData.error.url}
                </Text>
              </Text>
              <Text allowFontScaling={false} style={{marginTop: 5}}>
                Track No.{' '}
                <Text
                  allowFontScaling={false}
                  style={{color: '#42A9E2', fontWeight: 'bold'}}>
                  {transData.error.track_number}
                </Text>
              </Text>
            </View>
          ) : null
        ) : null}

        {this.state.tracking.length > 0 ? (
          <View
            style={{
              height: this.state.tracking.length * 110,
              paddingHorizontal: 20,
              backgroundColor: '#fff',
              marginBottom: 5,
              paddingTop: 8,
            }}>
            <View
              style={{width: '100%', height: this.state.tracking.length * 110}}>
              <Timeline
                data={this.state.tracking}
                circleSize={18}
                innerCircle={'icon'}
                iconStyle={{width: '50%'}}
                circleColor={colors.orangeBtn}
                lineColor={colors.orangeBtn}
                listViewStyle={{}}
                descriptionStyle={{color: 'gray', top: -18, fontSize: 10}}
                titleStyle={{top: -10, fontSize: 12.5, color: colors.black}}
                options={{
                  style: {paddingTop: 5, right: 0},
                  showsVerticalScrollIndicator: false,
                }}
                showTime={true}
                timeStyle={{width: 55, fontSize: 10, top: 5}}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
