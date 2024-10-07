import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  Keyboard,
  BackHandler,
} from 'react-native';
import WishlistProducts from './modules/wishlist_products';
import {Query} from 'react-apollo';
import {
  DELETE_WISHLIST_ITEM_QUERY,
  CREATE_WISHLIST,
  GET_CUSTOMER_WISHLIST_ITEMS,
  GET_WISHLIST,
  REMOVE_WISHLIST,
  ADD_PRODUCT_TO_WISHLIST,
  UPDATE_WISHLIST,
  SHARE_WISHLIST,
} from './graphql';
import {client, newclient} from '@apolloClient';
import {addToCart} from '@screens/cart';
import Header from '@components/header';
import Styles from './wishlist.style';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextInputComponent from '@components/TextInputComponent';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import WishlistsCards from './modules/WishlistsCards';
import WishListDetails from './modules/WishlistsDetails';
import {validateEmail, validatePhone} from '@helpers/validator';
import HeaderComponent from '@components/HeaderComponent';
import {ScrollView} from 'react-navigation';
import {addToCartClick} from '../../helpers/sendData';

let wishlistRefetch;
let wishlistCards = [];
const EmptyWishlist = () => {
  return (
    <View style={Styles.wrapper}>
      <Text allowFontScaling={false} style={Styles.textHeading}>
        {"It's Empty Here !"}
      </Text>
      <Image
        source={{
          uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/App/wishlistApp.png',
        }}
        style={Styles.emptyImage}
      />
      <Text allowFontScaling={false} style={Styles.textAfterImage}>
        You have no items currently. Start adding!
      </Text>
    </View>
  );
};

export default class Wishlist extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      wishlistTypes: 'cards',
      keyboardOpen: false,
      showModal: false,
      popupType: null,
      selectedWishlist: null,
      open: false,
      value: 'public',
      items: [
        {label: 'Private', value: 'private'},
        {label: 'Public', value: 'public'},
      ],
      shareInfo: '',
      wishlist: {
        name: '',
        type: 'public',
      },
      wishlistCards: [],
    };
    this.setValue = this.setValue.bind(this);
  }

  removeItem = async id => {
    try {
      const data = client.mutate({
        mutation: DELETE_WISHLIST_ITEM_QUERY,
        variables: {wishlistItemId: id},
      });
      showSuccessMessage('Removed from the Wishlist');
    } catch (err) {
      console.log(err);
    }
  };

  updateWishlist = async id => {
    try {
      await newclient.mutate({
        mutation: UPDATE_WISHLIST,
        variables: {
          wishlist_id: id,
          wishlist_name: this.state.wishlist.name,
          access_type: this.state.wishlist.type,
        },
      });
      this.setState({showModal: false});
      showSuccessMessage('Wishlist updated');
      this.getNewData();
      wishlistRefetch();
    } catch (err) {
      this.setState({showModal: false});
      console.log(err);
    }
  };

  createWishlist = async () => {
    try {
      await newclient.mutate({
        mutation: CREATE_WISHLIST,
        variables: {
          wishlist_name: this.state.wishlist.name,
          access_type: this.state.wishlist.type,
        },
      });
      this.setState({
        showModal: false,
        wishlist: {
          name: '',
          type: 'public',
        },
      });
      showSuccessMessage('Wishlist created');
      wishlistRefetch();
    } catch (err) {
      this.setState({showModal: false});
      console.log(err);
    }
  };

  addProductToWishlist = async () => {
    try {
      await newclient.mutate({
        mutation: ADD_PRODUCT_TO_WISHLIST,
        variables: {
          wishlist_id: '60dcb21931a1771b91aea161',
          product_ids: [220, 222, 224, 36076],
        },
      });
      this.setState({showModal: false});
      showSuccessMessage('Product added');
      wishlistRefetch();
    } catch (err) {
      this.setState({showModal: false});
      console.log(err);
    }
  };

  removeWishlist = async (wishlist_id, product_ids = []) => {
    try {
      await newclient.mutate({
        mutation: REMOVE_WISHLIST,
        variables: {wishlist_id: wishlist_id, product_ids: product_ids},
      });
      this.setState({showModal: false});
      showSuccessMessage(
        !product_ids.length ? 'Wishlist removed' : 'Product removed',
      );
      !product_ids.length && wishlistRefetch();
    } catch (err) {
      this.setState({showModal: false});
      console.log(err);
    }
  };

  shareInfo = async id => {
    let data = {
      wishlist_id: id,
    };
    if (this.state.shareInfo !== '') {
      let dataType = parseInt(this.state.shareInfo);
      if (dataType != this.state.shareInfo) {
        if (validateEmail(this.state.shareInfo)) {
          data.email = this.state.shareInfo;
        }
      } else {
        if (validatePhone(this.state.shareInfo)) {
          data.mobile_no = parseInt(this.state.shareInfo);
        }
      }
    }
    if (data?.email || data?.mobile_no) {
      try {
        await newclient.mutate({
          mutation: SHARE_WISHLIST,
          variables: data,
        });
        this.setState({showModal: false});
        showSuccessMessage('Wishlist shared');
      } catch (err) {
        this.setState({showModal: false});
        console.log(err);
      }
    }
    this.setState({
      shareInfo: '',
      showModal: false,
    });
  };

  addToCart = async (item = []) => {
    // if (item.type_id === 'simple') {
    const {userInfo} = this.context;
    let clickData = {
      origin_page: 'wishlist',
      landing_page: 'cart',
      section: '',
      position: '',
      customer_id:
        userInfo && userInfo.getCustomer ? userInfo.getCustomer.email : null,
      created_at: new Date(),
      product_id: item && item?.length ? item[0]?.id : null,
    };
    addToCartClick(clickData);
    let productData = [];
    let groupedType = false;
    item.length &&
      item.map(product => {
        if (product.type_id === 'grouped') {
          groupedType = true;
          return;
        }
        let data = {
          data: {
            quantity: product?.quantity ? product?.quantity : 1,
            sku: product?.sku,
          },
        };
        productData.push(data);
      });
    if (productData.length) {
      let variables = {
        type_id: 'multipleItems',
        items: productData,
      };
      await addToCart(variables, this.context);
      // } else {
      //   this.navigateToDetail(item);
      // }
    } else {
      showErrorMessage(
        groupedType
          ? 'This product has variants, please select specific product to be added in cart on detail page'
          : 'Something went wrong',
      );
      return;
    }
  };

  navigateToDetail(item) {
    this.props.navigation.push('ProductDetails', {
      productId: item?.id,
      productUrl: item.url_key,
    });
  }

  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Wishlist',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    this.triggerScreenEvent();
    // this.addProductToWishlist()
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.wishlistTypes === 'details') {
        this.setState({wishlistTypes: 'cards'});
        return true;
      } else {
        this.props.navigation.goBack();
        return true;
      }
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.backHandler.remove();
  }

  _keyboardDidShow = () => {
    this.setState({keyboardOpen: true});
  };

  _keyboardDidHide = () => {
    this.setState({keyboardOpen: false});
  };

  setOpen = open => {
    Keyboard.dismiss();
    this.setState({
      open,
    });
  };

  setValue = async callback => {
    await this.setState(state => ({
      value: callback(state.value),
      wishlist: {
        ...this.state.wishlist,
        type: callback(state.value),
      },
    }));
  };

  setItems = callback => {
    this.setState(state => ({
      items: callback(state.items),
    }));
  };

  showPopUp = (type, data) => {
    if (type === 'edit') {
      this.setState({
        wishlist: {
          ...this.state.wishlist,
          name: data.wishlist_name,
          type: data.access_type,
        },
        value: data.access_type,
      });
    }
    this.setState({
      selectedWishlist: data,
      popupType: type,
      showModal: true,
    });
  };

  popup = () => {
    const {open, value, items, popupType} = this.state;
    let data = {};
    switch (popupType) {
      case 'create':
        data = {
          title: 'Create a new wishlist',
          buttonTitle: 'Create',
          onPress: () => {
            this.createWishlist();
            this.setState({
              showModal: false,
              selectedWishlist: null,
            });
          },
        };
        break;
      case 'edit':
        data = {
          title: `Edit | ${this.state.selectedWishlist?.wishlist_name}`,
          buttonTitle: 'Update',
          onPress: () => {
            this.updateWishlist(this.state.selectedWishlist?.wishlist_id);
            this.setState({
              showModal: false,
              selectedWishlist: null,
              wishlist: {
                name: '',
                type: 'public',
              },
            });
          },
        };
        break;
      case 'deleteList':
        data = {
          title: `Delete | ${this.state.selectedWishlist?.wishlist_name}`,
          buttonTitle: 'Delete',
          onPress: () => {
            this.removeWishlist(this.state.selectedWishlist?.wishlist_id);
            this.setState({
              showModal: false,
              selectedWishlist: null,
            });
          },
        };
        break;
      case 'share':
        data = {
          title: `Share | ${this.state.selectedWishlist?.wishlist_name}`,
          buttonTitle: 'Share',
          onPress: () => {
            this.shareInfo(this.state.selectedWishlist?.wishlist_id);
            this.setState({
              showModal: false,
              selectedWishlist: null,
            });
          },
        };
        break;
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showModal}
        onRequestClose={() => {
          this.setState({
            showModal: false,
            selectedWishlist: null,
            wishlist: {
              name: '',
              type: 'public',
            },
          });
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            this.setState({
              showModal: false,
              selectedWishlist: null,
              wishlist: {
                name: '',
                type: 'public',
              },
            })
          }
          style={[
            styles.centeredView,
            {flex: this.state.keyboardOpen ? 0.7 : 1},
          ]}>
          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            activeOpacity={1}
            style={styles.modalView}>
            <View style={styles.modalHeaderContainer}>
              <View style={{flex: 1}}>
                <Text
                  allowFontScaling={false}
                  style={[styles.headerTitleText, {fontSize: wp('4.5%')}]}>
                  {data.title}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  this.setState({
                    showModal: false,
                    selectedWishlist: null,
                    wishlist: {
                      name: '',
                      type: 'public',
                    },
                  })
                }
                style={{padding: wp('1%')}}>
                <Icon
                  name={'close-circle-outline'}
                  size={wp('7%')}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: wp('80%'),
                paddingTop: hp('1%'),
                paddingBottom: hp('3%'),
              }}>
              {data.buttonTitle === 'Share' ? (
                <>
                  <Text allowFontScaling={false} style={styles.labelText}>
                    Share with
                  </Text>
                  <TextInputComponent
                    placeholder="Email / mobile no"
                    value={this.state.shareInfo}
                    onChangeText={text => {
                      this.setState({
                        shareInfo: text,
                      });
                    }}
                    autoCapitalize="none"
                    style={styles.inputBox}
                  />
                  {/* <Text allowFontScaling={false} style={{
                      textAlign: "justify",
                      marginTop: hp("2%"),
                      fontSize: wp("4%"),
                      fontWeight: "400"
                    }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</Text> */}
                </>
              ) : data.buttonTitle === 'Delete' ? (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: wp('5%'),
                    marginTop: hp('2%'),
                  }}>
                  Are you sure you want to delete
                </Text>
              ) : (
                <>
                  <Text allowFontScaling={false} style={styles.labelText}>
                    Wishlist name
                  </Text>
                  <TextInputComponent
                    placeholder="Enter name ex. Shopping list"
                    value={this.state.wishlist.name}
                    onChangeText={text => {
                      this.setState({
                        wishlist: {
                          ...this.state.wishlist,
                          name: text,
                        },
                      });
                    }}
                    autoCapitalize="none"
                    style={styles.inputBox}
                  />
                  <Text allowFontScaling={false} style={styles.labelText}>
                    Wishlist type
                  </Text>
                  <DropDownPicker
                    style={[
                      {
                        height: hp('5%'),
                        borderColor: colors.grey,
                        width: wp('80%'),
                      },
                    ]}
                    dropDownContainerStyle={{
                      backgroundColor: '#FFF',
                      borderColor: colors.grey,
                    }}
                    containerStyle={[
                      {
                        width: wp('80%'),
                        alignSelf: 'center',
                      },
                    ]}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={this.setOpen}
                    setValue={this.setValue}
                    setItems={this.setItems}
                  />
                </>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: hp('3%'),
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={data.onPress}
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor:
                        data.buttonTitle === 'Delete' ? '#D83030' : '#25303C',
                    },
                  ]}>
                  <Text
                    allowFontScaling={false}
                    style={styles.headerButtonText}>
                    {data.buttonTitle}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  showWishListDetails = card => {
    this.setState({
      wishlistTypes: 'details',
      selectedCardId: card.wishlist_id,
    });
  };

  renderWishlists = ({item}) => {
    return (
      <WishlistsCards
        item={item}
        addToCart={this.addToCart}
        showWishListDetails={() => this.showWishListDetails(item)}
        showPopUp={this.showPopUp}
      />
    );
  };

  getNewData = async () => {
    let wishlistData = await newclient.mutate({
      mutation: GET_WISHLIST,
      variables: {
        wishlist_ids: [],
        sharing_hash: null,
      },
    });
    if (
      wishlistData?.data?.getWishlist &&
      wishlistData?.data?.getWishlist.length
    ) {
      this.setState({
        wishlistCards: wishlistData?.data?.getWishlist,
      });
    }
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F1F3F6'}}>
        {/* <Header back heading="My Wishlist" navigation={this.props.navigation} /> */}
        <HeaderComponent
          navigation={this.props.navigation}
          onPress={() => {
            this.state.wishlistTypes === 'details'
              ? this.setState({wishlistTypes: 'cards'})
              : this.props.navigation.goBack();
          }}
          label={'My Wishlist'}
          style={{height: 40}}
        />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              {/* <TouchableOpacity activeOpacity={0.5} onPress={() => this.setState({ wishlistTypes: "card" })}>
              <Text allowFontScaling={false} style={styles.headerTitleText}>My WishList</Text>
            </TouchableOpacity> */}
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.showPopUp('create', null)}
                style={styles.headerButton}>
                <Text allowFontScaling={false} style={styles.headerButtonText}>
                  CREATE WISHLIST
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.wishlistTypes === 'details' ? (
              <WishListDetails
                navigation={this.props.navigation}
                addToCart={this.addToCart}
                showCards={() => {
                  this.setState({
                    wishlistTypes: 'cards',
                  });
                }}
                showPopUp={this.showPopUp}
                removeProduct={this.removeWishlist}
                selectedCardId={this.state.selectedCardId}
                wishlistCards={this.state.wishlistCards}
              />
            ) : (
              <Query
                client={newclient}
                query={GET_WISHLIST}
                variables={((wishlist_ids = []), (sharing_hash = null))}
                fetchPolicy="network-only">
                {({data, loading, error, refetch}) => {
                  wishlistRefetch = refetch;
                  if (error) {
                    return null;
                  }
                  if (loading) {
                    return <Loader loading={true} transparent={true} />;
                  }
                  if (!loading && data && data.getWishlist) {
                    wishlistCards = data.getWishlist;
                    return (
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data.getWishlist}
                        renderItem={this.renderWishlists}
                        keyExtractor={item => item.id}
                        ListFooterComponent={
                          <View
                            style={{height: hp('3%')}}
                            ListEmptyComponent={() => <EmptyWishlist />}
                          />
                        }
                      />
                    );
                  }
                  return null;
                }}
              </Query>
            )}
          </View>
        </ScrollView>
        {this.popup()}
        {/* <Query
          query={GET_CUSTOMER_WISHLIST_ITEMS}
          fetchPolicy="cache-and-network">
          {({data, loading, error}) => {
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (loading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (data && data.customer.wishlist) {
              let products = data.customer.wishlist
                ? data.customer.wishlist.items
                : [];
              return (
                <FlatList
                  data={products}
                  renderItem={({item}) => (
                    <WishlistProducts
                      item={item}
                      _this={this}
                      wishlistId={item.id}
                    />
                  )}
                  keyExtractor={(item, index) => item.sku}
                  initialNumToRender={5}
                  ListEmptyComponent={() => <EmptyWishlist />}
                />
              );
            } else {
              return <Text allowFontScaling={false}>Something went wrong !</Text>;
            }
          }}
        </Query> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    width: wp('100%'),
    alignSelf: 'center',
    // marginTop: hp("3%")
  },
  headerContainer: {
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  headerTitleText: {
    fontSize: wp('5%'),
    fontWeight: '500',
    color: '#25303C',
  },
  headerButton: {
    backgroundColor: '#25303C',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('4%'),
    borderRadius: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  headerButtonText: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: colors.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 241, 239, 0.7)',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeaderContainer: {
    backgroundColor: colors.bgColor,
    width: wp('90%'),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingStart: wp('4%'),
    paddingVertical: hp('1%'),
  },
  labelText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    paddingVertical: hp('1.5%'),
  },
  inputBox: {
    paddingStart: wp('3%'),
    width: wp('80%'),
    borderWidth: 1,
    borderRadius: hp('1%'),
    borderColor: colors.grey,
    minHeight: hp('5%'),
    // height: hp("5%"),
  },
  buttonStyle: {
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
});
