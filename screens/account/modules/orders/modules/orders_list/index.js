import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Query} from 'react-apollo';
import {
  GET_ORDERS_QUERY,
  BUY_AGAIN,
  GET_ORDERS_NEW,
  GET_ORDER_DETAILS_QUERYGET_NEW_ORDER_DETAILS_VERSION_THREE_QUERY,
} from '../../graphql';
import OrderCard from '../order_card';
import BuyCard from '../buy_card';
import Header from '@components/header';
import Styles from './order_list.style';
import Loader from '@components/loader';
import {DentalkartContext} from '@dentalkartContext';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';
import {client, newclient, orderReturnStagingClient} from '@apolloClient';
import {CANCEL_ORDER} from '../../graphql';
import colors from '../../../../../../config/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  LIST_RETURN_ITEMS,
  RETURN_ITEMS,
} from '../../../orderReturnItemsSection/graphql';
import {withNavigationFocus} from 'react-navigation';
import {snakeToTitleCase} from '@helpers/formatter';

export const EmptyOrders = ({value}) => {
  return (
    <View style={Styles.wrapper}>
      <Text allowFontScaling={false} style={Styles.textHeading}>
        {"It's Empty Here !"}
      </Text>
      <Image
        source={{
          uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/App/noOrders.png',
        }}
        style={Styles.emptyImage}
      />
      <Text allowFontScaling={false} style={Styles.textAfterImage}>
        {value === 3
          ? 'You have not placed any order in last three months. Start ordering!'
          : 'You have not placed any order till now. Start ordering!'}
      </Text>
    </View>
  );
};

class OrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoader: false,
      selectedTab: 'Orders',
      // selectedTab:
      //   props?.navigation.getParam('myReturn') === 'Returns'
      //     ? 'Returns'
      //     : 'Orders',
      open: false,
      value: 3,
      items: [
        {label: 'Past 3 months', value: 3},
        {label: 'All orders', value: 120},
      ],
      pageNumber: 1,
      totalPages: 0,
      orders: [],
      hasMore: true,
      item: null,
      returnItems: [],
    };
  }

  setOpen = open => {
    this.setState({
      open,
    });
  };

  setValue = async callback => {
    this.setState({orders: []});
    this.setState(state => ({
      value: callback(state.value),
    }));
    setTimeout(() => {
      this.fetchOrders(1);
    }, 100);
  };

  setItems = callback => {
    this.setState(state => ({
      items: callback(state.items),
    }));
  };

  static contextType = DentalkartContext;
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Order List',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };

  footer() {
    return this.state.loading ? (
      <View
        style={{
          height: hp('5%'),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.blueColor} />
      </View>
    ) : null;
  }
  async fetchMoreData() {
    if (!this.state.loading && this.state.hasMore) {
      await this.fetchOrders(this.state.pageNumber + 1);
      this.setState({pageNumber: this.state.pageNumber + 1});
    }
  }

  cancelOrder = async (orderId, refetch) => {
    Alert.alert(
      'Cancel Order',
      'Sure you want to cancel the order',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            this.setState({pageLoader: true});
            try {
              const {data} = await client.mutate({
                mutation: CANCEL_ORDER,
                variables: {orderId: orderId, fullOrderCancel: 1},
              });

              refetch();
              setTimeout(() => {
                this.setState({pageLoader: false});
                showSuccessMessage('Order Cancelled Successfully!');
              }, 6000);
            } catch (error) {
              showErrorMessage(error.message);
              refetch();
              this.setState({pageLoader: false});
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  fetchOrders = async (pageNumber = 0) => {
    this.setState({loading: true});
    try {
      const {data} = await client.mutate({
        mutation: GET_ORDERS_NEW,
        variables: {
          page: pageNumber,
          timespan: this.state.value === '' ? 120 : this.state.value,
        },
        onError: error => {
          showErrorMessage(`${error.message}. Please try again.`);
        },
      });
      // console.log('GET_ORDERS_NEW==GET_ORDERS_NEW', data);
      this.setState({loading: false});
      this.setState({orders: [...this.state.orders, ...data?.customerOrders]});
      if (data?.customerOrders?.length >= 50) {
        this.setState({hasMore: true});
      } else {
        this.setState({hasMore: false});
      }
    } catch (error) {
      showErrorMessage(error.message);
      this.setState({loading: false});
    }
  };

  getReturnItems = async () => {
    try {
      const {data} = await orderReturnStagingClient.query({
        query: LIST_RETURN_ITEMS,
        fetchPolicy: 'network-only',
        variables: {
          pagination: {
            pageNumber: 1,
            rowsPerPage: 100,
          },
        },
      });
      // console.log(
      //   'getReturnItems==getReturnItems=====---getReturnItems',
      //   JSON.stringify(data),
      // );
      if (data?.listReturnItems && data?.listReturnItems?.result?.length) {
        this.setState({returnItems: data?.listReturnItems?.result});
      }
    } catch (e) {
      console.log('getReturnAction error', e);
    }
  };

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getReturnItems();
    });
    this.triggerScreenEvent();
    await this.fetchOrders(1);
    // if (this.state.orders.length === 0) {
    //   this.setState({value: 120}, () => this.fetchOrders(1));
    // }
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    let selectedTabRoutes = this.props?.navigation.getParam('myReturn');
    console.log('selectedTabRoutes======selectedTabRoutes', selectedTabRoutes);
    return (
      <View style={{flex: 1, backgroundColor: '#F1F3F6'}}>
        {this.state.pageLoader ? (
          <Loader loading={true} transparent={true} />
        ) : null}
        <HeaderComponent
          navigation={this.props.navigation}
          style={{height: 40}}
        />
        <View style={Styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.setState({selectedTab: 'Orders'})}
            style={[
              Styles.tab,
              this.state.selectedTab === 'Orders' &&
              selectedTabRoutes !== 'Returns'
                ? Styles.selectedTab
                : null,
            ]}>
            <Text
              style={[
                Styles.tabText,
                this.state.selectedTab === 'Orders' &&
                selectedTabRoutes !== 'Returns'
                  ? Styles.selectedTabText
                  : {color: 'black'},
              ]}>
              My Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.setState({selectedTab: 'Returns'})}
            style={[
              Styles.tab,
              this.state.selectedTab === 'Returns' ||
              selectedTabRoutes === 'Returns'
                ? Styles.selectedTab
                : null,
            ]}>
            <Text
              style={[
                Styles.tabText,
                this.state.selectedTab === 'Returns' ||
                selectedTabRoutes === 'Returns'
                  ? Styles.selectedTabText
                  : {color: 'black'},
              ]}>
              Returns
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.selectedTab === 'Orders' &&
        selectedTabRoutes !== 'Returns' ? (
          <>
            <View
              style={{backgroundColor: 'white', paddingBottom: 10, zIndex: 2}}>
              <DropDownPicker
                style={[
                  {
                    height: hp('5%'),
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                    width: wp('95%'),
                    marginBottom: 10,
                    // marginBottom: 70,
                  },
                ]}
                dropDownContainerStyle={{
                  backgroundColor: '#FFF',
                  borderColor: '#CCCCCC',
                }}
                containerStyle={[
                  {
                    width: wp('95%'),
                    alignSelf: 'center',
                    marginTop: hp('2%'),
                    minHeight: hp('5%'),
                  },
                ]}
                textStyle={{
                  fontWeight: '500',
                  fontSize: wp('4%'),
                  color: '#25303C',
                }}
                open={this.state.open}
                value={this.state.value}
                items={this.state.items}
                setOpen={this.setOpen}
                setValue={this.setValue}
              />
            </View>
            {/* {console.log(
              'this.state.orders====this.state.orders',
              JSON.stringify(this.state.orders),
            )} */}
            {this.state.orders?.length > 0 ? (
              <View>
                {/* <View style={{height: '85%'}}> */}
                <View style={{marginBottom: '50%'}}>
                  <FlatList
                    data={this.state.orders}
                    extraData={this.state.orders}
                    onEndReached={() => this.fetchMoreData()}
                    onEndReachedThreshold={3}
                    renderItem={({item, index}) => (
                      <OrderCard
                        key={index}
                        navigation={this.props.navigation}
                        item={item}
                        _this={this}
                        cancelOrder={async orderId => {
                          await this.cancelOrder(orderId);
                        }}
                      />
                    )}
                    keyExtractor={(item, index) =>
                      index + '-' + item?.increment_id?.toString()
                    }
                    initialNumToRender={3}
                    ListEmptyComponent={() => (
                      <EmptyOrders value={this.state.value} />
                    )}
                    ListFooterComponent={this.footer()}
                  />
                </View>
              </View>
            ) : !this.state.loading ? (
              <EmptyOrders value={this.state.value} />
            ) : (
              <View
                style={{
                  // height: hp('5%'),
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size="large" color={colors.blueColor} />
              </View>
            )}
          </>
        ) : (
          // <Query
          //   query={BUY_AGAIN}
          //   fetchPolicy="network-only"
          //   client={newclient}
          //   onError={error => {
          //     showErrorMessage(`${error.message}. Please try again.`);
          //   }}>
          //   {({data, loading, error, refetch}) => {
          //     if (loading) {
          //       return <Loader loading={true} transparent={true} />;
          //     }
          //     if (error) {
          //       return (
          //         <Text allowFontScaling={false}>
          //           Somethig went wrong. Try Again.
          //         </Text>
          //       );
          //     }
          //     if (data?.buyAgain) {
          //       return (
          //         <View style={{marginTop: hp('2%')}}>
          //           <FlatList
          //             horizontal={false}
          //             numColumns={2}
          //             data={data?.buyAgain}
          //             renderItem={({item, index}) => (
          //               <BuyCard
          //                 item={item}
          //                 navigation={this.props.navigation}
          //               />
          //             )}
          //             keyExtractor={(item, index) => JSON.stringify(item.id)}
          //             initialNumToRender={3}
          //             ListEmptyComponent={() => (
          //               <EmptyOrders value={this.state.value} />
          //             )}
          //             ItemSeparatorComponent={() => (
          //               <View style={{height: hp('1%')}} />
          //             )}
          //             ListFooterComponent={() => (
          //               <View style={{height: hp('15%')}} />
          //             )}
          //           />
          //         </View>
          //       );
          //     }
          //   }}
          // </Query>
          <>
            {/* {console.log('item===item==__-==item', item)} */}
            <View
              style={{
                alignSelf: 'flex-end',
                paddingHorizontal: 10,
                paddingTop: 5,
                // paddingVertical: 5,
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PastReturns')}>
                <Text style={{color: 'blue'}}>View Past Returns</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={this.state.returnItems}
              renderItem={({item}) => {
                return (
                  <>
                    <View
                      style={Styles.cardContainer}
                      // key={this.props.key + '-' + item.increment_id}
                    >
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={Styles.cardOrderIdLabel}>
                            Order ID -{' '}
                          </Text>
                          <Text style={Styles.cardOrderIdText}>
                            {' '}
                            {item.order_id}
                          </Text>
                        </View>

                        <View
                          style={{
                            height: 20,
                            backgroundColor: 'grey',
                            width: 0.5,
                            marginLeft: 10,
                          }}></View>
                        {/* <Text style={Styles.cardStatusText}>{item.status}</Text> */}
                        <Text style={Styles.cardStatusText}>
                          {snakeToTitleCase(
                            item?.status,
                            'Approved',
                            'Request Approved',
                          )}
                        </Text>
                      </View>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={Styles.cardOrderIdLabel}>
                            Return ID -{' '}
                          </Text>
                          <Text style={Styles.cardOrderIdText}>
                            {' '}
                            {item.return_id}
                          </Text>
                        </View>

                        <View
                          style={{
                            height: 20,
                            backgroundColor: 'grey',
                            width: 0.5,
                            marginLeft: 10,
                          }}></View>
                        {/* <Text style={Styles.cardStatusText}>{item.status}</Text> */}
                        <Text style={Styles.cardCreatedText}>
                          Requested On -{item.created_at.substr(0, 10)}
                        </Text>
                      </View>

                      <View style={{marginTop: 10}}>
                        <Text style={Styles.cardItemsText}>{item.name}</Text>

                        <Text style={{fontSize: 12, color: 'black'}}>
                          Quantity :{item?.qty}
                        </Text>

                        <Text style={Styles.cardItemsText}>
                          Amount - Rs {`${item.amount}`}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          {/* {console.log('url_key====url_key', item)} */}
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('UrlResolver', {
                                url_key: item?.url,
                              })
                            }
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
                              source={{
                                uri:
                                  'https://images.dentalkart.com/media/catalog/product' +
                                  item.image,
                              }}
                            />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('OrderDetails', {
                                  orderId: item.order_id,
                                  can_cancel: item.can_cancel,
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
                          <View style={{paddingHorizontal: 6}}></View>
                        </View>
                      </View>
                    </View>
                  </>
                );
              }}
              ListEmptyComponent={() => (
                <Text
                  style={{
                    fontWeight: '600',
                    color: 'black',
                    textAlign: 'center',
                    paddingTop: 10,
                  }}>
                  You don't have any past return items.
                </Text>
              )}
            />
          </>
        )}
      </View>
    );
  }
}

export default withNavigationFocus(OrdersList);
