import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TouchableHighlight,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import {
  GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY,
  GET_CANCELABLE_ORDER,
  CANCEL_ORDER,
  GET_INVOICE_LINK,
  GET_CANCEL_REASONS,
  PREVIOUS_RETURN_LIST,
} from '../../graphql';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import styles from './order_details.style';
import {client, newclient, orderReturnStagingClient} from '@apolloClient';
import {NavigationActions, StackActions} from 'react-navigation';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {showErrorMessage, showSuccessMessage} from '@helpers/show_messages';
import {FETCH_ORDER_DETAILS_QUERY} from '@screens/payment/graphql';
import {RetryPaymentButton} from '@screens/payment/retryWithRazorpayPopUp';
import {Icon} from 'native-base';
import Modal from 'react-native-modal';
import HeaderComponent from '@components/HeaderComponent';
import colors from '../../../../../../config/colors';
import RadioButton from '@components/radioButton';
import AnalyticsEvents from '../../../../../../components/Analytics/AnalyticsEvents';
// import {orderReturnStagingClient} from '../../../../../../apollo_client';
import TRACK_RETURN_ITEM from '../../graphql/trackReturnItem.gql';
import WhatsApp from '@components/whatsApp';
import {snakeToTitleCase} from '../../../../../../helpers/formatter';
import {NoUnusedVariablesRule} from 'graphql';

export const RefetchOrderFiveTimes = props => {
  let refetchCounter = 0;
  let interval = setInterval(() => {
    refetchCounter = refetchCounter + 1;
    if (refetchCounter === 5) {
      clearInterval(interval);
    }
    props.getRefetchRes();
  }, 30000);

  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <View style={styles.refetchContainerView}>
      <View style={styles.refetchView}>
        <ActivityIndicator size={'large'} color={colors.blueColor} />
        <Text
          allowFontScaling={false}
          style={{fontWeight: 'bold', marginTop: 10}}>
          {' '}
          Please wait loading...{' '}
        </Text>
        <Text allowFontScaling={false} style={{padding: 5, fontSize: 12}}>
          we are verifying your payment status.{' '}
        </Text>
      </View>
    </View>
  );
};

export const RetryOrderComponent = props => {
  const paymentData = {...props.retryPaymentData};
  return (
    <View>
      <RetryPaymentButton
        paymentData={paymentData}
        navigation={props.navigation}
      />
    </View>
  );
};

const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

export default class OrderDetails extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    const fetchData = null;
    this.state = {
      fetchOrderRes: fetchData,
      orderDetailsData: null,
      orderDetailsLoader: false,
      orderDetailsError: false,
      orderArr: [],
      isModalVisibal: false,
      isCancelModalVisible: false,
      items: [],
      cancelReasons: [],
      invoiceLink: null,
      isInvoiceVisible: false,
      selectedReasonId: null,
      orderReturnDetailsData: [],
      previousReturnHistory: '',
    };
  }

  downloadFile = () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId', 'No-ID');
    const {fs, android, ios} = RNFetchBlob;
    // File URL which we want to download
    let FILE_URL = this.state.invoiceLink;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];
    const downloadPath = `${
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir
    }/invoice_${orderId}${file_ext}`;
    RNFetchBlob.fs
      .exists(downloadPath)
      .then(exist => {
        if (exist) {
          setTimeout(() => {
            FileViewer.open(downloadPath);
          }, 1000);
        } else {
          RNFetchBlob.config({
            path: downloadPath,
            addAndroidDownloads: {
              path: downloadPath,
              useDownloadManager: true,
              title: `invoice_${orderId}${file_ext}`,
              description: 'Invoices download complete.',
              mime: 'application/pdf',
              mediaScannable: true,
              notification: true,
            },
          })
            .fetch('GET', FILE_URL)
            .then(res => {
              showSuccessMessage(`Invoices Saved in downloads.`);
              setTimeout(() => {
                FileViewer.open(res.path());
              }, 1000);
            });
        }
      })
      .catch(e => {
        console.log('file check error ===', e);
      });
  };

  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Order Detail',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };

  getRefetchRes = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId', 'No-ID');
    try {
      const {data, loading, error} = await client.query({
        query: FETCH_ORDER_DETAILS_QUERY,
        fetchPolicy: 'network-only',
        variables: {
          order_id: orderId,
          rzp_payment_id: '',
          rzp_order_id: '',
          rzp_signature: '',
        },
      });
      if (data && data.fetchOrderV2 && data.fetchOrderV2.order_id) {
        this.setState({fetchOrderRes: data.fetchOrderV2});
      }
    } catch (e) {
      console.log(e.message);
      // showErrorMessage(e.message);
    }
  };

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
        // this.getRefetchRes();
        if (this.state.orderDetailsError) {
          this.setState({orderDetailsError: false});
        }
        this.setState({orderDetailsData: data, orderDetailsLoader: false});
      }
    } catch (e) {
      this.setState({orderDetailsLoader: false});
      this.setState({orderDetailsError: true});
      showErrorMessage(e.message);
    }
  };

  getReturnDetailsData = async () => {
    const {navigation} = this.props;
    const returnValues = navigation.getParam('returnValues');
    try {
      this.setState({orderDetailsLoader: true});
      const {data} = await orderReturnStagingClient.query({
        query: TRACK_RETURN_ITEM,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            sku: returnValues?.sku,
            return_id: returnValues?.returnID,
          },
        },
      });
      if (data && data.trackReturnItem) {
        this.setState({
          orderReturnDetailsData: data.trackReturnItem,
          orderDetailsLoader: false,
        });
      }
    } catch (e) {
      this.setState({orderDetailsLoader: false});
      this.setState({orderDetailsError: true});
      showErrorMessage(e.message);
    }
  };

  getOrderCancelStatus = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');

    try {
      this.setState({orderDetailsLoader: true});
      const {data} = await newclient.query({
        query: GET_CANCELABLE_ORDER,
        fetchPolicy: 'network-only',
        variables: {orderId: orderId},
      });
      if (data && data.getCancelableOrder) {
        this.setState({
          isFullCancel: data?.getCancelableOrder?.order?.isFullCancel,
          orderDetailsLoader: false,
        });
      }
    } catch (e) {
      this.setState({orderDetailsLoader: false});
    }
  };

  getInvoiceDownloadLink = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');

    try {
      this.setState({orderDetailsLoader: true});
      const {data} = await newclient.query({
        query: GET_INVOICE_LINK,
        fetchPolicy: 'network-only',
        variables: {order_id: orderId},
      });
      if (data && data?.GetInvoiceLink) {
        this.setState({invoiceLink: data.GetInvoiceLink?.link});
      }
    } catch (e) {
      console.log('GET_INVOICE_LINK Error', e);
      // showErrorMessage(e.message);
    }
  };

  getCancelReasons = async () => {
    try {
      this.setState({orderDetailsLoader: true});
      const {data} = await newclient.query({
        query: GET_CANCEL_REASONS,
        fetchPolicy: 'network-only',
      });
      if (data && data?.getCancelReasons) {
        this.setState({cancelReasons: data.getCancelReasons});
      }
    } catch (e) {
      console.log('getCancelReasons Error', e);
      showErrorMessage(e?.message);
    }
  };

  cancelOrder = async orderId => {
    this.setState({orderDetailsLoader: true});
    try {
      const {data} = await client.mutate({
        mutation: CANCEL_ORDER,
        variables: {
          orderId: orderId,
          fullOrderCancel: 1,
          reason: Number(this.state?.selectedReasonId) || 0,
        },
      });
      this.getOrderDetailsData().then(() => {
        this.setState({orderDetailsLoader: false});
        showSuccessMessage('Order Cancelled Successfully!');
        let data = {
          // id:
          name: String(
            this.state.orderDetailsData?.OrderDetailsV4?.packages?.[0]?.items
              .map(item => item?.name)
              .join(','),
          ),
          'order id': String(
            this.state.orderDetailsData?.OrderDetailsV4?.order_id,
          ),
          quantity:
            this.state.orderDetailsData?.OrderDetailsV4?.packages?.[0]?.items.map(
              item => item?.qty_ordered,
            ),

          sku: this.state.orderDetailsData?.OrderDetailsV4?.packages?.[0]?.items
            .map(item => item?.sku)
            .join(','),
          'Total Amount':
            this.state.orderDetailsData?.OrderDetailsV4?.order_summary?.[1]
              ?.value,
        };
        AnalyticsEvents('ORDER_CANCELLED', 'Order Cancelled', data);

        let resetAction;
        resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({routeName: 'Tabs'}),
            NavigationActions.navigate({routeName: 'OrdersList'}),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      });
      // reset([NavigationActions.navigate({routeName: 'OrdersList'})], 0);
    } catch (error) {
      this.setState({orderDetailsLoader: false});
      showErrorMessage(error.message);
    }
  };

  trackOrder(order, item) {
    const {navigate} = this.props.navigation,
      _this = this.props._this;
    let params = {};
    if (item.id) {
      params = {
        order_id: item.id,
      };
    } else {
      params = {
        order_id: order.order_id,
      };
    }
    navigate('TrackingDetails', {params: params});
  }
  products(order, item, index) {
    return (
      <TouchableHighlight underlayColor={'#fff'}>
        <View style={styles.card}>
          <View style={styles.imageDetailsWrapper}>
            <View style={styles.productDetailWrapper}>
              <Text allowFontScaling={false} style={styles.productIndex}>
                PRODUCT-{index + 1}
              </Text>
              <Text allowFontScaling={false} style={styles.productDetailValue}>
                {item.name}
              </Text>
              {item.options ? (
                <FlatList
                  data={item.options}
                  listKey={(item, index) => index.toString()}
                  keyExtractor={(item, index) => 'option-' + index.toString()}
                  renderItem={({item, index}) => (
                    <View style={styles.customizedProductDetailWrapper}>
                      <Text
                        allowFontScaling={false}
                        style={styles.customizedProductDetails}>
                        {item.label}:{' '}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.customizedProductDetails}>
                        {item.value}
                      </Text>
                    </View>
                  )}
                />
              ) : null}
              <Text allowFontScaling={false} style={styles.productDetailValue}>
                Quantity: {item.qty}
              </Text>
              <Text allowFontScaling={false} style={styles.productDetailValue}>
                Price: {order.currency} {item.price}
              </Text>
              {item.rewardpoints ? (
                <View style={styles.rewardWrapper}>
                  <Text allowFontScaling={false}>Rewards:</Text>
                  <Image
                    resizeMethod={'resize'}
                    source={{uri: order.rewards.reward_icon}}
                    style={styles.rewardIcon}
                  />
                  <Text allowFontScaling={false} style={styles.rewardPoints}>
                    {item.rewardpoints}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.productImageWrapper}>
              <Image
                resizeMethod={'resize'}
                source={{uri: item.thumbnail}}
                style={styles.productImage}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  orderMapping() {
    const {OrderDetailsV4} = this.state.orderDetailsData;
    const isFullCancel = this.state.isFullCancel;
    const order = OrderDetailsV4.packages;
    const orderId = OrderDetailsV4.order_id;
    // const canCancel = OrderDetailsV4.can_cancel;
    const orderStatus = OrderDetailsV4.order_status;

    return order.map((data, index) => {
      return (
        <View style={styles.moadlWhiteBgView} key={'orders' + index}>
          <View style={styles.packTextMainView}>
            <View style={styles.packageImgView}>
              <Image
                source={require('../../../../../../assets/packageImg.png')}
                style={{width: 40, height: 20, right: 3}}
                resizeMode={'contain'}
              />
              <Text
                allowFontScaling={false}
                style={{fontSize: 14, color: '#000'}}>
                Package {index + 1}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.itemCountView}
              onPress={() =>
                this.onTrackBtnPress({...data, scroll: true}, orderId)
              }>
              <Text allowFontScaling={false} style={styles.itemCountText}>
                {data.items.length} items in it
              </Text>
            </TouchableOpacity>
          </View>

          {data.tracking_number == null ? null : (
            <View style={styles.trackingTxtView}>
              <Text allowFontScaling={false} style={styles.trackingTxt}>
                Tracking No: {data.tracking_number}{' '}
              </Text>
            </View>
          )}
          <View style={styles.trackingTxtView}>
            <Text allowFontScaling={false} style={styles.trackingTxt}>
              status: {data.status}{' '}
            </Text>
          </View>
          {data.delivereddate == null ? null : (
            <View style={styles.deliveryTxtView}>
              <Text allowFontScaling={false} style={styles.deliveryTxt}>
                Expected delivery date {data.delivereddate}
              </Text>
            </View>
          )}
          <View style={styles.btnView}>
            {isFullCancel && orderStatus !== 'Cancelled' && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  isFullCancel
                    ? this.setState({isCancelModalVisible: true})
                    : null;
                }}
                style={styles.cardLeftButtonContainer}>
                <Text style={styles.cardLeftButtonText}>
                  {isFullCancel ? 'Cancel' : 'Buy it again'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.trakBtn}
              onPress={() => this.onTrackBtnPress(data, orderId)}>
              <Text allowFontScaling={false} style={styles.trackButtonText}>
                Track
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }

  dispItemList(items) {
    this.setState({items: items}, () => {
      this.setState({isModalVisibal: true});
    });
  }

  onTrackBtnPress(data) {
    console.log('order================================1111111', data);

    const {OrderDetailsV4} = this.state.orderDetailsData;
    const order = OrderDetailsV4;
    let returnValues = this.props.navigation.getParam('returnValues');
    // const returnValues = this.props.navigation.getParam('returnValues');
    // this.state.orderReturnDetailsData;
    // console.log('orderReturnDetailsData=====navigation====nwq!!!!neww', data);
    this.props.navigation.navigate('trackDetails', {
      data: data,
      orderId: order.order_id,
      returnData: this.state.orderReturnDetailsData?.items ? data : undefined,
      previousReturnHistory: this.state.previousReturnHistory
        ? this.state.previousReturnHistory?.filter(
            e => e?.return_id !== returnValues?.returnID,
          )
        : 0,
      // returnData: this.state.orderReturnDetailsData?.items?.[0],
    });
  }

  // addressMapping() {
  //   const {OrderDetailsV4} = this.state.orderDetailsData;
  //   const order = OrderDetailsV4?.shipping_address ?? {};
  //   console.log('order=====order===order', order);
  //   return Object.entries(order).map(([key, value]) => {
  //     return value ? (
  //       <Text
  //         allowFontScaling={false}
  //         style={styles.address}
  //         key={key?.toString()}>
  //         {value} ,{' '}
  //       </Text>
  //     ) : null;
  //   });
  // }

  addressMapping() {
    const {OrderDetailsV4} = this.state.orderDetailsData;
    const order = OrderDetailsV4?.shipping_address ?? {};
    // return Object.entries(order).map(([key, value]) => {
    //   if (value && value === 'Address_details') {
    //     return null;
    //   }
    //   return value ? (
    //     <Text
    //       allowFontScaling={false}
    //       style={styles.address}
    //       key={key?.toString()}>
    //       {value} ,{' '}
    //     </Text>
    //   ) : null;
    // });

    return (
      <View>
        <Text allowFontScaling={false} style={styles.address}>
          {order?.name}
        </Text>
        <Text allowFontScaling={false} style={styles.address}>
          {order?.street}
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.address, {width: '50%', lineHeight: 15}]}>
          {`${order?.region}, ${order?.country_id}, ${order?.postcode}`}
        </Text>
        <Text allowFontScaling={false} style={styles.address}>
          {`Mobile No - ${order?.telephone}`}
        </Text>
      </View>
    );
  }

  allItems() {
    let totalItem = [];
    const {OrderDetailsV4} = this.state.orderDetailsData;
    const order = OrderDetailsV4.packages;
    order.map((data, index) => {
      let item = totalItem.concat(data.items);
      totalItem = item;
    });
    this.onTrackBtnPress({items: totalItem, showOnlyItems: true});
  }

  totalQuantity() {
    let totalItemsCount = 0;
    const {OrderDetailsV4} = this.state.orderDetailsData;
    const order = OrderDetailsV4.packages;
    order.map((data, index) => {
      totalItemsCount += data.items.length;
    });
    return totalItemsCount > 1
      ? totalItemsCount + ' items'
      : totalItemsCount + ' item';
  }

  dispItemListMappling() {
    const {OrderDetailsV4} = this.state.orderDetailsData;
    const order = OrderDetailsV4.order_summary;
    return order.map((data, index) => {
      return (
        <View style={styles.itemView} key={index?.toString()}>
          <Text
            allowFontScaling={false}
            style={[
              styles.itemText,
              {
                fontWeight: data.code == 'grand_total' ? 'bold' : '400',
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
                fontWeight: data.code == 'grand_total' ? 'bold' : '400',
                fontSize: data.code == 'grand_total' ? 16 : 15,
              },
            ]}>
            {' '}
            <Icon
              name="rupee"
              type="FontAwesome"
              style={{fontSize: 13, color: colors.blueColor}}
            />{' '}
            {data?.value?.toFixed(2)}
          </Text>
        </View>
      );
    });
  }

  renderItem = ({item}) => {
    return (
      <>
        <View style={styles.separator}></View>
        <View style={styles.ItemContainer} key={item?.id}>
          <TouchableOpacity
            style={styles.regNoContainer}
            onPress={() => this.setState({selectedReasonId: item?.id})}>
            <RadioButton
              selected={
                this.state.selectedReasonId
                  ? this.state.selectedReasonId === item?.id
                  : false
              }
            />
            <Text
              allowFontScaling={false}
              // ellipsizeMode="tail"
              // numberOfLines={1}
              style={styles.regNoText}>
              {item?.reason}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  renderItemOrderedItems = ({item}) => {
    const {OrderDetailsV4} = this.state.orderDetailsData;
    console.log(
      'renderItemOrderedItems==_-===renderItemOrderedItems',
      OrderDetailsV4,
    );
    const order = OrderDetailsV4.packages;
    const orderId = OrderDetailsV4.order_id;
    return (
      <TouchableOpacity
        onPress={() =>
          this.onTrackBtnPress(item?.qty ? item : order?.[0], orderId)
        }
        style={{
          backgroundColor: 'white',
          marginVertical: 4,
          padding: 10,
          elevation: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View>
            <Text style={styles.itemDeliveredList}>
              {snakeToTitleCase(
                item?.status,
                item?.status === 'approved'
                  ? 'Approved'
                  : item?.status === 'rejected'
                  ? 'Rejected'
                  : null,
                item?.status === 'approved'
                  ? 'Request Approved'
                  : item?.status === 'rejected'
                  ? 'Request Rejected'
                  : null,
              )}
            </Text>
            <Text style={styles.itemDeliveredList}>
              {item.last_updated_date
                ? item.last_updated_date?.substr(0, 10)
                : this.state.orderDetailsData?.OrderDetailsV4?.order_date}
            </Text>
          </View>

          <Text style={styles.itemDeliveredList}>
            No. Of Items - {item?.qty_ordered ? item?.qty_ordered : item?.qty}
          </Text>
          <Text
            style={[
              styles.itemDeliveredList,
              {color: item?.qty ? '#FF0505' : '#2B5F2B'},
            ]}>
            {/* {item.status} */}
            {snakeToTitleCase(
              item?.status,
              item?.status === 'approved'
                ? 'Approved'
                : item?.status === 'rejected'
                ? 'Rejected'
                : null,
              item?.status === 'approved'
                ? 'Request Approved'
                : item?.status === 'rejected'
                ? 'Request Rejected'
                : null,
            )}
          </Text>
          <Image
            source={require('../../../../../../assets/arrowDown.png')}
            style={{transform: [{rotate: '270deg'}]}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  cancelButton = orderId => {
    return !this.state?.selectedReasonId &&
      this.state.cancelReasons.length > 0 ? (
      <TouchableOpacity
        style={styles.cancelBtnDisable}
        onPress={() => {
          null;
        }}>
        <Text allowFontScaling={false} style={styles.yesNoText}>
          Yes
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => {
          !this.state.orderDetailsLoader ? this.cancelOrder(orderId) : null;
        }}>
        {this.state.orderDetailsLoader ? (
          <ActivityIndicator animating={true} size="small" color="#FFF" />
        ) : (
          <Text allowFontScaling={false} style={styles.yesNoText}>
            Yes
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  previousReturnList = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');
    let returnValues = this.props.navigation.getParam('returnValues');

    try {
      if (returnValues?.sku) {
        this.setState({orderDetailsLoader: true});
        const {data} = await orderReturnStagingClient.query({
          query: PREVIOUS_RETURN_LIST,
          fetchPolicy: 'network-only',
          variables: {
            input: {
              sku: returnValues?.sku,
              order_id: orderId,
            },
          },
        });
        console.log('PREVIOUS_RETURN_LIST==PREVIOUS_RETURN_LIST', data);
        if (data && data.itemPreviousReturnList) {
          this.setState({
            previousReturnHistory: data.itemPreviousReturnList,
            orderDetailsLoader: false,
          });
        }
      } else {
        this.setState({
          orderDetailsLoader: false,
        });
      }
    } catch (e) {
      this.setState({orderDetailsLoader: false});
    }
  };

  async componentDidMount() {
    // this.focusListener = this.props.navigation.addListener('didFocus', () => {
    //   let returnValues = this.props.navigation.getParam('returnValues');
    //   console.log(
    //     'returnValues==========================11111111',
    //     returnValues,
    //     returnValues?.sku,
    //   );
    //   if (returnValues?.sku) {
    //     this.getReturnDetailsData();
    //     this.getOrderDetailsData();
    //   } else {
    //     this.getOrderDetailsData();
    //   }
    // });
    this.triggerScreenEvent();
    this.getOrderDetailsData();
    // let returnValues = this.props.navigation.getParam('returnValues');
    // returnValues?.sku
    //   ? (this.getReturnDetailsData(), this.getOrderDetailsData())
    //   : this.getOrderDetailsData();

    // this.getOrderDetailsData();
    // this.getReturnDetailsData();

    // this.getOrderCancelStatus();
    this.getInvoiceDownloadLink();
    // this.getCancelReasons();

    let returnValues = this.props.navigation.getParam('returnValues');
    console.log(
      'returnValues==========================11111111',
      returnValues,
      returnValues?.sku,
    );
    if (returnValues?.sku) {
      this.getReturnDetailsData();
      this.getOrderDetailsData();
    } else {
      this.getOrderDetailsData();
    }

    // if (returnValues?.sku) {
    this.previousReturnList();
    // }
  }

  render() {
    const {
      orderDetailsData,
      orderDetailsLoader,
      orderDetailsError,
      fetchOrderRes,
      isCancelModalVisible,
      orderReturnDetailsData,
    } = this.state;
    const orderPoints = orderDetailsData
      ? orderDetailsData?.OrderDetailsV4?.rewards
      : null;

    const order = orderDetailsData?.OrderDetailsV4;
    const returnValues = this.props.navigation.getParam('returnValues');
    // console.log(
    //   'orderDetailsData==orderDetailsData',
    //   JSON.stringify(order?.packages?.[0]?.items),
    // );
    return (
      <>
        {orderDetailsLoader && <Loader loading={true} transparent={true} />}
        {order ? (
          // <View style={{backgroundColor: '#EBFBFF', flex: 1}}>
          <>
            <HeaderComponent
              navigation={this.props.navigation}
              // label={'#' + order.order_id}
              label={'Track'}
              style={{height: 40}}
            />
            {/* <Loader loading={true} transparent={true} /> */}
            <View
              style={{
                backgroundColor: '#F1F3F6',
                flex: 1,
                paddingHorizontal: 12,
              }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  <FlatList
                    renderItem={this.renderItemOrderedItems}
                    // data={order?.packages?.[0]?.items}
                    data={
                      returnValues?.sku
                        ? orderReturnDetailsData?.items
                        : order?.packages
                    }
                  />
                </View>
                <View
                  style={{backgroundColor: 'white', marginTop: 4, padding: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={{color: 'black', fontSize: 12}}>
                        Order Details
                      </Text>
                      <Text style={{fontSize: 12}}>
                        Ordered ID - {order.order_id}
                      </Text>
                      <Text style={{fontSize: 12}}>
                        Ordered On - {order?.order_date}
                      </Text>
                    </View>
                    {order?.payment_method_code === 'cashondelivery' ? (
                      <>
                        <Image
                          source={require('../../../../../../assets/codTag.png')}
                        />
                      </>
                    ) : null}
                  </View>

                  <View style={{marginTop: 5}}>
                    <Text style={{color: 'black', fontSize: 12}}>
                      Shipping Address
                    </Text>

                    {this.state.orderDetailsData
                      ? // <Text
                        //   allowFontScaling={false}
                        //   style={{
                        //     marginTop: 3,
                        //     paddingBottom: 3,
                        //     width: '50%',
                        //     lineHeight: 15,
                        //   }}>
                        this.addressMapping()
                      : // </Text>
                        null}
                  </View>

                  <View style={{marginTop: 5}}>
                    <Text style={{color: 'black', fontSize: 12}}>
                      Order Total
                    </Text>
                    {order?.order_summary
                      ?.filter(
                        item => item?.label !== 'Grand Total',
                        // &&
                        // item?.label !== 'Discount',
                      )
                      .map(item => (
                        <View style={styles.flexRowSpace}>
                          <Text style={styles.orderTotalText}>
                            {item.label === 'Subtotal'
                              ? 'Sub Total'
                              : item?.label === 'Discount'
                              ? 'Coupon Applied'
                              : item.label}{' '}
                            -{' '}
                          </Text>
                          <Text style={styles.orderTotalText}>
                            Rs {item.value}
                          </Text>
                        </View>
                      ))}

                    {order?.order_summary?.find(
                      item => item.label === 'Grand Total',
                    ) && (
                      <View style={styles.flexRowSpace}>
                        <Text
                          style={[styles.orderTotalText, {color: '#0A8B08'}]}>
                          Grand Total -{' '}
                        </Text>
                        <Text
                          style={[styles.orderTotalText, {color: '#0A8B08'}]}>
                          Rs{' '}
                          {
                            order.order_summary.find(
                              item => item?.label === 'Grand Total',
                            ).value
                          }
                        </Text>
                      </View>
                    )}

                    {/* <Text
                      style={[
                        styles.orderTotalText,
                        {
                          fontWeight: '400',
                          color: '#FF4444',
                          alignSelf: 'flex-end',
                        },
                      ]}>
                      Saved Rs.{' '}
                      {order?.order_summary?.find(
                        item => item?.label === 'Discount',
                      )?.value !== undefined
                        ? order?.order_summary?.find(
                            item => item?.label === 'Discount',
                          )?.value
                        : '0'}
                    </Text> */}
                  </View>

                  <View>
                    {/* <Text
                      allowFontScaling={false}
                      style={{color: 'black', fontSize: 12, marginTop: 12}}>
                      Coins
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                      }}>
                      <View style={styles.flexRowSpace}>
                        <Image
                          source={require('../../../../../../assets/coin.png')}
                        />
                        <View style={{paddingHorizontal: 2}}></View>
                        <Text
                          allowFontScaling={false}
                          style={styles.orderTotalText}>
                          Earned -{' '}
                          {orderDetailsData && orderPoints
                            ? orderPoints.rewardpoints_earned
                            : 0}
                        </Text>
                      </View>

                      <View style={{paddingHorizontal: 6}}></View>

                      <View style={styles.flexRowSpace}>
                        <Image
                          source={require('../../../../../../assets/coin.png')}
                        />
                        <View style={{paddingHorizontal: 2}}></View>
                        <Text
                          allowFontScaling={false}
                          style={styles.orderTotalText}>
                          Spent -{' '}
                          {orderDetailsData && orderPoints
                            ? orderPoints.rewardpoints_used
                            : 0}
                        </Text>
                      </View>
                    </View> */}
                    {/* 
                    {this.state.invoiceLink !== null ? (
                      <TouchableOpacity onPress={() => this.downloadFile()}>
                        <View
                          style={{
                            width: '100%',
                            height: 1,
                            backgroundColor: '#787878',
                            marginTop: 10,
                          }}></View>

                        <View
                          style={{
                            paddingVertical: 6,
                            paddingHorizontal: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              fontWeight: '500',
                            }}>
                            Download Invoice
                          </Text>

                          <Icon
                            name="download"
                            type="AntDesign"
                            style={{fontSize: 20}}
                          />
                        </View>

                        <View
                          style={{
                            width: '100%',
                            height: 1,
                            backgroundColor: '#787878',
                            marginTop: 4,
                          }}></View>
                      </TouchableOpacity>
                    ) : null} */}
                  </View>

                  {/* <View
                    style={{
                      marginTop: 5,
                      paddingVertical: 6,
                      paddingHorizontal: 4,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        fontWeight: '500',
                      }}>
                      Need Help With Your Order
                    </Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                      }}>
                      <Text style={{fontSize: 12, fontWeight: '500'}}>
                        Chat with us
                      </Text>
                      <View style={{paddingHorizontal: 6}}></View>

                      <WhatsApp type={'orderDetailsPage'} />
                    </TouchableOpacity>
                  </View> */}
                </View>

                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <View>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 12, fontWeight: '500'}}>
                        Chat with us
                      </Text>
                      <View style={{paddingHorizontal: 6}}></View>

                      <WhatsApp type={'orderDetailsPage'} />
                    </TouchableOpacity>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '500',
                        // alignSelf: 'flex-end',
                        // marginTop: 5,
                      }}>
                      Reach out to us{' '}
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '500',
                          color: '#00407B',
                        }}
                        onPress={() =>
                          Linking.openURL('mailto:support@dentalkart.com')
                        }>
                        support@dentalkart.com
                      </Text>
                    </Text>
                  </View>
                </View>
                {/* <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '500',
                    alignSelf: 'flex-end',
                    marginTop: 5,
                  }}>
                  Reach out to us{' '}
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '500',
                      color: '#00407B',
                    }}
                    onPress={() =>
                      Linking.openURL('mailto:support@dentalkart.com')
                    }>
                    support@dentalkart.com
                  </Text>
                </Text> */}

                {/* <View style={styles.orderSummarySUbView}>
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.orderAddressText,
                        styles.orderStatusColor,
                      ]}>
                      {order.order_status}
                    </Text>
                    <Text
                      style={[
                        styles.address,
                        {marginTop: 5},
                      ]}>{`Placed on ${order.order_date}`}</Text>
                  </View>
                  {fetchOrderRes?.can_retry_payment && (
                    <View>
                      <RetryOrderComponent
                        retryPaymentData={fetchOrderRes}
                        navigation={this.props.navigation}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.orderAddressView}>
                  <Text
                    allowFontScaling={false}
                    style={styles.orderAddressText}>
                    Shipping Address
                  </Text>
                  {this.state.orderDetailsData ? (
                    <Text
                      allowFontScaling={false}
                      style={{marginTop: 5, paddingBottom: 3}}>
                      {this.addressMapping()}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.orderSummarySUbView}
                  onPress={() => this.allItems()}>
                  <Text>
                    <Text
                      allowFontScaling={false}
                      style={styles.orderAddressText}>{`Items Summary `}</Text>
                    <Text>{`(${this.totalQuantity()} in this order)`}</Text>
                  </Text>
                  <Icon
                    name="right"
                    type="AntDesign"
                    style={{fontSize: 18, right: 10}}
                  />
                </TouchableOpacity>
                {this.state.invoiceLink && (
                  <View style={styles.orderSummarySUbView}>
                    <Text
                      allowFontScaling={false}
                      style={styles.orderAddressText}>{`Invoices`}</Text>

                    <TouchableOpacity
                      onPress={() => this.downloadFile()}
                      style={styles.downloadButton}>
                      <Icon
                        name="download"
                        type="AntDesign"
                        style={{fontSize: 14, right: 5}}
                      />
                      <Text
                        allowFontScaling={false}
                        style={styles.itemCountText}>{`Download`}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <ScrollView showsVerticalScrollIndicator={false}>
                  {this.orderMapping()}
                </ScrollView>
                <View style={[styles.priceDetailView, {}]}>
                  <Text allowFontScaling={false} style={styles.priceDetailText}>
                    Order total
                  </Text>
                </View>
                <View style={styles.billMainView}>
                  {this.state.orderDetailsData
                    ? this.dispItemListMappling()
                    : null}
                </View>
                <View style={styles.rewardsPointsView}>
                  <Text
                    allowFontScaling={false}
                    style={styles.rewardsPointsText}>
                    Rewards points
                  </Text>
                  <View style={styles.earnedView}>
                    <Text
                      allowFontScaling={false}
                      style={{fontSize: 13, marginRight: 18}}>
                      Earned:{' '}
                      {orderDetailsData && orderPoints
                        ? orderPoints.rewardpoints_earned
                        : 0}
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize: 13}}>
                      Used:{' '}
                      {orderDetailsData && orderPoints
                        ? orderPoints.rewardpoints_used
                        : 0}
                    </Text>
                  </View>
                </View> */}
              </ScrollView>

              {fetchOrderRes?.can_refetch && (
                <RefetchOrderFiveTimes
                  getRefetchRes={() => this.getRefetchRes()}
                />
              )}
              <Modal
                isVisible={this.state.isModalVisibal}
                animationInTiming={1000}
                animationOutTiming={1000}
                transparent={true}
                animationIn="fadeIn"
                animationOut="fadeOut"
                // onSwipeComplete={() => this.setState({ isModalVisibal: false })}
                style={{
                  margin: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    minHeight: 130,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    width: '90%',
                    paddingHorizontal: 5,
                    paddingVertical: 8,
                  }}>
                  <View
                    style={{
                      height: 40,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={[styles.trakBtn, {left: 5}]}
                      onPress={() => this.onTrackBtnPress()}>
                      <Text
                        allowFontScaling={false}
                        style={{color: '#fff', fontSize: 14}}>
                        Track
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 35,
                        height: 35,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}
                      onPress={() => this.setState({isModalVisibal: false})}>
                      <Icon
                        name="close"
                        type="AntDesign"
                        style={{fontSize: 23}}
                      />
                    </TouchableOpacity>
                  </View>

                  <ScrollView>
                    <View style={{width: '100%'}}>
                      {this.dispItemListMappling()}
                    </View>
                  </ScrollView>
                </View>
              </Modal>
              <Modal
                isVisible={isCancelModalVisible}
                transparent={true}
                style={styles.cancelOrderModel}>
                <ScrollView style={styles.cancelOrderModelContainer}>
                  <View style={styles.cancelOrderModelHeading}>
                    <Text allowFontScaling={false} style={styles.modalTitle}>
                      Cancel order
                    </Text>
                    <Text allowFontScaling={false} style={styles.modalSubTitle}>
                      Sure you want to cancel the order?
                    </Text>
                  </View>
                  <View>
                    <FlatList
                      data={this.state.cancelReasons}
                      keyExtractor={(item, index) =>
                        'reason-' + index.toString()
                      }
                      renderItem={this.renderItem}
                    />
                  </View>
                  <View style={styles.modalButtonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.cancelBtn,
                        {backgroundColor: colors.orangeBtn},
                      ]}
                      onPress={() =>
                        this.setState({isCancelModalVisible: false})
                      }>
                      <Text allowFontScaling={false} style={styles.yesNoText}>
                        No
                      </Text>
                    </TouchableOpacity>
                    {this.cancelButton(order?.order_id)}
                  </View>
                </ScrollView>
              </Modal>
            </View>
          </>
        ) : (
          <>
            <Loader loading={true} transparent={true} />
          </>
        )}

        {/* {order && (
          <View>
            <Text>hello</Text>
          </View>
        )} */}

        {orderDetailsError && (
          <Text allowFontScaling={false}>
            Something went wrong please try agin later.
          </Text>
        )}
      </>
    );
  }
}
