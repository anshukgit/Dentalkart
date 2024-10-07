import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import {GET_PRODUCT} from '../graphql';
import {Query} from 'react-apollo';
import {client2, newclient} from '@apolloClient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {productBaseUrl} from '@config/environment';
import {showErrorMessage} from '../../../helpers/show_messages';

let productData = [];
export default class WishlistsCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productIds: [],
      productData: [],
    };
  }

  componentDidMount = () => {
    if (this.props?.item) {
      let id = [];
      this.props.item?.products &&
        this.props.item?.products.map((product, index) => {
          index <= 3 && id.push(product.product_id);
        });
      this.setState({
        productIds: id,
      });
    }
  };

  render() {
    const {item, showPopUp, showWishListDetails} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => showWishListDetails()}
        style={styles.wishlistContainer}>
        <View>
          <View style={styles.wishlisTitle}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={{
                paddingStart: wp('2%'),
                fontSize: wp('5%'),
                fontWeight: 'bold',
                color: '#000',
              }}>
              {`${item.wishlist_name}`}
            </Text>
          </View>
        </View>
        <View style={styles.wishlistImagesContainer}>
          <Query
            query={GET_PRODUCT}
            client={newclient}
            fetchPolicy="cache-and-network"
            variables={{id: this.state.productIds}}>
            {({loading, error, data}) => {
              if (error || !data) {
                return (
                  <>
                    <View style={styles.wishlistImageContainer}>
                      <Image
                        source={{
                          uri: 'https://images.dentalkart.com/dentalkart-placeholder.png',
                        }}
                        style={styles.wishlistImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.wishlistImageContainer}>
                      <Image
                        source={{
                          uri: 'https://images.dentalkart.com/dentalkart-placeholder.png',
                        }}
                        style={styles.wishlistImage}
                        resizeMode="contain"
                      />
                    </View>
                  </>
                );
              }
              if (data && data.productData) {
                productData = data.productData;
                {
                  this.state.productData.length !== data.productData.length &&
                    this.setState({
                      productData: data.productData,
                    });
                }
                let productView = data.productData.map((product, index) => {
                  if (index > 1) {
                    return null;
                  }
                  return (
                    <View style={styles.wishlistImageContainer}>
                      <Image
                        source={
                          product?.image_url
                            ? {uri: productBaseUrl + product.image_url}
                            : {
                                uri: 'https://images.dentalkart.com/dentalkart-placeholder.png',
                              }
                        }
                        style={styles.wishlistImage}
                        resizeMode="contain"
                      />
                    </View>
                  );
                });
                return productView;
              }
              return null;
            }}
          </Query>
        </View>
        <View style={styles.wishlistBottomView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                this.state.productData.length
                  ? this.props.addToCart(this.state.productData)
                  : showErrorMessage('Empty wishlist!')
              }
              style={[
                styles.buttonStyle,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: '#757575',
                },
              ]}>
              <Text allowFontScaling={false} style={styles.headerButtonText}>
                {'Add to cart'}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', height: hp('4%')}}>
              <View
                style={{
                  justifyContent: 'center',
                  borderRightWidth: 2,
                  borderColor: colors.white,
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => showPopUp('share', item)}
                  style={{
                    paddingHorizontal: wp('2.5%'),
                  }}>
                  <Icon
                    name={'ios-share-social-sharp'}
                    size={wp('7%')}
                    style={styles.wishlistBottomViewIcons}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  borderRightWidth: 2,
                  borderColor: colors.white,
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => showPopUp('edit', item)}
                  style={{
                    paddingHorizontal: wp('2.5%'),
                  }}>
                  <MaterialIcons
                    name={'edit'}
                    size={wp('7%')}
                    style={styles.wishlistBottomViewIcons}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => showPopUp('deleteList', item)}
                  style={{
                    paddingHorizontal: wp('2.5%'),
                  }}>
                  <MaterialIcons
                    name={'delete'}
                    size={wp('7%')}
                    style={styles.wishlistBottomViewIcons}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  headerButtonText: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  buttonStyle: {
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.2%'),
    borderRadius: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
  wishlistContainer: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: hp('1%'),
    borderColor: '#ccc',
    width: wp('95%'),
    marginTop: hp('1.5%'),
    backgroundColor: '#fff',
  },
  wishlistImagesContainer: {
    paddingTop: hp('2%'),
    borderRadius: hp('2%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: hp('7%'),
  },
  wishlistImageContainer: {
    marginStart: wp('5%'),
    width: wp('40%'),
    height: hp('16%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: hp('2%'),
    borderRadius: hp('2%'),
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  wishlistImage: {
    width: wp('40%'),
    height: hp('14%'),
  },
  wishlistBottomView: {
    bottom: 0,
    width: wp('94.5%'),
    position: 'absolute',
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    paddingStart: wp('3%'),
    borderBottomEndRadius: hp('.8%'),
    borderBottomLeftRadius: hp('.8%'),
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  wishlistBottomViewIcons: {
    color: '#757575',
  },
  wishlisTitle: {
    width: '100%',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderRadius: hp('1%'),
    paddingVertical: wp('2%'),
    backgroundColor: '#fff',
  },
});
