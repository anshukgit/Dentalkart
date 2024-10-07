import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TouchableHighlight,
  ToastAndroid,
  ScrollView,
  Linking,
  Dimensions,
  Platform,
  Modal,
  SafeAreaView,
} from 'react-native';
import Loader from '@components/loader';
import {GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY} from '../../graphql';
import Timeline from 'react-native-timeline-flatlist';
import {Icon} from 'native-base';
import Header from '@components/header';
import styles from './track_details.style';
import {AirbnbRating} from 'react-native-ratings';
import {newclient, client} from '@apolloClient';
import {NavigationActions} from 'react-navigation';
import {TRACK_BY_TRACK_NUMBER_QUERY} from '../../graphql';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import GET_ALL_INVOICE_LINK from '../../graphql/get_all_invoice_link.gql';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class Tracking extends Component {
  constructor(props) {
    super(props);
    const fetchData = null;
    this.state = {
      date: 'Dec 29, 2020',
      rating: 0,
      trackingNo: 781797056843,
      tracking: [],
      TrackingData: null,
      transDetails: '',
      orderDetailsLoader: false,
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
      showTrackingInfo: false,
      allItemsModal: false,
    };
  }
  getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
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
        const {OrderDetailsV4} = data;
        this.setState({
          TrackingData: OrderDetailsV4,
          orderDetailsLoader: false,
        }); //, orderDetailsLoader: false });
      }
      console.warn(
        'result Data...................data',
        this.state.TrackingData,
      );
    } catch (e) {
      console.log('rderError', e);
      this.setState({orderDetailsLoader: false});
      //   this.setState({ orderDetailsError: true })
      showErrorMessage(e.message);
    }
  };
  // All inovice link=========================
  getInvoiceDetailsData = async () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');
    const trakingData = navigation.getParam('data');
    try {
      const {data} = await newclient.query({
        query: GET_ALL_INVOICE_LINK,
        fetchPolicy: 'network-only',
        variables: {order_id: orderId, awb_number: trakingData.tracking_number},
      });
      if (data) {
        this.setState({invoiceData: data.shipmentInvoice.pdf_link});
      }
    } catch (e) {
      console.log('rderError', e);
      //   this.setState({ orderDetailsLoader: false })
      //   this.setState({ orderDetailsError: true })
      showErrorMessage(e.message);
    }
  };

  // invoice Download======================================
  downloadFile = () => {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId', 'No-ID');
    const trakingData = navigation.getParam('data');
    const {fs, android, ios} = RNFetchBlob;
    // File URL which we want to download
    let FILE_URL = this.state.invoiceData;

    // Function to get extention of the file url
    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];
    const downloadPath = `${
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir
    }/invoice_${orderId}_${trakingData.tracking_number}${file_ext}`;
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
              title: `invoice_${orderId}_${trakingData.tracking_number}${file_ext}`,
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

  async componentDidMount() {
    const {navigation} = this.props;
    const data = navigation.getParam('data');

    //return tracking data===================//

    const returnData = navigation.getParam('returnData');

    this.getOrderDetailsData();
    if (data.tracking_number) {
      this.getInvoiceDetailsData();
    }

    const prvPage = navigation.getParam('prvPage');
    const orderid = navigation.getParam('orderId');

    if (prvPage == 'orderList') {
      console.warn('yes');
      this.getOrderDetailsData();
    } else {
      var trackeArr = data?.status_history;
      var trackeReturnArr = returnData?.status_history;

      var ind = trackeArr?.findIndex(e => e.current === true);
      var trackInd = trackeReturnArr?.findIndex(e => e.current === true);
      // for (var i = 0; i < trackeArr.length; i++) {
      //   if (trackeArr[i].current == true) {
      //     ind = i;
      //     break;
      //   }
      // }

      if (trackeArr && returnData === undefined) {
        trackeArr.map((val, index) => {
          val.title = val.status;
          val.description = val.date
            ? '- ' + val.status + ' on ' + val.date
            : '';
          val.isProcess = index <= ind && ind != -1 ? true : false;
          var lineFlg = index < ind && ind != -1 ? true : false;
          // val.lineColor = lineFlg ? colors.orangeBtn : '#C6D2DE';
          val.lineColor = lineFlg ? '#0286FF' : '#767676';
          val.circleColor = val.isProcess ? colors.orangeBtn : '#2B3E56';
          val.innerCircle = 'dot';
          val.showReturn =
            val.status === 'Delivered' && data.status === val.status
              ? true
              : false;
          val.showTracking =
            data.tracking_url && data.status === val.status ? true : false;
          console.log('val.status === ', val.status);
          let iconConfirm = require(`../../../../../../assets/orderConfirmedActive.png`);
          let iconInTransitActive = require(`../../../../../../assets/inTransitActive.png`);
          let iconshippedActive = require(`../../../../../../assets/shippedActive.png`);
          let icondeliveredActive = require(`../../../../../../assets/deliveredActive.png`);
          let iconatWarehouseActive = require(`../../../../../../assets/atWarehouseActive.png`);

          let iconInActiveInTransitActive = require(`../../../../../../assets/inTransInActive.png`);
          let iconInActiveShippedActive = require(`../../../../../../assets/shippedInActive.png`);
          let iconInActiveDeliveredActive = require(`../../../../../../assets/deliveredInActive.png`);
          let iconInActiveAtWarehouseActive = require(`../../../../../../assets/atWarehouseInActive.png`);

          if (val.isProcess && index == ind) {
            val.icon = (
              // <Image
              //   source={require('../../../../../../assets/deliveredActive.png')}
              // />

              <Image
                source={
                  val.status === 'Order Confirmed'
                    ? iconConfirm
                    : val.status === 'Processing'
                    ? iconInTransitActive
                    : val.status === 'Packed'
                    ? iconatWarehouseActive
                    : val.status === 'Shipped'
                    ? iconshippedActive
                    : val.status === 'Delivered'
                    ? icondeliveredActive
                    : null
                }
              />
              // <Icon
              //   name={'circle-o'}
              //   type={'FontAwesome'}
              //   style={{fontSize: 15, color: '#fff'}}
              // />
            );
          } else if (val.isProcess && index <= ind) {
            val.icon = (
              <Image
                source={
                  val.status === 'Order Confirmed'
                    ? iconConfirm
                    : val.status === 'Processing'
                    ? iconInTransitActive
                    : val.status === 'Packed'
                    ? iconatWarehouseActive
                    : val.status === 'Shipped'
                    ? iconshippedActive
                    : val.status === 'Delivered'
                    ? icondeliveredActive
                    : null
                }
              />

              // <Icon
              //   name={'check'}
              //   type={'FontAwesome5'}
              //   style={{fontSize: 11, color: '#fff'}}
              // />
            );
          } else {
            val.icon = (
              <Image
                source={
                  val.status === 'Order Confirmed'
                    ? iconConfirm
                    : val.status === 'Processing'
                    ? iconInActiveInTransitActive
                    : val.status === 'Packed'
                    ? iconInActiveShippedActive
                    : val.status === 'Shipped'
                    ? iconInActiveAtWarehouseActive
                    : val.status === 'Delivered'
                    ? iconInActiveDeliveredActive
                    : null
                }
              />
            );
          }
        });
        this.setState({tracking: trackeArr});
      } else {
        trackeReturnArr.map((val, index) => {
          val.title = val.label;
          val.description = val.created_at
            ? '- ' + val.label + ' on ' + val.created_at.substr(0, 10)
            : '';
          val.isProcess = index <= trackInd && trackInd != -1 ? true : false;
          var lineFlg = index < trackInd && trackInd != -1 ? true : false;
          // val.lineColor = lineFlg ? colors.orangeBtn : '#C6D2DE';
          val.lineColor = lineFlg ? '#0286FF' : '#767676';
          val.circleColor = val.isProcess ? colors.orangeBtn : '#2B3E56';
          val.innerCircle = 'dot';
          val.showReturn =
            val.status === 'Delivered' && data.status === val.status
              ? true
              : false;
          val.showTracking =
            data.tracking_url && data.status === val.status ? true : false;
          console.log('val.status === !!===new', val.status);

          // orange==================///

          let requestRaisedOrange = require(`../../../../../../assets/activeCancel/Request-raised.png`);
          let requestApprovedOrange = require(`../../../../../../assets/activeCancel/request-approved.png`);
          let shippedOrange = require(`../../../../../../assets/activeCancel/shippedOrange.png`);
          let moneyOrange = require(`../../../../../../assets/activeCancel/moneyOrange.png`);

          //===============Active==============//
          let requestRaisedActive = require(`../../../../../../assets/activeCancel/requestRaised.png`);
          let requestApprovedActive = require(`../../../../../../assets/activeCancel/requestApproved.png`);
          let pickUpCompleteActive = require(`../../../../../../assets/activeCancel/pickUpComplete.png`);
          let repairedActive = require(`../../../../../../assets/activeCancel/repairedActive.png`);
          let deliveredActive = require(`../../../../../../assets/activeCancel/deliveredActive.png`);

          //=============InActive========//
          let inActiveRequestApproved = require(`../../../../../../assets/activeCancel/inActiveRequestApproved.png`);
          let inActiveRequestRaised = require(`../../../../../../assets/activeCancel/Request-raised--deactivated.png`);
          let inActiveMoney = require(`../../../../../../assets/activeCancel/inActiveMoney.png`);
          let inActiveShipped = require(`../../../../../../assets/activeCancel/shippedInActive.png`);
          let inActivedelivered = require(`../../../../../../assets/activeCancel/deliveredInActive.png`);

          if (val.isProcess && index == trackInd) {
            val.icon = (
              // <Image
              //   source={require('../../../../../../assets/deliveredActive.png')}
              // />

              <Image
                style={[
                  val.status === 'request_raised' && {
                    width: 20,
                    height: 20,
                  },
                  val.status === 'under_inspection' && {
                    width: 20,
                    height: 20,
                  },
                  val.status === 'refund_initiated' && {
                    width: 20,
                    height: 20,
                  },
                  val.status === 'refund_done' && {
                    width: 20,
                    height: 20,
                  },
                ]}
                source={
                  val.status === 'request_raised'
                    ? requestRaisedOrange
                    : val.status === 'approved'
                    ? requestApprovedOrange
                    : val.status === 'pick_up_failed'
                    ? shippedOrange
                    : val.status === 'pick_up_complete'
                    ? shippedOrange
                    : val.status === 'under_inspection'
                    ? requestApprovedOrange
                    : val.status === 'replaced'
                    ? requestApprovedOrange
                    : val.status === 'refund_initiated'
                    ? moneyOrange
                    : val.status === 'repair'
                    ? moneyOrange
                    : val.status === 'refund_done'
                    ? moneyOrange
                    : val.status === 'delivered'
                    ? deliveredActive
                    : null
                }
              />
              // <Icon
              //   name={'circle-o'}
              //   type={'FontAwesome'}
              //   style={{fontSize: 15, color: '#fff'}}
              // />
            );
          } else if (val.isProcess && index < trackInd) {
            val.icon = (
              <Image
                source={
                  val.status === 'request_raised'
                    ? requestRaisedActive
                    : val.status === 'approved'
                    ? requestApprovedActive
                    : val.status === 'pick_up_complete'
                    ? pickUpCompleteActive
                    : val.status === 'under_inspection'
                    ? requestApprovedActive
                    : val.status === 'replaced'
                    ? repairedActive
                    : val.status === 'refund_initiated'
                    ? repairedActive
                    : val.status === 'repair'
                    ? repairedActive
                    : val.status === 'refund_done'
                    ? repairedActive
                    : val.status === 'delivered'
                    ? deliveredActive
                    : null
                }
              />

              // <Icon
              //   name={'check'}
              //   type={'FontAwesome5'}
              //   style={{fontSize: 11, color: '#fff'}}
              // />
            );
          } else {
            val.icon = (
              <Image
                source={
                  val.status === 'request_raised'
                    ? inActiveRequestRaised
                    : val.status === 'approved'
                    ? inActiveRequestApproved
                    : val.status === 'pick_up_complete'
                    ? inActiveShipped
                    : val.status === 'under_inspection'
                    ? inActiveRequestApproved
                    : val.status === 'replaced'
                    ? inActiveMoney
                    : val.status === 'refund_initiated'
                    ? inActiveMoney
                    : val.status === 'repair'
                    ? inActiveMoney
                    : val.status === 'refund_done'
                    ? inActivedelivered
                    : val.status === 'delivered'
                    ? inActivedelivered
                    : null
                }
              />
            );
          }
        });
        //loop
        this.setState({tracking: trackeReturnArr});
      }

      var tracknum = data.tracking_number;
      console.log('data=============mahesh', data);
      var transpotnum = data.transporter;
      if (tracknum) {
        try {
          const {data, loading, error} = await newclient.query({
            query: TRACK_BY_TRACK_NUMBER_QUERY,
            fetchPolicy: 'network-only',
            variables: {
              order_id: orderid,
              track_number: tracknum,
              courier: transpotnum,
            },
          });
          this.setState({transDetails: data});
          // if (data && data.fetchOrder && data.fetchOrder.order_id) {
          //     this.setState({ fetchOrderRes: data.fetchOrder })
          //     console.log('refetchQuery', data.fetchOrder)
          // }
        } catch (e) {
          console.warn('error  : ', e);
          showErrorMessage(e.message);
        }
      }
    }
  }

  ratingCompleted(rating) {
    this.setState({rating: rating});
    Linking.openURL(
      Platform.OS == 'android'
        ? 'https://play.google.com/store/apps/details?id=com.vasadental.dentalkart'
        : 'https://apps.apple.com/app/dentalkart/id1382207992?ls=1',
    );
  }
  onItemPrice(data) {
    let price = data.price * data.qty_ordered;

    price = price.toFixed(2);
    return (
      <Text allowFontScaling={false} style={styles.qtyTextCount}>
        {' '}
        {price}
      </Text>
    );
  }
  renderCircle(rowData, sectionID, rowID) {
    console.warn('row data infor : ', rowData);
    return (
      <View
        style={{
          width: 15,
          height: 15,
          borderRadius: 15,
          backgroundColor: rowData.isProcess ? colors.orangeBtn : 'grey',
          left: -((windowWidth * 68.5) / 100),
        }}
      />
    );
  }
  renderCircle1(rowData, sectionID, rowID) {
    console.warn('row data infor : ', rowData);
    return (
      <View
        style={{
          width: 15,
          height: 100,
          borderRadius: 15,
          backgroundColor: rowData.isProcess ? colors.orangeBtn : 'grey',
        }}
      />
    );
  }

  cartItemMapping() {
    const {navigation} = this.props;
    const TrackingData = navigation.getParam('data');
    const trakingItems = TrackingData ? TrackingData.items : [];

    if (trakingItems.length > 0) {
      return trakingItems.slice(0, 3).map((data, index) => {
        // console.log('trakingItems==trakingItems', data);
        return (
          // <View style={[styles.cartItemMappingMainView]}>
          //   <View style={styles.cartItemImg}>
          //     <Image
          //       source={{uri: data.image}}
          //       style={{width: '100%', height: '100%'}}
          //       resizeMode={'contain'}
          //     />
          //   </View>
          //   <View style={styles.mappingDetailView}>
          //     <Text allowFontScaling={false} style={styles.prodctName}>
          //       {data.name}
          //     </Text>
          //     <View
          //       style={{
          //         width: '85%',
          //         height: 20,
          //         flexDirection: 'row',
          //         justifyContent: 'space-between',
          //       }}>
          //       <View style={{flexDirection: 'row'}}>
          //         <Text
          //           allowFontScaling={false}
          //           style={[styles.qtyText, {width: '52.5%'}]}>
          //           Quantity:
          //         </Text>
          //         <Text allowFontScaling={false} style={[styles.qtyTextCount]}>
          //           {data.qty_ordered}
          //         </Text>
          //       </View>
          //       <Text allowFontScaling={false}>
          //         <Text allowFontScaling={false} style={styles.qtyText}>
          //           Unit Price :{' '}
          //         </Text>
          //         <Icon
          //           name="rupee"
          //           type="FontAwesome"
          //           style={{fontSize: 11, color: colors.black}}
          //         />
          //         {/* <Text allowFontScaling={false} style={styles.qtyTextCount}></Text> */}
          //         {data.price}
          //       </Text>
          //     </View>
          //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
          //       <Text
          //         allowFontScaling={false}
          //         style={[styles.qtyText, {width: '26.5%'}]}>
          //         Total price:
          //       </Text>
          //       <Icon
          //         name="rupee"
          //         type="FontAwesome"
          //         style={{fontSize: 10, color: colors.black}}
          //       />
          //       <Text allowFontScaling={false} style={styles.qtyTextCount}>
          //         {' '}
          //         {this.onItemPrice(data)}
          //       </Text>
          //     </View>
          //     {data?.rewards && (
          //       <View
          //         style={{
          //           flexDirection: 'row',
          //           alignItems: 'center',
          //           height: 22,
          //         }}>
          //         <Text
          //           allowFontScaling={false}
          //           style={[styles.qtyText, {width: '26.5%'}]}>
          //           Rewards:
          //         </Text>
          //         <Text allowFontScaling={false} style={styles.qtyTextCount}>
          //           {data.rewards}
          //         </Text>
          //       </View>
          //     )}
          //   </View>
          // </View>
          <TouchableOpacity
            onPress={() => this.setState({allItemsModal: true})}
            style={{
              backgroundColor: 'white',
              borderWidth: 0.3,
              marginLeft: 5,
              padding: 6,
              borderRadius: 5,
              borderColor: 'grey',
              justifyContent: 'center',
            }}>
            <Image style={{width: 30, height: 30}} source={{uri: data.image}} />
          </TouchableOpacity>
        );
      });
    }
  }

  //  trakingItems.map(item => (
  //               <TouchableOpacity
  //                 // onPress={() => this.setState({allItemsModal: true})}
  //                 style={{
  //                   borderWidth: 0.3,
  //                   marginLeft: 5,
  //                   padding: 6,
  //                   borderRadius: 5,
  //                   borderColor: 'grey',
  //                   justifyContent: 'center',
  //                 }}>
  //                 <Image
  //                   style={{width: 30, height: 30}}
  //                   source={{uri: item.thumbnail}}
  //                 />
  //               </TouchableOpacity>
  //             ))}

  renderDetail = (rowData, sectionID, rowID) => {
    return (
      <View style={{top: -10, width: '100%'}}>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <View>
            <Text style={{fontSize: 12.5, color: colors.black}}>
              {rowData.title}
            </Text>
          </View>
          <Text style={{color: 'gray', fontSize: 10}}>
            {/* {rowData.description} */}
          </Text>
        </View>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
            rowData.showTracking && {
              alignSelf: 'flex-start',
              marginTop: '2%',
              marginBottom: '2%',
            },
          ]}>
          {rowData.showTracking && (
            <TouchableOpacity
              style={[styles.trakBtn]}
              onPress={() =>
                this.setState({
                  showTrackingInfo: true,
                })
              }>
              <Text
                allowFontScaling={false}
                style={{color: '#fff', fontSize: 14}}>
                Track your order
              </Text>
            </TouchableOpacity>
          )}

          {/* {rowData.showReturn && (
            <TouchableOpacity
              style={[styles.trakBtn, styles.returnBtn]}
              onPress={() =>
                this.props.navigation.navigate('OrderReturnSection', {
                  orderId: this.props.navigation.getParam('orderId'),
                })
              }>
              <Text
                allowFontScaling={false}
                style={{color: '#fff', fontSize: 14}}>
                Return
              </Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    );
  };

  showWebViewModal = () => (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      deviceWidth={1}
      deviceHeight={1}
      isVisible={this.state.showTrackingInfo}>
      <SafeAreaView style={{flex: 1}}>
        {console.log(
          'this.state.TrackingData.tracking_url===========',
          this.state.TrackingData?.packages?.[0]?.tracking_url,
        )}
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showTrackingInfo: false,
              });
            }}
            style={styles.header}>
            <Ionicons name="ios-close-circle-outline" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <WebView
            source={{
              uri: this.state.TrackingData?.packages?.[0]?.tracking_url,
            }}
            startInLoadingState={true}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  render() {
    const {navigation} = this.props;
    const orderId = navigation.getParam('orderId');
    let data = navigation.getParam('data');
    let returnData = navigation.getParam('returnData');
    let previousReturnHistory = navigation.getParam('previousReturnHistory');
    const trakingItems = data ? data.items : [];

    return (
      <>
        {this.state.orderDetailsLoader && (
          <Loader loading={true} transparent={true} />
        )}
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Track'}
          style={{height: 40}}
        />
        <View style={{backgroundColor: '#F1F3F6', flex: 1, marginTop: 5}}>
          <ScrollView
            ref={ref => (this.myScroll = ref)}
            style={{
              width: '100%',
              height: Dimensions.get('window').height - 80,
              // borderColor: 'red',
            }}>
            <View style={{width: '100%', marginTop: 10}}>
              {this.state.TrackingData && !data?.showOnlyItems ? (
                <View
                  style={{
                    height: 40,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                  }}>
                  <Text style={{fontSize: 12, fontWeight: '500'}}>
                    {`${
                      returnData === undefined ? 'Order ID - ' : 'Return ID - '
                    }`}
                    {returnData === undefined ? orderId : returnData?.return_id}
                  </Text>
                  {returnData !== undefined ? (
                    <Text style={{fontSize: 12, fontWeight: '500'}}>
                      {`${returnData !== undefined && 'Requested On - '}`}
                      {returnData !== undefined &&
                        returnData?.request_at_date?.substr(0, 10)}{' '}
                      | Reason - {returnData?.reason}
                    </Text>
                  ) : data?.delivereddate ? (
                    <Text style={{fontSize: 12, fontWeight: '500'}}>
                      Delivered On {data?.delivereddate}
                    </Text>
                  ) : null}

                  {/* {this.state.TrackingData.tracking_number == null ? (
                    <Text
                      allowFontScaling={false}
                      style={{fontSize: 12, fontWeight: '500'}}>
                      Status: {this.state.TrackingData.status}
                    </Text>
                  ) : (
                    <Text allowFontScaling={false} style={{fontSize: 12}}>
                      Tracking No: {this.state.TrackingData.tracking_number}
                    </Text>
                  )} */}
                </View>
              ) : null}

              {this.state.tracking.length > 0 ? (
                <View
                  style={{
                    // height: this.state.tracking.length * 65,
                    paddingHorizontal: 20,
                    backgroundColor: '#fff',
                    // marginBottom: 5,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      // height: this.state.tracking.length * 65,
                    }}>
                    <Timeline
                      data={this.state.tracking}
                      circleSize={18}
                      innerCircle={'icon'}
                      iconStyle={{width: '50%'}}
                      circleColor={colors.orangeBtn}
                      lineColor={colors.orangeBtn}
                      listViewStyle={{}}
                      timeContainerStyle={{minWidth: 0}}
                      options={{
                        style: {paddingTop: 5},
                        showsVerticalScrollIndicator: false,
                      }}
                      renderDetail={this.renderDetail}
                    />

                    {/* {returnData === undefined ? (
                      <>
                        {this.state.TrackingData ? (
                          this.state.TrackingData.tracking_number &&
                          this.state.TrackingData.delivereddate ? (
                            <Text
                              allowFontScaling={false}
                              style={{
                                fontSize: 11,
                                left: -10,
                                textAlign: 'center',
                                top: -10,
                              }}>
                              {' '}
                              <Text allowFontScaling={false}>
                                Expected date of Delivery -{' '}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={{color: colors.blueColor}}>
                                {this.state.TrackingData.delivereddate}
                              </Text>
                            </Text>
                          ) : null
                        ) : null}
                      </>
                    ) : null} */}
                  </View>
                  {/* this.state.TrackingData && this.state.transDetails ? (
                  this.state.TrackingData.tracking_number ? (
                    <TouchableOpacity
                      style={{
                        top: 8,
                        alignItems: 'flex-end',
                        position: 'absolute',
                        right: 15,
                      }}
                      onPress={() => {
                        console.warn('ontrasit btn click');
                        this.props.navigation.navigate('transitDetails', {
                          orderId: orderId,
                          transDetails: this.state.transDetails,
                        });
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{fontSize: 12, color: colors.blueColor}}>
                        Transit details
                      </Text>
                    </TouchableOpacity>
                  ) : null
                ) : null */}
                </View>
              ) : null}

              {this.state.invoiceData != null || undefined ? (
                <TouchableOpacity
                  style={styles.downloadFileView}
                  onPress={() => this.downloadFile()}>
                  <Icon
                    name="download"
                    type="AntDesign"
                    style={styles.antDesignView}
                  />
                  <Text style={styles.downloadView}>Download Invoice</Text>
                </TouchableOpacity>
              ) : null}

              {/* <View style={styles.itemsinOrderView}>
                <Text allowFontScaling={false} style={styles.itemsinOrderTxt}>
                  Items in this order
                </Text>
              </View> */}

              {returnData?.status === 'rejected' ? (
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 20,
                    paddingTop: 6,
                    flex: 1,
                  }}>
                  <Text style={{color: 'red', fontSize: 12}}>
                    Request Has Been Rejected For {returnData?.qty} Products
                  </Text>

                  <View
                    style={{
                      marginTop: 10,
                      flex: 1,
                      flexDirection: 'row',
                      // justifyContent: 'space,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 12,
                          color: 'black',
                        }}>
                        Product
                      </Text>
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderWidth: 0.5,
                          padding: 10,
                          paddingHorizontal: 10,
                          borderRadius: 5,
                          borderColor: 'grey',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Image
                          style={{width: 40, height: 40}}
                          source={{
                            uri:
                              'https://images.dentalkart.com/media/catalog/product' +
                              returnData.image,
                          }}
                        />
                      </View>
                    </View>

                    <View style={{marginLeft: '8%'}}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 12,
                          color: 'black',
                        }}>
                        Reason
                      </Text>
                      <View
                        style={{
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <Text style={{fontSize: 12}}>{returnData?.reason}</Text>
                      </View>
                    </View>
                    {console.log('returnData======returnData===', returnData)}
                    <View style={{marginLeft: '8%', flex: 1}}>
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 12,
                          color: 'black',
                        }}>
                        Remark
                      </Text>
                      <View style={{justifyContent: 'center', flex: 1}}>
                        <Text>
                          {returnData.remarks[returnData.remarks.length - 1]}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={{fontSize: 12, marginTop: 5}}>
                    {returnData?.name}
                  </Text>
                </View>
              ) : null}
              {this.state.TrackingData ? (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    padding: 10,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    let data = navigation.getParam('data');
                    data?.scroll &&
                      this.myScroll.scrollTo({
                        x: 0,
                        y: layout.y,
                        animated: true,
                      });
                  }}>
                  {returnData === undefined ? (
                    <>
                      {this.cartItemMapping()}

                      {trakingItems.length > 3 && (
                        <TouchableOpacity
                          onPress={() => this.setState({allItemsModal: true})}
                          style={{
                            borderWidth: 0.3,
                            marginLeft: 5,
                            padding: 10,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            borderColor: 'grey',
                            justifyContent: 'center',
                          }}>
                          <Text>+{trakingItems.length - 3}</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : null}
                </View>
              ) : null}

              {previousReturnHistory?.length > 0 ? (
                <Text
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    fontSize: 12,
                    fontWeight: '500',
                    color: 'black',
                    paddingBottom: 10,
                  }}>
                  Previous Return History
                </Text>
              ) : null}

              {previousReturnHistory?.length > 0
                ? previousReturnHistory?.map(item => (
                    <View style={{marginBottom: 10}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          backgroundColor: 'rgba(203, 230, 255, 0.3)',
                          padding: 10,
                        }}>
                        <View>
                          <Text style={styles.prevHis}>
                            {moment
                              .utc(item.created_at)
                              .format('YYYY-MM-DD, HH:mm')}
                          </Text>
                          <Text style={styles.prevHisSub}>
                            Return ID - {item?.return_id}
                          </Text>
                          <Text style={styles.prevHisSub}>
                            Order ID - {item?.order_id}
                          </Text>
                          <Text style={styles.prevHisSub}>
                            Total Item - {item?.qty}
                          </Text>

                          <View
                            style={{
                              width: 26,
                              height: 26,
                              borderWidth: 0.5,
                              borderRadius: 2,
                              marginTop: 5,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                width: 18,
                                height: 18,
                              }}
                              source={{
                                uri:
                                  'https://images.dentalkart.com/media/catalog/product' +
                                  item?.image,
                              }}
                            />
                          </View>
                        </View>

                        <View>
                          <TouchableOpacity
                            // onPress={() =>
                            //   navigation.navigate('OrderDetails', {
                            //     orderId: item.increment_id,
                            //     can_cancel: item.can_cancel,
                            //   })
                            // }
                            onPress={() =>
                              this.props.navigation.navigate('OrderDetails', {
                                orderId: item?.order_id,
                                returnValues: {
                                  sku: item?.sku,
                                  returnID: item?.return_id,
                                },
                              })
                            }
                            style={{
                              borderRadius: 2,
                              borderWidth: 0.5,
                              borderColor: '#0286FF',
                              backgroundColor: 'rgba(203, 230, 255, 0.47)',
                              paddingHorizontal: 18,
                              paddingVertical: 2,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#00407B',
                                fontSize: 14,
                                fontWeight: '600',
                              }}>
                              Track
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                : null}

              {returnData?.status !== 'rejected' ? (
                <>
                  <View style={{padding: 10, backgroundColor: 'white'}}>
                    <Text style={{fontSize: 12}}>
                      Courier{' '}
                      <Text style={{fontSize: 12, fontWeight: '600'}}>
                        {data?.transporter
                          ? data?.transporter
                          : returnData?.courier}
                      </Text>
                    </Text>

                    <Text style={{fontSize: 12}}>
                      Tracking ID{' '}
                      <Text style={{fontSize: 12, fontWeight: '600'}}>
                        {data?.tracking_number
                          ? data?.tracking_number
                          : returnData?.tracking_id}
                      </Text>
                    </Text>
                  </View>

                  {/* <View style={{padding: 10, backgroundColor: 'white'}}>
                    <Text
                      style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                      History
                    </Text>
                    {this.state.tracking
                      .filter(data => data.description !== '')
                      .map(item => (
                        <View style={{padding: 10}}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '600',
                              color: item?.title.includes('Requested')
                                ? '#FF0505'
                                : '#2B5F2B',
                            }}>
                            {item.title}
                          </Text>
                          <Text style={{fontSize: 12, fontWeight: '600'}}>
                            {item.description}
                          </Text>
                          <Text style={{fontSize: 12, fontWeight: '600'}}>
                            {item.date}
                          </Text>
                        </View>
                      ))}
                  </View> */}
                </>
              ) : null}

              {/* <View
                style={{
                  width: '100%',
                  height: 70,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.white,
                  paddingHorizontal: 20,
                }}>
                <View
                  style={{
                    width: '60%',
                    height: '100%',
                    justifyContent: 'space-around',
                    paddingVertical: 15,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{color: colors.black, fontSize: 14}}>
                    Don’t forget to rate
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{color: colors.productHeaderText, fontSize: 12}}>
                    Give your opinion about our app
                  </Text>
                </View>
                <View
                  style={{
                    width: '40%',
                    justifyContent: 'flex-start',
                    right: 20,
                  }}>
                  <AirbnbRating
                    count={5}
                    defaultRating={this.state.rating}
                    size={18}
                    showRating={false}
                    onFinishRating={rating => this.ratingCompleted(rating)}
                    style={{}}
                  />
                </View>
              </View> */}
            </View>
          </ScrollView>
          {this.state.showTrackingInfo && this.showWebViewModal()}
        </View>

        <Modal visible={this.state.allItemsModal} transparent>
          {/* <Modal visible={false} transparent> */}
          <View
            style={{
              backgroundColor: '#6B7186BF',
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                marginTop: '40%',
                padding: 10,
                // justifyContent: 'flex-end',
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                  All Items
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({allItemsModal: false})}
                  // onPress={() => this.setState({cancelOrderModal: false})}
                  style={{
                    alignSelf: 'flex-end',
                    paddingHorizontal: 18,
                  }}>
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../../../../../../assets/close.png')}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <FlatList
                  style={{marginBottom: 30}}
                  data={trakingItems}
                  renderItem={({item: renderItems}) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                          // alignItems: 'center',
                        }}>
                        <View
                          style={{
                            borderRadius: 4,
                            borderWidth: 0.5,
                            borderColor: 'grey',
                            padding: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            style={{width: 40, height: 40}}
                            source={{
                              uri: renderItems.image,
                            }}
                          />
                        </View>

                        <View style={{paddingHorizontal: 6}}></View>

                        <View style={{flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: '500',
                                color: 'black',
                                width: '50%',
                              }}>
                              {renderItems.name}
                            </Text>
                            {/* {renderItems.can_return ? (
                              // {true ? (
                              <TouchableOpacity disabled={true}>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontWeight: '400',
                                    color: '#00407B',
                                  }}>
                                  Return
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity disabled={true}>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontWeight: '400',
                                    color: '#00407B',
                                  }}>
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                            )} */}
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontSize: 11,
                                color: 'black',
                              }}>
                              Quantity : {renderItems.qty_ordered}
                            </Text>

                            <Text
                              style={{
                                fontSize: 11,
                                color: 'black',
                              }}>
                              Order Amount - Rs {renderItems.price}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                fontSize: 11,
                                color:
                                  renderItems.status === 'Cancelled'
                                    ? '#F85100'
                                    : '#2B5F2B',
                              }}>
                              {renderItems.status}
                            </Text>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <Image
                                style={{width: 14, height: 14}}
                                source={require('../../../../../../assets/coin.png')}
                              />
                              <View style={{paddingHorizontal: 2}}></View>
                              {console.log(
                                'renderItems================',
                                renderItems,
                              )}
                              <Text
                                style={{
                                  fontSize: 11,
                                  color: 'black',
                                }}>
                                Earned Coins - {renderItems?.rewardpoints}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}
