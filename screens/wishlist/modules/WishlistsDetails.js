import React, {Component, createRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import {GET_PRODUCT, GET_WISHLIST, MOVE_PRODUCT_IN_WISHLIST} from '../graphql';
import {Query} from 'react-apollo';
import {newclient, client2} from '@apolloClient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../config/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import Loader from '@components/loader';
import {productBaseUrl} from '@config/environment';
import ActionSheet from 'react-native-actions-sheet';
import {
  showErrorMessage,
  showSuccessMessage,
  showInfoMessage,
} from '../../../helpers/show_messages';

const actionSheetMoveRef = createRef();
const actionSheetMenuRef = createRef();
export default class WishListDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProductIds: [],
      productIds: [],
      selectedCard: null,
      selectedProduct: null,
      productData: [],
      open: false,
      value: '',
      items: [],
    };
    this.setValue = this.setValue.bind(this);
  }

  componentWillReceiveProps = props => {
    this.getWishListById(this.state.value);
  };

  componentWillMount = () => {
    this.getWishListById(this.props.selectedCardId);
  };

  getWishListById = async id => {
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
      let items = [];
      let selectedCard = null;
      wishlistData?.data?.getWishlist.map(item => {
        let data = {
          label: item.wishlist_name,
          value: item.wishlist_id,
          id: item.wishlist_id,
        };
        items.push(data);
        if (item.wishlist_id === id) {
          selectedCard = item;
        }
      });
      this.setState({
        items: items,
        value: selectedCard.wishlist_id,
        selectedCard: selectedCard,
      });
      this.getProductsData(selectedCard);
    }
  };

  getProductsData = async data => {
    let id = [];
    data?.products &&
      data?.products.map(product => {
        id.push(product.product_id);
      });
    await this.setState({
      productIds: id,
    });
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
      productData: [],
      selectedProductIds: [],
    }));
    this.getWishListById(this.state.value);
  };

  setItems = callback => {
    this.setState(state => ({
      items: callback(state.items),
    }));
  };

  deleteProductModal(id) {
    Alert.alert(
      'Delete Whishlist Item',
      'Are you sure to delete this wishlist item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => this.deleteProduct([id]),
        },
      ],
      {cancelable: false},
    );
  }

  deleteProduct = async id => {
    await this.props.removeProduct(this.state.selectedCard.wishlist_id, id);
    this.getWishListById(this.state.value);
  };

  markSelected = id => {
    let ids = [...this.state.selectedProductIds];
    ids.push(id);
    this.setState({
      selectedProductIds: ids,
    });
  };

  removeSelected = id => {
    let ids = [...this.state.selectedProductIds];
    let index = ids.findIndex(productId => productId === id);
    if (index > -1) {
      ids.splice(index, 1);
    }
    this.setState({
      selectedProductIds: ids,
    });
  };

  moveProduct = async target_wishlist_id => {
    try {
      actionSheetMoveRef.current?.setModalVisible(false);
      await newclient.mutate({
        mutation: MOVE_PRODUCT_IN_WISHLIST,
        variables: {
          wishlist_id: this.state.selectedCard.wishlist_id,
          target_wishlist_id: target_wishlist_id,
          product_ids: [this.state.selectedProduct.id],
        },
      });
      this.setState({showModal: false});
      showSuccessMessage('Product moved');
      this.getWishListById(this.state.value);
    } catch (err) {
      console.log(err);
    }
  };

  editWishlist = () => {
    setTimeout(() => {
      this.props.showPopUp('edit', this.state.selectedCard);
    }, 500);
  };

  addToCart = (item, type) => {
    if (item && item?.type_id === 'grouped') {
      showErrorMessage(
        'This product has variants, please select specific product to be added in cart on detail page',
      );
      return;
    }
    let data = [];
    let groupedType = false;
    if (type === 'multiple') {
      this.state.productData.map(product => {
        if (this.state.selectedProductIds.includes(product.id)) {
          if (product.type_id === 'grouped') {
            groupedType = true;
            return;
          }
          data.push(product);
        }
      });
    } else {
      data = [item];
    }
    if (data.length) {
      this.props.addToCart(data);
      this.setState({
        selectedProductIds: [],
      });
    } else {
      showErrorMessage(
        groupedType
          ? 'This product has variants, please select specific product to be added in cart on detail page'
          : 'Something went wrong',
      );
      return;
    }
  };

  renderProductList = ({item}) => {
    let selected = this.state.selectedProductIds.includes(item.id);
    return (
      <Pressable
        // onPress={() => selected ? this.removeSelected(item.id) : this.markSelected(item.id)}
        style={styles.productCard}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              this.props.navigation.push('ProductDetails', {
                productId: item?.id,
                productUrl: item.url_key,
              })
            }
            style={[styles.wishlistImageContainer]}>
            <Image
              source={{uri: productBaseUrl + item.image_url}}
              style={styles.wishlistImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: wp('2%'), paddingRight: wp('2%')}}>
            <View style={{width: '95%'}}>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={{
                  fontWeight: '500',
                  fontSize: wp('4%'),
                  color: '#333333',
                }}>
                {item.name.trim() + 'ddd'}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={{
                  marginTop: hp('.5%'),
                  fontWeight: '500',
                  fontSize: wp('3.5%'),
                  color: '#666666',
                }}>
                {item && item?.short_description?.trim()}
              </Text>
            </View>
            {(item.rating_count || item.average_rating) && (
              <View
                style={{
                  marginTop: hp('.5%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {item.average_rating && (
                  <View style={styles.productRatingContainer}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={{
                        color: colors.white,
                        fontWeight: 'bold',
                        fontSize: wp('3.5%'),
                        paddingEnd: wp('1%'),
                      }}>
                      {parseInt(item.average_rating).toFixed(1)}
                    </Text>
                    <Icon name={'star'} size={wp('5%')} color={colors.white} />
                  </View>
                )}
                {item.rating_count && (
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={{
                      fontWeight: '500',
                      fontSize: wp('3.5%'),
                      color: '#666666',
                    }}>{`(${item.rating_count} reviews)`}</Text>
                )}
              </View>
            )}
            <View
              style={{
                maxWidth: wp('50%'),
                marginTop: hp('.5%'),
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontWeight: '500',
                  fontSize: wp('4%'),
                }}>{`${item?.price?.minimalPrice?.amount?.currency_symbol} ${item.price?.minimalPrice?.amount?.value} `}</Text>
              {item.price?.regularPrice?.amount?.value != 0 && (
                <View>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: '#666666',
                      textDecorationLine: 'line-through',
                      fontWeight: '500',
                      fontSize: wp('3%'),
                    }}>{`${item?.price?.regularPrice?.amount?.currency_symbol} ${item.price?.regularPrice?.amount?.value} `}</Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: '#37BE5F',
                      fontWeight: '500',
                      fontSize: wp('3%'),
                    }}>
                    {(
                      100 -
                      (item.price.minimalPrice.amount.value * 100) /
                        item.price.regularPrice.amount.value
                    ).toFixed(2)}{' '}
                    Off
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              selected
                ? this.removeSelected(item.id)
                : this.markSelected(item.id)
            }
            style={styles.productCardCheck}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              {selected ? (
                <Icon
                  name={'check-circle-outline'}
                  size={wp('7%')}
                  color="green"
                />
              ) : (
                <Icon name={'checkbox-blank-circle-outline'} size={wp('7%')} />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: hp('3%'),
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.addToCart(item, 'single')}
            style={styles.productCardFooterButton}>
            <Icon name={'cart'} size={wp('6%')} color={colors.white} />
            <Text
              allowFontScaling={false}
              style={{
                color: colors.white,
                fontWeight: 'bold',
                fontSize: wp('4%'),
              }}>
              {' '}
              Add to cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={this.state.items.length > 1 ? 0.5 : 1}
            onPress={() => {
              this.setState({
                selectedProduct: item,
              });
              this.state.items.length > 1
                ? actionSheetMoveRef.current?.setModalVisible(true)
                : showInfoMessage('First create wishlist to move');
            }}
            style={[
              styles.productCardFooterButton,
              {backgroundColor: '#EDEDED'},
            ]}>
            <Icon name={'chevron-down'} size={wp('6%')} color={colors.black} />
            <Text
              allowFontScaling={false}
              style={{
                fontWeight: 'bold',
                fontSize: wp('4%'),
                color: '#484848',
              }}>
              {' '}
              Move
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => this.deleteProductModal(item.id)}
            style={[styles.productCardFooterButton, styles.deleteButton]}>
            <Icon name={'delete-outline'} size={wp('6%')} color={'#D43D72'} />
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  render() {
    const {open, value, items, selectedCard} = this.state;
    return (
      <View
        style={{
          minHeight: hp('75%'),
          width: wp('95%'),
          alignSelf: 'center',
          backgroundColor: colors.white,
          paddingTop: hp('2%'),
        }}>
        <View style={styles.header}>
          <View style={{flex: 1, marginStart: wp('2%')}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={styles.headerTitleText}>
                {selectedCard?.wishlist_name
                  ? selectedCard?.wishlist_name
                  : 'Wish List'}
              </Text>
              <View style={styles.headerTitleBadgeContainer}>
                <Text
                  allowFontScaling={false}
                  style={styles.headerTitleBadgeText}>
                  {selectedCard?.access_type === 'public' ||
                  selectedCard?.access_type === 'Public'
                    ? 'Public'
                    : 'Private'}
                </Text>
              </View>
            </View>
            {selectedCard?.default && (
              <View>
                <Text allowFontScaling={false} style={styles.subHeaderText}>
                  Default List
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => actionSheetMenuRef.current?.setModalVisible(true)}
            style={styles.headerSideMenuContainer}>
            <Icon name={'dots-vertical'} size={wp('7%')} color="black" />
          </TouchableOpacity>
        </View>
        {this.state.selectedProductIds.length ? (
          <View
            style={{
              marginTop: hp('2%'),
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.addToCart([], 'multiple')}
              style={styles.headerButton}>
              <Text allowFontScaling={false} style={styles.headerButtonText}>
                ADD TO CART
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={async () => {
                Alert.alert(
                  'Delete All Whishlist Item',
                  'Are you sure to delete this wishlist items?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      onPress: () =>
                        this.deleteProduct(this.state.selectedProductIds),
                    },
                  ],
                  {cancelable: false},
                );
              }}
              style={[styles.headerButton, {backgroundColor: colors.white}]}>
              <Text
                allowFontScaling={false}
                style={[styles.headerButtonText, {color: colors.black}]}>
                DELETE ALL
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <DropDownPicker
          style={[
            {
              height: hp('5%'),
              borderWidth: 1,
              borderColor: '#CCCCCC',
              width: wp('95%'),
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
            },
          ]}
          textStyle={{
            fontWeight: '500',
            fontSize: wp('4%'),
            color: '#25303C',
          }}
          open={open}
          value={value}
          items={items}
          setOpen={this.setOpen}
          setValue={this.setValue}
          setItems={this.setItems}
        />
        {/* {this.state.productIds.length ? ( */}
        <Query
          query={GET_PRODUCT}
          client={newclient}
          fetchPolicy="network-only"
          variables={{id: this.state.productIds}}>
          {({loading, error, data}) => {
            if (loading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (data && data.productData) {
              {
                this.state.productData.length !== data.productData.length &&
                  this.setState({
                    productData: data.productData,
                  });
              }
              return (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data.productData}
                  renderItem={this.renderProductList}
                  keyExtractor={item => item.id}
                  ListFooterComponent={
                    <View style={{height: hp('3%'), width: wp('80%')}} />
                  }
                />
              );
            }
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontWeight: '500',
                    fontSize: wp('3.5%'),
                  }}>
                  You don't have any product in your wishlist.
                </Text>
              </View>
            );
          }}
        </Query>
        {/* ) : (
          
        )} */}
        <ActionSheet
          ref={actionSheetMoveRef}
          headerAlwaysVisible
          gestureEnabled
          // initialOffsetFromBottom={0.5}
          // extraScroll={20}
          containerStyle={styles.actionSheetContainerStyle}
          indicatorColor="#949FB7">
          <ScrollView
            key={'scrollView'}
            style={styles.actionSheetScrollViewStyle}
            contentContainerStyle={styles.actionSheetScrollViewContainerStyle}>
            {items.map(item => {
              if (item.id !== this.state.selectedCard.wishlist_id) {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.moveProduct(item.id)}
                    style={styles.actionSheetItemContainer}>
                    <Text
                      allowFontScaling={false}
                      style={styles.actionSheetItemContainerText}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </ScrollView>
        </ActionSheet>
        <ActionSheet
          ref={actionSheetMenuRef}
          headerAlwaysVisible
          gestureEnabled
          // initialOffsetFromBottom={0.5}
          // extraScroll={20}
          containerStyle={styles.actionSheetContainerStyle}
          indicatorColor="#949FB7">
          <ScrollView
            key={'scrollView'}
            style={styles.actionSheetScrollViewStyle}
            contentContainerStyle={styles.actionSheetScrollViewContainerStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                actionSheetMenuRef.current?.setModalVisible(false);
                this.setState({
                  selectedProductIds: [...this.state.productIds],
                });
              }}
              style={styles.actionSheetItemContainer}>
              <Text
                allowFontScaling={false}
                style={styles.actionSheetItemContainerText}>
                Select all
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                actionSheetMenuRef.current?.setModalVisible(false);
                this.editWishlist();
              }}
              style={styles.actionSheetItemContainer}>
              <Text
                allowFontScaling={false}
                style={styles.actionSheetItemContainerText}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={async () => {
                Alert.alert(
                  'Delete Whishlist',
                  'Are you sure to delete this wishlist?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      onPress: async () => {
                        actionSheetMenuRef.current?.setModalVisible(false);
                        await this.props.removeProduct(
                          this.state.selectedCard.wishlist_id,
                        );
                        this.props.showCards();
                      },
                    },
                  ],
                  {cancelable: false},
                );
              }}
              style={styles.actionSheetItemContainer}>
              <Text
                allowFontScaling={false}
                style={styles.actionSheetItemContainerText}>
                Delete
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ActionSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerButton: {
    marginLeft: wp('3%'),
    backgroundColor: '#25303C',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('4%'),
    borderRadius: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: '#25303C',
  },
  headerButtonText: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleText: {
    maxWidth: wp('60%'),
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
    color: '#484848',
  },
  headerTitleBadgeContainer: {
    marginHorizontal: wp('2%'),
    backgroundColor: '#25303C',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('2%'),
    paddingHorizontal: wp('3%'),
  },
  headerTitleBadgeText: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
    color: colors.white,
  },
  subHeaderText: {
    color: '#666666',
    marginTop: hp('.2'),
    fontWeight: '500',
    fontStyle: 'italic',
  },
  headerSideMenuContainer: {
    paddingVertical: hp('.5%'),
    paddingHorizontal: wp('1%'),
    borderRadius: hp('1%'),
    borderWidth: 1,
    borderColor: '#C4C4C4',
  },
  wishlistImageContainer: {
    width: wp('30%'),
    height: hp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: hp('1%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  wishlistImage: {
    width: wp('25%'),
    height: hp('10%'),
  },
  productCard: {
    marginTop: hp('2%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: hp('1%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#FAFAFA',
  },
  productCardFooterButton: {
    marginLeft: wp('3%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('.5%'),
    borderRadius: hp('1%'),
    backgroundColor: '#F3943D',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#37BE5F',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('.4%'),
    borderRadius: hp('1%'),
    marginEnd: wp('2%'),
  },
  productCardCheck: {
    flexDirection: 'column',
    position: 'absolute',
    right: wp('-2%'),
    top: hp('-.5%'),
  },
  deleteButton: {
    borderRadius: hp('3%'),
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: hp('4.5%'),
    height: hp('4.5%'),
    backgroundColor: '#FAEDEF',
  },
  actionSheetContainerStyle: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionSheetScrollViewStyle: {
    width: '100%',
    paddingBottom: hp('2%'),
    maxHeight: hp('30%'),
  },
  actionSheetScrollViewContainerStyle: {
    paddingBottom: 20,
  },
  actionSheetItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
    backgroundColor: '#F1F3F6',
    paddingVertical: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionSheetItemContainerText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: wp('4.5%'),
    color: '#25303C',
  },
});
