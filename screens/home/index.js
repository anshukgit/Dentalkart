import React, {PureComponent} from 'react';
import {
  Text,
  View,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  SafeAreaView,
  Button,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Query} from 'react-apollo';
import Header from '@components/header';
import HomepageSlider from './modules/homepageslider';
import HomepageBrands from './modules/homepagebrands';
import HomepageBanner from './modules/homepagebanner';
import HomepageCarousel from './modules/homepagecarousel';
import TopFeaturedBrands from './modules/TopFeaturedBrand';
import HomePageCategory from './modules/homepagecategory';
import {
  GET_CAROUSEL_PRODUCTS_QUERY,
  GET_NOTICES,
  GET_FEATURED_CATEGORY,
  HOME_PAGE_QUERY,
  GET_ALL_PROMOTION_PRODUCT,
} from './graphql';
import tokenClass from '@helpers/token';
import chunkify from '@helpers/chunkify';
import styles from './home.style';
import {SecondaryColor} from '@config/environment';
import {DentalkartContext} from '@dentalkartContext';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {showErrorMessage} from '../../helpers/show_messages';
import {newclient} from '@apolloClient';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';
import {Icon} from 'native-base';
import TextInputComponent from '../../components/TextInputComponent';
import LinearGradient from 'react-native-linear-gradient';
import ADD_PRODUCT_SUGGESTION_DETAILS from '../search/graphql/Product_suggestion.gql';
import {showSuccessMessage} from '@helpers/show_messages';
import colors from '../../config/colors';

import {
  client,
  freeGiftClient,
  promotionBySkuClient,
} from '../../apollo_client';
import {SearchPageStyle} from '../search/searchPageStyle';
import RenderHTML from 'react-native-render-html';
export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      homePageSlider: null,
      homepageCarousel: null,
      showSearchBar: false,
      modalVisible: false,
      productName: '',
      commentName: '',
      brandName: '',
      loading: false,
      searchValue: '',
      error: '',
      allPromotionProducts: '',
    };

    this.getHomePageData();
  }
  static contextType = DentalkartContext;

  getFeaturedCategory = () => {
    return (
      <Query
        query={GET_FEATURED_CATEGORY}
        fetchPolicy="cache-and-network"
        client={newclient}
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({loading, error = false, data}) => {
          if (data) {
            const {featuredCategory} = data;
            if (featuredCategory) {
              !this.state.showSearchBar && this.setState({showSearchBar: true});
              return (
                <View>
                  <HomePageCategory
                    navigation={this.props.navigation}
                    data={featuredCategory}
                  />
                </View>
              );
            } else return null;
          } else return null;
        }}
      </Query>
    );
  };

  getHomePageData = async () => {
    const data = await newclient.mutate({
      mutation: HOME_PAGE_QUERY,
    });
    this.setState({
      showSearchBar: true,
      homePageSlider: {
        gethomepagesliders: data.data.gethomepagesliders,
        gethomepagesalesbanner: data.data.gethomepagesalesbanner,
      },
      homepageCarousel: {
        gethomepagecarousel: data.data.gethomepagecarousel,
        gethomepagebannersv2: data.data.gethomepagebannersv2,
        gethomepagebrands: data.data.gethomepagebrands,
      },
    });
  };

  addProductSuggestion = async () => {
    if (this.state.productName) {
      this.setState({loading: true});
      const loginStatus = await tokenClass.loginStatus();
      const {userInfo} = this.context;
      const user = userInfo ? userInfo.getCustomer : {};
      try {
        const data = await client.mutate({
          mutation: ADD_PRODUCT_SUGGESTION_DETAILS,
          variables: {
            searched_key: this.state.searchValue,
            product_name: this.state.productName,
            brand: this.state.brandName,
            comment: this.state.commentName,
            user: loginStatus ? user?.email : 'guest_user',
          },
          fetchPolicy: 'no-cache',
        });
        this.setState({loading: false});
        if (data?.data) {
          this.handleCloseModal();
          showSuccessMessage('suggestion added successfully.');
          this.setState({error: ''});
          this.setState({brandName: ''});
          this.setState({comment: ''});
          this.setState({productName: ''});
        }
      } catch (err) {
        console.log(err);
        this.setState({loading: false});
      }
    } else {
      this.setState({error: 'Please enter Product Name'});
    }
  };

  handleCloseModal = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };

  scrollToTop = () => {
    this.scrollView.scrollTo({x: 0, y: 0, animated: true});
  };
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    const {navigation} = this.props;
    let {params} = navigation.state;
    const entry = params ? params.entry : false;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Home',
      entry,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  getHomePageNotices = () => {
    const {handleError} = this.context;
    return (
      <View>
        <Query
          query={GET_NOTICES}
          fetchPolicy="network-only"
          client={newclient}
          onError={error => handleError(error)}>
          {({loading, data, error}) => {
            if (loading || error) {
              return null;
            }
            if (data && data.notices) {
              const {notices} = data;
              const homepageNoticesAndroid = notices.filter(
                notice =>
                  notice.section === 'homepage' &&
                  notice.source === 'only_android',
              );
              const homepageNoticesIos = notices.filter(
                notice =>
                  notice.section === 'homepage' && notice.source === 'only_ios',
              );
              if (
                homepageNoticesAndroid.length > 0 ||
                homepageNoticesIos.length > 0
              ) {
                !this.state.showSearchBar &&
                  this.setState({showSearchBar: true});
                return (
                  <View>
                    {Platform.OS === 'ios' ? (
                      <View style={{margin: 6}}>
                        {homepageNoticesIos.map(notice => (
                          <TouchableOpacity
                            onPress={() =>
                              notice.link ? Linking.openURL(notice.link) : null
                            }
                            style={{
                              padding: 6,
                              backgroundColor: notice.background || '#fff',
                            }}>
                            {notice.content_type === 'html' ? (
                              <RenderHTML
                                source={{
                                  html: notice?.content,
                                }}
                                tagsStyles={styles.tags}
                              />
                            ) : (
                              <Text
                                allowFontScaling={false}
                                style={{
                                  color: notice.colour || SecondaryColor,
                                  backgroundColor: notice.background || '#fff',
                                }}>
                                {notice.content}
                              </Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <View style={{margin: 6}}>
                        {homepageNoticesAndroid.map(notice => (
                          <TouchableOpacity
                            onPress={() =>
                              notice.link ? Linking.openURL(notice.link) : null
                            }
                            style={{
                              padding: 6,
                              backgroundColor: notice.background || '#fff',
                            }}>
                            {notice.content_type === 'html' ? (
                              <RenderHTML
                                source={{
                                  html: notice?.content,
                                }}
                                tagsStyles={styles.tags}
                              />
                            ) : (
                              <Text
                                allowFontScaling={false}
                                style={{
                                  color: notice.colour || SecondaryColor,
                                }}>
                                {notice.content}
                              </Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          }}
        </Query>
      </View>
    );
  };

  getAllItemPromotionProducts = async () => {
    try {
      const {data} = await freeGiftClient.query({
        query: GET_ALL_PROMOTION_PRODUCT,
      });
      // console.log(
      //   'getAllItemPromotionProducts==getAllItemPromotionProducts',
      //   data,
      // );
      if (data?.getAllItemPromotionProducts) {
        this.setState({
          allPromotionProducts: data?.getAllItemPromotionProducts,
        });
      }
    } catch (error) {
      // showErrorMessage(`${error.message}. Please try again.`);
    }
  };
  componentDidMount() {
    this.getAllItemPromotionProducts();
    AnalyticsEvents('HOME_PAGE_VIEWED', 'Home Page viewed', {});
    this.triggerScreenEvent();
  }

  homePageSliderView = () => {
    if (
      this.state.homePageSlider?.gethomepagesliders &&
      this.state.homePageSlider?.gethomepagesalesbanner
    ) {
      return (
        <View>
          <HomepageSlider
            navigation={this.props.navigation}
            data={this.state.homePageSlider?.gethomepagesliders}
          />
        </View>
      );
    }
    return (
      <Image
        source={{
          uri: 'https://dentalkart-media.s3.ap-south-1.amazonaws.com/App/unnamed.gif',
        }}
        style={styles.noSliderImage}
      />
    );
  };

  homepageCarouselView = () => {
    const getAllCarouselSku = carousels => {
      const allSkus = [];
      carousels.map(carousel => {
        carousel.sku.map((sku, index) => {
          if (index < 4 && sku) {
            allSkus.push(sku);
          }
          return null;
        });
        return null;
      });
      return allSkus;
    };
    let data = this.state.homepageCarousel;
    if (
      data &&
      data.gethomepagecarousel &&
      data.gethomepagebannersv2 &&
      data.gethomepagebrands
    ) {
      const gethomepagebrands = data.gethomepagebrands;
      const bannersData = data.gethomepagebannersv2
        ? data.gethomepagebannersv2
        : [];
      const bannersGroup = chunkify(bannersData, 10, 3);
      const carouselData = data.gethomepagecarousel
        ? data.gethomepagecarousel
        : [];
      const skus = getAllCarouselSku(carouselData);
      return (
        <View>
          <Query
            query={GET_CAROUSEL_PRODUCTS_QUERY}
            client={newclient}
            fetchPolicy="cache-and-network"
            variables={{sku: skus, id: []}}>
            {({loading, error, data}) => {
              if (loading || error) {
                return (
                  <Image
                    source={{
                      uri: 'https://dentalkart-media.s3.ap-south-1.amazonaws.com/App/ezgif.com-crop+%281%29.gif',
                    }}
                    style={styles.noCarouselImage}
                  />
                );
              }
              if (data.productData) {
                const setProductsObj = () => {
                  const products = {};
                  data.productData.map(
                    product =>
                      (products[product.sku.toLowerCase().trim()] = product),
                  );
                  const getProduct = sku => products[sku.toLowerCase()];
                  return getProduct;
                };
                const getProduct = setProductsObj();
                const prsentation = [
                  {el: 'cr', index: 0},
                  {el: 'br', index: 0},

                  {el: 'cr', index: 1},
                  {el: 'bg', index: 0},

                  {el: 'cr', index: 2},
                  {el: 'bg', index: 1},

                  {el: 'cr', index: 3},
                  {el: 'bg', index: 2},

                  {el: 'cr', index: 4},
                  {el: 'bg', index: 3},

                  {el: 'cr', index: 5},
                  {el: 'bg', index: 4},

                  {el: 'cr', index: 6},
                  {el: 'bg', index: 5},

                  {el: 'cr', index: 7},
                  {el: 'bg', index: 6},

                  {el: 'cr', index: 8},
                  {el: 'bg', index: 7},

                  {el: 'cr', index: 9},
                  {el: 'bg', index: 8},

                  {el: 'bg', index: 9},
                ];
                const getElement = prsentation => {
                  const elementTypes = {
                    cr: carouselData[prsentation.item.index] ? (
                      <HomepageCarousel
                        navigation={this.props.navigation}
                        gridData={carouselData[prsentation.item.index]}
                        getProduct={getProduct}
                        allPromotionProducts={this.state.allPromotionProducts}
                      />
                    ) : null,
                    br: (
                      <HomepageBrands
                        data={gethomepagebrands}
                        navigation={this.props.navigation}
                      />
                    ),
                    bg: bannersGroup[prsentation.item.index] ? (
                      <HomepageBanner
                        navigation={this.props.navigation}
                        data={bannersGroup[prsentation.item.index]}
                      />
                    ) : null,
                  };
                  return elementTypes[prsentation.item.el];
                };
                return (
                  <View>
                    <FlatList
                      data={prsentation}
                      renderItem={(prsentation, index) =>
                        getElement(prsentation)
                      }
                      numColumns={1}
                      keyExtractor={(prsentation, index) => index.toString()}
                      initialNumToRender={4}
                    />
                  </View>
                );
              } else {
                return (
                  <Image
                    source={{
                      uri: 'https://dentalkart-media.s3.ap-south-1.amazonaws.com/App/ezgif.com-crop+%281%29.gif',
                    }}
                    style={styles.noCarouselImage}
                  />
                );
              }
            }}
          </Query>
        </View>
      );
    }
    return (
      <Image
        source={{
          uri: 'https://dentalkart-media.s3.ap-south-1.amazonaws.com/App/ezgif.com-crop+%281%29.gif',
        }}
        style={styles.noCarouselImage}
      />
    );
  };
  render() {
    // const {userInfo} = this.context;
    return (
      <View>
        <SafeAreaView>
          <Header
            menu
            cart
            title
            home
            hideSearch={true}
            showSearchBar={this.state.showSearchBar}
            navigation={this.props.navigation}
            scrollToTop={this.scrollToTop}
          />
        </SafeAreaView>
        <ScrollView ref={ref => (this.scrollView = ref)}>
          <View style={styles.scrollViewContainer}>
            {this.homePageSliderView()}
            {this.getHomePageNotices()}
            {this.getFeaturedCategory()}
            <TopFeaturedBrands navigation={this.props.navigation} />
            {this.homepageCarouselView()}
            <View style={{marginBottom: hp('10%'), alignSelf: 'center'}}>
              <Text style={styles.FindText}>
                Didn't find what you were looking for?
              </Text>
              <Text style={styles.FindTextSubHeading}>
                Let us know by filling details below.
              </Text>
              <View
                style={{
                  backgroundColor: '#f3943d',
                  marginTop: 10,
                  alignSelf: 'center',
                  borderRadius: 5,
                }}>
                <Button
                  title="SUGGEST A PRODUCT"
                  color={Platform.OS === 'ios' ? '#FFF' : '#f3943d'}
                  onPress={() => this.setState({modalVisible: true})}
                />
              </View>
            </View>
            {this.state.modalVisible ? (
              <Modal
                onRequestClose={() => this.setState({modalVisible: false})}
                visible={this.state.modalVisible}
                transparent={true}
                animationType="slide">
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  showsVerticalScrollIndicator={false}
                  style={{flex: 1}}>
                  <View style={SearchPageStyle.modalMainView}>
                    <View
                      style={{
                        flex: 1,
                      }}></View>
                    <View style={SearchPageStyle.addressModalView}>
                      <View
                        style={{
                          backgroundColor: 'white',
                          padding: 2,
                          width: 80,
                          height: 80,
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 40,
                          position: 'absolute',
                          alignSelf: 'center',
                          top: 0,
                        }}>
                        <View
                          style={[
                            {
                              alignSelf: 'center',
                              backgroundColor: '#FFF',
                              width: 75,
                              height: 75,
                              borderRadius: 50,
                              borderWidth: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor: '#6ACADD',
                              position: 'absolute',
                            },
                          ]}>
                          <Image
                            source={require('../../assets/findIcon.png')}
                            style={{
                              height: 100,
                              width: 100,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                      <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={['#6ACADD', '#B5D784']}
                        style={SearchPageStyle.modalHeaderView}>
                        {/* <View> */}
                        <View
                          style={{
                            marginTop: 45,
                            justifyContent: 'center',
                            paddingVertical: 4,
                          }}>
                          <Text
                            allowFontScaling={false}
                            style={[SearchPageStyle.headerText]}>
                            Suggest Product
                          </Text>
                        </View>
                        {/* </View> */}

                        <Pressable
                          style={styles.closeIconView}
                          onPress={this.handleCloseModal}>
                          <Icon
                            name={'closecircleo'}
                            type={'AntDesign'}
                            style={styles.closeIcon}
                          />
                        </Pressable>
                      </LinearGradient>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          backgroundColor: colors.white,
                        }}>
                        <Text style={SearchPageStyle.textStyle}>
                          Didn't find what you are looking for? Let us know by
                          filling in details below
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            borderRadius: 30,
                            alignItems: 'center',
                            marginVertical: 10,
                            borderWidth: 1,
                            borderColor: colors.LightGray,
                          }}>
                          <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={{
                              width: 60,
                              height: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderTopLeftRadius: 26,
                              borderBottomLeftRadius: 26,
                            }}
                            colors={['#6ACADD', '#B5D784']}>
                            <Image
                              style={{width: 30, height: 30}}
                              source={require('../../assets/Product_icon.png')}
                            />
                          </LinearGradient>

                          <TextInputComponent
                            style={{marginLeft: 10}}
                            placeholder="Product Name"
                            keyboardType="text"
                            defaultValue={this.state.productName}
                            onChangeText={value => {
                              this.setState({productName: value});
                              this.setState({error: ''});
                            }}
                          />
                        </View>
                        {!!this.state.error && (
                          <Text style={{color: colors.red}}>
                            {this.state.error}
                          </Text>
                        )}
                        <View
                          style={{
                            flexDirection: 'row',
                            borderRadius: 30,
                            alignItems: 'center',
                            marginVertical: 10,
                            borderWidth: 1,
                            borderColor: colors.LightGray,
                          }}>
                          <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={{
                              width: 60,
                              height: 50,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderTopLeftRadius: 26,
                              borderBottomLeftRadius: 26,
                            }}
                            colors={['#6ACADD', '#B5D784']}>
                            <Image
                              style={{width: 50, height: 50}}
                              source={require('../../assets/Brand_icon.png')}
                            />
                          </LinearGradient>
                          <TextInputComponent
                            style={{marginLeft: 10}}
                            placeholder="Brand Name (Optional)"
                            keyboardType="text"
                            defaultValue={this.state.brandName}
                            onChangeText={value =>
                              this.setState({brandName: value})
                            }
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            borderRadius: 50,
                            alignItems: 'center',
                            marginVertical: 10,
                            paddingLeft: 60,
                            borderWidth: 1,
                            borderColor: colors.LightGray,
                          }}>
                          <TextInputComponent
                            placeholder="Comment (Optional)"
                            multiline={true}
                            numberOfLines={2}
                            keyboardType="text"
                            defaultValue={this.state.commentName}
                            onChangeText={value =>
                              this.setState({commentName: value})
                            }
                          />
                        </View>
                        <TouchableOpacity
                          style={{
                            paddingBottom:
                              Platform.OS === 'ios' ? hp('3%') : hp('4%'),
                          }}
                          onPress={() => {
                            !this.state.loading
                              ? this.addProductSuggestion()
                              : null;
                          }}>
                          <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            colors={['#6ACADD', '#B5D784']}
                            style={SearchPageStyle.submitBtn}>
                            {this.state.loading ? (
                              <ActivityIndicator
                                size="small"
                                transparent={true}
                              />
                            ) : (
                              <Text
                                style={{
                                  color: 'white',
                                  textAlign: 'center',
                                  fontSize: 15,
                                }}>
                                Submit
                              </Text>
                            )}
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
            ) : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}
