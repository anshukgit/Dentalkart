import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import styles from './order_card.style';
import {Dropdown} from 'react-native-element-dropdown';
import {showErrorMessage} from '@helpers/show_messages';
import {
  CANCEL_ORDER,
  GET_CANCELABLE_ORDER,
  GET_CANCEL_REASONS,
  GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY,
} from '../../graphql';
import {newclient} from '@apolloClient';
import {client} from '../../../../../../apollo_client';
import {showSuccessMessage} from '../../../../../../helpers/show_messages';
import AnalyticsEvents from '../../../../../../components/Analytics/AnalyticsEvents';
import {NavigationActions, StackActions} from 'react-navigation';
import Loader from '@components/loader';
import {addToCart} from '@screens/cart';
import {DentalkartContext} from '@dentalkartContext';
import {FETCH_ORDER_DETAILS_QUERY} from '../../../../../payment/graphql';
import {RetryPaymentButton} from '../../../../../payment/retryWithRazorpayPopUp';

export default class OrderCard extends Component {
  static contextType = DentalkartContext;
  constructor() {
    super();
    this.state = {
      buyAgainDrop: false,
      cancelOrderModal: false,
      cancelReasons: [],
      allItemsModal: false,
      orderDetailsData: null,
      selectedReasonId: null,
      loading: false,
      isFullCancel: null,
      dropDownloading: false,
      fetchOrderRes: '',
    };
  }

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

  getOrderDetailsData = async () => {
    try {
      const {data} = await newclient.query({
        query: GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY,
        fetchPolicy: 'network-only',
        variables: {order_id: this.props.item?.increment_id},
      });
      if (data && data.OrderDetailsV4) {
        if (data?.OrderDetailsV4?.order_status === 'Payment Pending') {
          this.getRefetchRes();
        }
        this.setState({orderDetailsData: data.OrderDetailsV4});
      }
    } catch (e) {
      this.setState({loading: false});
      this.setState({orderDetailsError: true});
      showErrorMessage(e.message);
    }
  };

  getOrderCancelStatus = async () => {
    try {
      this.setState({dropDownloading: true});
      const {data} = await newclient.query({
        query: GET_CANCELABLE_ORDER,
        fetchPolicy: 'network-only',
        variables: {orderId: this.props.item?.increment_id},
      });

      if (data && data.getCancelableOrder) {
        this.setState({
          isFullCancel: data?.getCancelableOrder?.order?.isFullCancel,
          dropDownloading: false,
        });
      }
    } catch (e) {
      this.setState({dropDownloading: false});
    }
  };

  cancelOrder = async () => {
    this.setState({loading: true});
    const orderId = this.props.item?.increment_id;
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
        this.setState({loading: false});
        this.setState({cancelOrderModal: false});
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
    } catch (error) {
      this.setState({cancelOrderModal: false});
      this.setState({loading: false});
      showErrorMessage(error.message);
    }
  };

  onBuyAgianPress = async () => {
    let productData = [];
    this.props.item.items.map(product => {
      let data = {
        data: {
          quantity: product?.qty,
          sku: product?.sku,
        },
      };
      productData.push(data);
    });

    let variables = {
      type_id: 'multipleItems',
      items: productData,
    };

    const result = await addToCart(variables, this.context);
    if (result) {
      this.props.navigation.navigate('Cart');
    }
  };

  getRefetchRes = async () => {
    try {
      const {data, loading, error} = await client.query({
        query: FETCH_ORDER_DETAILS_QUERY,
        fetchPolicy: 'network-only',
        variables: {
          order_id: this.props.item?.increment_id,
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
    }
  };

  componentDidMount() {
    this.getCancelReasons();
  }

  render() {
    const _this = this.props._this,
      item = this.props.item,
      navigation = this.props.navigation;
    const paymentData = this.state.fetchOrderRes;
    return (
      <>
        {this.state.loading ? (
          <Loader loading={true} transparent={true} />
        ) : null}
        <View
          style={styles.cardContainer}
          key={this.props.key + '-' + item.increment_id}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.cardOrderIdLabel}>Order ID - </Text>
              <Text style={styles.cardOrderIdText}> {item.increment_id}</Text>
            </View>
            <View
              style={{
                height: 20,
                backgroundColor: 'grey',
                width: 0.5,
                marginLeft: 10,
              }}></View>
            <Text
              style={[
                styles.cardStatusText,
                item.status === 'Cancelled'
                  ? {color: '#F85100'}
                  : {color: '#2B5F2B'},
              ]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.cardCreatedText}>
            Ordered On - {item.created_at?.substr(0, 10)}
          </Text>

          <View style={{marginTop: 10}}>
            <Text style={styles.cardItemsText}>
              Total Products - {item?.items.length}
            </Text>

            <Text style={{fontSize: 12, color: 'black'}}>
              Quantity:{' '}
              {item?.items.reduce(
                (total, currentItem) => total + currentItem.qty,
                0,
              )}
            </Text>

            <Text style={styles.cardItemsText}>
              Order Amount - {`${item.currency} ${item.grand_total}`}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              {item.items.slice(0, 3).map(item => (
                <TouchableOpacity
                  onPress={() => this.setState({allItemsModal: true})}
                  style={{
                    borderWidth: 0.3,
                    marginLeft: 5,
                    padding: 6,
                    borderRadius: 5,
                    borderColor: 'grey',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{width: 30, height: 30}}
                    source={{uri: item.thumbnail}}
                  />
                </TouchableOpacity>
              ))}

              {item.items.length > 3 && (
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
                  <Text>+{item.items.length - 3}</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OrderDetails', {
                      orderId: item.increment_id,
                      can_cancel: item.can_cancel,
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
                    style={{color: '#00407B', fontSize: 14, fontWeight: '600'}}>
                    Track
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{paddingHorizontal: 6}}></View>

              <TouchableOpacity
                style={{padding: 10}}
                onPress={() => {
                  this.getOrderCancelStatus();
                  this.setState({buyAgainDrop: !this.state.buyAgainDrop});
                }}>
                <Image
                  style={
                    this.state.buyAgainDrop
                      ? {transform: [{rotate: '180deg'}]}
                      : {}
                  }
                  source={require('../../../../../../assets/arrowDown.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.buyAgainDrop ? (
            <View
              style={{
                width: '100%',
                bottom: -10,
                alignSelf: 'center',
                zIndex: 2,
                padding: 6,
              }}>
              <TouchableOpacity
                onPress={this.onBuyAgianPress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderBottomWidth: 0.5,
                  paddingBottom: 6,
                }}>
                <Image
                  source={require('../../../../../../assets/Basket.png')}
                />
                <View style={{paddingHorizontal: 4}}></View>
                <Text>Buy Again</Text>
              </TouchableOpacity>
              <View style={{paddingVertical: 4}}></View>
              {this.state.dropDownloading ? (
                <View
                  onPress={() => this.setState({cancelOrderModal: true})}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../../../../assets/Package.png')}
                  />
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text>loading...</Text>
                </View>
              ) : this.state?.isFullCancel &&
                item.status !== 'Delivered' &&
                item.status !== 'Payment Pending' ? (
                <TouchableOpacity
                  onPress={() => this.setState({cancelOrderModal: true})}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../../../../assets/Package.png')}
                  />
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text>Cancel Order</Text>
                </TouchableOpacity>
              ) : item.status === 'Payment Pending' ? (
                <RetryPaymentButton
                  // paymentData={paymentData}
                  incrementId={item?.increment_id}
                  navigation={this.props.navigation}
                />
              ) : item.status === 'Delivered' ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('OrderReturnSection', {
                      orderId: item?.increment_id,
                    })
                  }
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../../../../assets/Package.png')}
                  />
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text>Return Order</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>

        <Modal visible={this.state.cancelOrderModal} transparent>
          <View
            style={{
              backgroundColor: '#6B7186BF',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                borderRadius: 5,
                padding: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    cancelOrderModal: false,
                    selectedReasonId: null,
                  });
                }}
                style={{alignSelf: 'flex-end'}}>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../../../../../../assets/close.png')}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                Cancel Order
              </Text>

              <View style={{marginTop: 10}}>
                <Text>Are your sure you want to cancel this order?</Text>

                <Dropdown
                  selectedTextStyle={{fontSize: 14}}
                  placeholder="Select Option"
                  renderItem={item => (
                    <View
                      style={{
                        justifyContent: 'space-between',
                        padding: 8,
                        paddingVertical: 4,
                      }}>
                      <Text style={{}}>{item.reason}</Text>
                    </View>
                  )}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  data={this.state.cancelReasons}
                  maxHeight={300}
                  labelField="reason"
                  valueField="reason"
                  onChange={item => {
                    this.setState({selectedReasonId: item.id});
                  }}
                />
                {this.state.selectedReasonId ? (
                  <View>
                    <TouchableOpacity
                      onPress={this.cancelOrder}
                      style={{
                        backgroundColor: '#F3943D',
                        // width: '%',
                        padding: 10,
                        paddingHorizontal: 16,
                        alignSelf: 'center',
                        marginTop: 15,
                        borderRadius: 5,
                      }}>
                      <Text style={{color: 'white'}}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={this.state.allItemsModal} transparent>
          <View
            style={{
              backgroundColor: '#6B7186BF',
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                marginTop: '40%',
                padding: 10,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
                  All Items
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({allItemsModal: false})}
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
                  data={item?.items}
                  renderItem={({item: renderItems}) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                        }}>
                        <View
                          style={{
                            borderRadius: 4,
                            borderWidth: 0.5,
                            borderColor: 'grey',
                            padding: 4,
                            justifyContent: 'center',
                          }}>
                          <Image
                            style={{width: 40, height: 40}}
                            source={{uri: renderItems.thumbnail}}
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
                                width: '70%',
                              }}>
                              {renderItems.name?.length > 40
                                ? renderItems.name.slice(0, 40) + '...'
                                : renderItems.name}
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
                                color: 'black',
                              }}>
                              Quantity : {renderItems.qty}
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
                                  item.status === 'Cancelled'
                                    ? '#F85100'
                                    : '#2B5F2B',
                              }}>
                              {item.status}
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
