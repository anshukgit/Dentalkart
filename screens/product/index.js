import React, {Component, Fragment} from 'react';
import {
  Text,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
  Share as ShareRN,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import {Query} from 'react-apollo';
import {
  GET_PRODUCT_QUERY,
  ADD_TO_WISHLIST_QUERY,
  GET_PRODUCT_ATTACHMENTS_QUERY,
  FREQUENTLY_BOUGHT_TOGETHER,
  GET_GROUP_PRODUCT_QUERY,
} from './graphql';
import {GET_PRODUCT} from '../wishlist/graphql';
import {addToCart} from '@screens/cart';
import {newclient} from '@apolloClient';
import ProductAction from './modules/product_action';
import ProductImages from './modules/product_images';
import BulKQuote from './modules/bulk_quote';
import ProductSpecification from './modules/product_specification';
import ProductTabs from './modules/product_tabs';
import {ProductReviews} from '@screens/reviews';
import tokenClass from '@helpers/token';
import {BASE_URL} from '@config/environment';
import {DentalkartContext} from '@dentalkartContext';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {
  showInfoMessage,
  showErrorMessage,
  showSuccessMessage,
} from '@helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';
import ImageViewer from 'react-native-image-zoom-viewer';
import getImageUrl from '@helpers/getImageUrl';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './product.style';
import sortByPosition from '@helpers/sort_by_position';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {productClick} from '../../helpers/sendData';
import {addToCartClick} from '../../helpers/sendData';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';
import copy from '../../assets/copy.png';
import {postRequest} from '@helpers/network';
import Clipboard from '@react-native-community/clipboard';
import Share, {Button} from 'react-native-share';

export default class ProductDetails extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      productQuantity: 1,
      productOptions: [],
      selectedGroupProducts: [],
      bulkModalVisible: false,
      bulkModalSoure: 0,
      payload: '',
      allActiveImages: [],
      showBigImage: false,
      showBigImageIndex: 0,
      frequentlyBoughtTogetherId: [],
      frequentDropDown: false,
      groupedProductData: {},
      isLoading: false,
      ShowDropDown: false,
      AanalaticsEvent: '',
      analyticsEventCalled: false,
      groupedProductPrice: '',
      groupedProductQuantity: '',
      shareReferModal: false,
      referralRecord: '',
    };
    this.product = null;
  }
  closeBulkModal = () => {
    this.setState({bulkModalVisible: false});
  };
  openBulkModal = source => {
    this.setState({bulkModalVisible: true, bulkModalSoure: source});
  };
  updateQuantity(qty, sku, type, productPrice) {
    AnalyticsEvents(
      'QUANTITY_UPDATE',
      qty > this.state.productQuantity
        ? 'pdp_increase_qty'
        : 'pdp_decrease_qty',
      {
        productName: this.product?.name,
        productId: this.product?.id,
        prev_qty: this.state.productQuantity,
        curr_qty: qty,
      },
    );
    if (type === 'grouped') {
      this.setState({
        groupedProductQuantity: qty,
        groupedProductPrice: productPrice,
      });
      this.setSelectedGroupProducts(qty, sku, type);
    } else {
      this.setState({
        productQuantity: qty,
      });
    }
  }
  setSelectedGroupProducts(qty, sku, type) {
    let selectedProducts = this.state.selectedGroupProducts.filter(
      product => product.data.sku != sku,
    );
    if (parseFloat(qty) > 0) {
      selectedProducts.push({
        data: {
          sku: sku,
          quantity: parseFloat(qty),
          parent_id: this.product.id,
        },
      });
    }
    this.setState({selectedGroupProducts: selectedProducts});
  }
  setProductOptions = options => {
    let productOptions = [];
    Object.keys(options).map(item => {
      options[item].map(innerItem => {
        productOptions.push({
          id: innerItem.id,
          value: innerItem.value,
          quantity: 1,
        });
      });
    });
    this.setState({productOptions});
  };
  setConfigurableProductOptions = (options, payload) => {
    let productOptions = [];
    Object.keys(options).map(item => {
      options[item].map(innerItem => {
        productOptions.push({
          id: innerItem.id,
          value: innerItem.value,
          quantity: 1,
        });
        return null;
      });
      return null;
    });
    this.setState({productOptions: productOptions, payload: payload});
  };
  getProductUrl() {
    const {navigation, urlKey} = this.props;
    let productUrl = '';
    if (urlKey) {
      let urlSub = urlKey.replace('.html', '');
      if (urlSub.charAt(0) === '/') {
        urlSub = urlSub.slice(1);
      }
      productUrl = urlSub;
    } else {
      productUrl = navigation.getParam('productUrl');
    }
    return productUrl;
  }
  async addToWishlist(id, sku) {
    let isLoggedIn = await tokenClass.loginStatus();
    let productUrl = this.getProductUrl();
    console.warn('product url specifiction === > ', productUrl, id);
    if (!isLoggedIn) {
      this.props.navigation.navigate('Login', {
        screen: 'ProductDetails',
        params: {productUrl: productUrl, productId: id},
      });
    } else {
      try {
        const data = await newclient.mutate({
          mutation: ADD_TO_WISHLIST_QUERY,
          variables: {product_ids: [id]},
          fetchPolicy: 'no-cache',
        });
        AnalyticsEvents('ADDED_TO_WHISHLIST', 'Addtowishlist', this.product);
        return showSuccessMessage('Added to Wishlist');
      } catch (err) {
        console.log(err);
      }
    }
  }
  async addToCartPress() {
    const {selectedGroupProducts, productQuantity, productOptions, payload} =
      this.state;
    console.log('this.product====================', this.product);
    this.product.qty = parseFloat(productQuantity);

    if (this.product.type_id === 'grouped') {
      if (selectedGroupProducts.length > 0) {
        this.product.options = selectedGroupProducts;
      } else {
        return showErrorMessage('Select a product');
      }
    } else if (this.product.type_id === 'bundle') {
      if (productOptions.length > 0) {
        this.product.options = productOptions;
      } else {
        return showErrorMessage('Select a product configuration');
      }
    } else if (this.product.type_id === 'configurable') {
      if (payload && productOptions.length > 0) {
        const attributeCodesArray = productOptions.map(data => {
          const Getobj = payload.item.configurable_options.find(
            item => item.attribute_id === data.id.toString(),
          );
          return {
            attribute_code: Getobj.attribute_code,
            value: data.value,
          };
        });

        const getChildSku = payload.item.variants.filter((data, index) => {
          let HasValue = attributeCodesArray.map(
            item => data.product[item.attribute_code] === parseInt(item.value),
          );
          const AllConditionSatisfied = HasValue.every(value => value === true);
          if (AllConditionSatisfied) {
            return data.product;
          }
        });
        this.product.childSku = getChildSku[0].product.sku;
      } else {
        showErrorMessage('You need to choose options for your product.');
      }
    } else {
      if (productQuantity === 0) {
        return showErrorMessage('Select a product quantity');
      }
    }
    const {userInfo} = this.context;

    let data = {
      origin_page: 'product',
      landing_page: 'cart',
      section: '',
      position: '',
      customer_id:
        userInfo && userInfo.getCustomer ? userInfo.getCustomer.email : null,
      created_at: new Date(),
      product_id: this?.product?.id,
    };
    addToCartClick(data);
    const result = await addToCart(this.product, this.context);
    this.context.getUserInfo();
    return result;
  }
  async buyNowPress() {
    const result = await this.addToCartPress();
    console.log('buyNowPress result=======1', result);
    if (result) {
      AnalyticsEvents('BUY_NOW', 'Buy now', {
        ...this.product,
        productQuantity: this.state.productQuantity,
      });
      setTimeout(() => {
        this.props.navigation.navigate('Cart');
      }, 2000);
    }
  }
  async canAddReview() {
    let productUrl = this.getProductUrl();
    let isLoggedIn = await tokenClass.loginStatus();
    if (isLoggedIn) {
      return this.props.navigation.navigate('Reviews', {
        productId: this.product.id,
        groupedProductData: this.state.groupedProductData,
        type_id: this.product.type_id,
      });
    } else {
      // navigation.navigate('UrlResolver', {url_key: product.url_key});
      this.props.navigation.navigate('Login', {
        screen: 'UrlResolver',
        params: {url_key: productUrl},
      });
    }
  }
  share(product) {
    ShareRN.share(
      {
        message: `Check this out ${product.name} ${BASE_URL}${product.url_key}.html`,
      },
      {
        dialogTitle: 'ShareRN on ..',
        tintColor: 'green',
      },
    ).catch(err => console.log(err));
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    const {navigation, urlKey} = this.props;
    let {params} = navigation.state;
    const entry = params ? params.entry : false;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Product: ${urlKey}`,
      entry,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    console.log(
      'referralCode:===',
      this.props?.referralCode,
      this.props?.referType,
    );
    this.triggerScreenEvent();
  }

  analyticsEvent = products => {
    AnalyticsEvents('PRODUCT_SCREEN', 'productviewed', products);
  };

  onImagePress = index => {
    this.setState({
      showBigImage: true,
      showBigImageIndex: index,
    });
  };

  sliderImageData = data => {
    let activeEntries = data.filter(
      entry => !entry.disabled && entry.media_type === 'image',
    );
    activeEntries = sortByPosition(activeEntries);
    if (this.state.allActiveImages.length !== activeEntries.length) {
      let newData = [];
      activeEntries.map(item => {
        let data = {
          url: getImageUrl(item.file),
        };
        newData.push(data);
      });
      this.setState({
        allActiveImages: newData,
      });
    }
  };

  getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  downloadFile = (title, url) => {
    const productName = this.product?.name || 'product';
    const {fs, android, ios} = RNFetchBlob;
    // File URL which we want to download
    // let FILE_URL = this.state.invoiceLink;
    // Function to get extention of the file url
    this.setState({isLoading: true});
    let file_ext = this.getFileExtention(url);

    file_ext = '.' + file_ext[0];
    const downloadPath = `${
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir
    }/${productName.replace(' ', '_').replace('%', '')}${file_ext}`;
    RNFetchBlob.fs
      .exists(downloadPath)
      .then(exist => {
        if (exist) {
          this.setState({isLoading: false});
          setTimeout(() => {
            FileViewer.open(downloadPath);
          }, 1000);
        } else {
          RNFetchBlob.config({
            path: downloadPath,
            addAndroidDownloads: {
              path: downloadPath,
              useDownloadManager: true,
              title: `${productName}${file_ext}`,
              description: title + ' file download complete.',
              mime: 'application/pdf',
              mediaScannable: true,
              notification: true,
            },
          })
            .fetch('GET', url)
            .then(res => {
              this.setState({isLoading: false});
              showSuccessMessage(`${title} file Saved in downloads.`);
              setTimeout(() => {
                FileViewer.open(res.path());
              }, 1000);
            });
        }
      })
      .catch(e => {
        this.setState({isLoading: false});
        console.log('file check error ===', e);
      });
  };

  getReferralRecord = async (sku, url_key) => {
    let isLoggedIn = await tokenClass.loginStatus();
    console.log('url_key=======111111111', url_key);
    if (!isLoggedIn) {
      showInfoMessage('Login First.');
      return this.props.navigation.navigate('Login', {
        screen: 'UrlResolver',
        params: {url_key: url_key},
      });
    }
    this.setState({shareReferModal: true});
    let res = await postRequest(
      // 'https://referral-staging.dentalkart.com/rewards/referral-record',
      // 'https://referral-prod.dentalkart.com/rewards/referral-record',
      'https://referral-prod.dentalkart.com/rewards/referral-record',
      {
        product_sku: sku,
        refer_type: 'PRODUCT',
        url_key: url_key,
      },
      {
        'x-api-key': 'XUQVEomDnXBI5IaZabnujPkbS1rpPlSseG',
      },
    );
    let result = await res.json();
    console.log('referralRecord==referralRecord', result);
    this.setState({referralRecord: result});
  };

  copyToClipboard = data => {
    Clipboard.setString(data);
    ToastAndroid.show('Copied !', ToastAndroid.SHORT);
  };

  referralShare = async (url, socialName) => {
    // console.log('url===url==', url);
    // console.log('socialName===socialName==', socialName);
    try {
      const shareResponse = await Share.shareSingle({
        url: url,
        social: socialName,
      });
      console.log('shareResponse===!shareResponse', shareResponse);
    } catch (error) {
      ToastAndroid.show(
        'This App is not installed in your phone !',
        ToastAndroid.SHORT,
      );
      console.log('catch===referralShare=referralShare', error);
    }
  };

  attachmentView = (product, skuId) => {
    return (
      <Query
        query={GET_PRODUCT_ATTACHMENTS_QUERY}
        variables={{sku: skuId}}
        client={newclient}
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({data, loading, error}) => {
          if (data?.GetAttributesBySku) {
            return (
              <>
                <ProductImages
                  _this={this}
                  image={product.image_url}
                  gallery={product.media_gallery_entries}
                  onImagePress={data => this.onImagePress(data)}
                  tags={data?.GetAttributesBySku?.tags}
                />

                {product.type_id !== 'grouped' && (
                  <TouchableOpacity
                    onPress={() => {
                      this.getReferralRecord(skuId, product?.url_key);
                    }}
                    style={{
                      position: 'absolute',
                      tintColor: 'black',
                      right: 10,
                      top: 10,
                      width: 80,
                      height: 40,
                    }}>
                    <Image
                      source={require('../../assets/referAndEarn.png')}
                      style={{
                        resizeMode: 'contain',
                        width: 80,
                        height: 30,
                      }}
                    />
                  </TouchableOpacity>
                )}
                {data?.GetAttributesBySku?.attachments.map(item => (
                  <View style={styles.attachmentsContainer}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => this.downloadFile(item.title, item?.url)}
                      style={styles.attachmentsBoxContainer}>
                      <Image
                        source={{uri: item?.thumbnail}}
                        style={{width: 20, height: 20}}
                      />
                      <Text style={styles.attachmentsTitleText}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <Modal
                  visible={this.state.shareReferModal}
                  // visible={true}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() =>
                    this.setState({shareReferModal: false})
                  }>
                  <View style={styles.shareReferModalView}>
                    <View style={styles.shareReferModalContainer}>
                      <View style={styles.shareTitle}>
                        <Text style={styles.shareTitleText}>
                          Share this product with your friend and get reward
                          coins.
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({shareReferModal: false})
                          }>
                          <Image
                            // source={require('../../../../../../assets/close.png')}
                            source={require('../../assets/close.png')}
                            style={styles.shareModalCloseIcon}
                          />
                        </TouchableOpacity>
                      </View>

                      <Pressable
                        disabled={!!!this.state.referralRecord?.onelink_url}
                        onPress={() =>
                          this.copyToClipboard(
                            this.state.referralRecord?.onelink_url,
                          )
                        }
                        style={styles.referLinkView}>
                        <Text style={styles.referLink}>
                          {this.state.referralRecord?.onelink_url?.length > 36
                            ? this.state.referralRecord?.onelink_url?.substr(
                                0,
                                36,
                              ) + '...'
                            : this.state.referralRecord?.onelink_url?.substr(
                                0,
                                36,
                              )}
                        </Text>
                        {!!this.state.referralRecord?.onelink_url ? (
                          <Image style={styles.copyImg} source={copy} />
                        ) : (
                          <ActivityIndicator size="small" />
                        )}
                      </Pressable>

                      <View style={styles.socialIconsView}>
                        {/* <Image
                          style={styles.customImportedIcon}
                          source={require('../../assets/whatsapp.png')}
                        /> */}
                        <TouchableOpacity
                          onPress={() =>
                            this.referralShare(
                              this.state.referralRecord?.onelink_url,
                              Share.Social.WHATSAPP,
                            )
                          }>
                          <Icon
                            size={27}
                            style={styles.socialIcons}
                            name="whatsapp"
                            type="Feather"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            this.referralShare(
                              this.state.referralRecord?.onelink_url,
                              Share.Social.TWITTER,
                            )
                          }>
                          <Icon
                            size={27}
                            style={styles.socialIcons}
                            name="twitter"
                            type="Feather"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            this.referralShare(
                              this.state.referralRecord?.onelink_url,
                              Share.Social.INSTAGRAM,
                            )
                          }>
                          <Icon
                            size={27}
                            style={styles.socialIcons}
                            name="instagram"
                            type="Feather"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            this.referralShare(
                              this.state.referralRecord?.onelink_url,
                              Share.Social.PINTEREST,
                            )
                          }>
                          <Icon
                            size={27}
                            style={styles.socialIcons}
                            name="pinterest"
                            type="MaterialCommunityIcons"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            this.referralShare(
                              this.state.referralRecord?.onelink_url,
                              Share.Social.LINKEDIN,
                            )
                          }>
                          <Icon
                            size={27}
                            style={styles.socialIcons}
                            name="linkedin"
                            type="Feather"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            this.referralShare(
                              this.state.referralRecord?.onelink_url,
                              Share.Social.FACEBOOK,
                            )
                          }>
                          <Icon
                            size={27}
                            style={styles.socialIcons}
                            name="facebook"
                            type="Feather"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>
            );
          } else {
            return (
              <ProductImages
                _this={this}
                image={product.image_url}
                gallery={product.media_gallery_entries}
                onImagePress={data => this.onImagePress(data)}
              />
            );
          }
        }}
      </Query>
    );
  };

  frequentAddToCart = async (item = []) => {
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
    } else {
      showErrorMessage(
        groupedType
          ? 'This product has variants, please select specific product to be added in cart on detail page'
          : 'Something went wrong',
      );
      return;
    }
  };

  frequentlyBought = id => {
    return (
      <Query
        query={FREQUENTLY_BOUGHT_TOGETHER}
        variables={{id: id}}
        client={newclient}
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({data, loading, error}) => {
          if (loading || error) {
            return null;
          }
          if (
            data &&
            data?.frequentlyBoughtTogether &&
            data?.frequentlyBoughtTogether?.related !== null &&
            data?.frequentlyBoughtTogether?.related?.length
          ) {
            let productIdArray = [];
            productIdArray.push(this.product?.id);
            data?.frequentlyBoughtTogether?.related.map(item =>
              productIdArray.push(item.id),
            );
            return (
              <Query
                query={GET_PRODUCT}
                client={newclient}
                fetchPolicy="network-only"
                variables={{id: productIdArray.splice(0, 3)}}>
                {({loading, error, data}) => {
                  if (loading || error) {
                    return null;
                  }
                  if (
                    data &&
                    data?.productData &&
                    data?.productData !== null &&
                    data.productData.length &&
                    data.productData.length >= 2
                  ) {
                    let totalAmount = 0;
                    let currency = '';
                    let count = 0;
                    let productData = [];
                    return (
                      <>
                        <View style={styles.frequentHeadingContainer}>
                          <Text style={styles.frequentHeadingText}>
                            Frequently bought together
                          </Text>
                        </View>
                        <View style={styles.allItemsContainer}>
                          {
                            <View style={styles.itemContainer}>
                              <View style={styles.frequentAllImageContainer}>
                                {data?.productData.map((item, index) => {
                                  return (
                                    <>
                                      <View
                                        style={{
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <Image
                                          resizeMethod={'resize'}
                                          source={{
                                            uri: getImageUrl(item.image_url),
                                          }}
                                          resizeMode="contain"
                                          style={{
                                            width: widthPercentageToDP('15%'),
                                            height: heightPercentageToDP('8%'),
                                          }}
                                        />
                                        <Text
                                          style={[
                                            styles.mainPriceText,
                                            {marginRight: 0, fontWeight: '600'},
                                          ]}>
                                          {
                                            item.price.minimalPrice.amount
                                              .currency_symbol
                                          }
                                          {item.price.minimalPrice.amount.value}
                                        </Text>
                                      </View>
                                      {data?.productData.length - 1 !==
                                        index && (
                                        <Ionicons
                                          size={30}
                                          name="md-add"
                                          style={{marginHorizontal: 10}}
                                        />
                                      )}
                                    </>
                                  );
                                })}
                              </View>
                              <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() =>
                                  this.setState({
                                    frequentDropDown:
                                      !this.state.frequentDropDown,
                                  })
                                }
                                style={
                                  styles.frequentAllImageDropDownContainer
                                }>
                                <Ionicons
                                  size={30}
                                  name="chevron-down-sharp"
                                  style={{color: '#2b79ac'}}
                                />
                              </TouchableOpacity>
                            </View>
                          }
                          {data?.productData.map(item => {
                            if (
                              !this.state.frequentlyBoughtTogetherId.includes(
                                item.id,
                              )
                            ) {
                              productData.push(item);
                              totalAmount += item?.price?.minimalPrice?.amount
                                ?.value
                                ? item?.price?.minimalPrice?.amount?.value
                                : 0;
                              currency =
                                item?.price?.minimalPrice?.amount
                                  .currency_symbol;
                              count++;
                            }
                            if (this.state.frequentDropDown) {
                              return (
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={() => {
                                    const {userInfo} = this.context;
                                    let data = {
                                      customer_id: userInfo?.getCustomer.email
                                        ? userInfo?.getCustomer.email
                                        : null,
                                      origin_page: 'product',
                                      landing_page: 'product',
                                      section: null,
                                      position: '',
                                      product_id: item?.id,
                                    };
                                    productClick(data);
                                    this.props.navigation.push(
                                      'ProductDetails',
                                      {
                                        productId: item?.id,
                                        productUrl: item.url_key,
                                      },
                                    );
                                  }}
                                  style={styles.itemContainer}>
                                  <View>
                                    <Image
                                      resizeMethod={'resize'}
                                      source={{
                                        uri: getImageUrl(item.image_url),
                                      }}
                                      resizeMode="contain"
                                      style={styles.itemImage}
                                    />
                                  </View>
                                  <View style={styles.itemDescriptionContainer}>
                                    <Text
                                      style={styles.headerText}
                                      numberOfLines={1}>
                                      {item?.name.trim()}
                                    </Text>
                                    {item?.short_description && (
                                      <Text
                                        style={styles.descreptionText}
                                        numberOfLines={1}>
                                        {item?.short_description.trim()}
                                      </Text>
                                    )}
                                    {item.average_rating &&
                                    item.rating_count > 0 ? (
                                      <View style={styles.reviewsWrapper}>
                                        <View style={styles.ratingBoxWrapper}>
                                          <Text
                                            allowFontScaling={false}
                                            style={styles.ratingBox}>
                                            {parseFloat(
                                              item.average_rating,
                                            ).toFixed(1)}
                                          </Text>
                                          <MCIcon
                                            name="star"
                                            style={styles.ratingBoxIcon}
                                          />
                                        </View>
                                        <Text
                                          allowFontScaling={false}
                                          style={styles.reviewsQty}>
                                          ({item.rating_count + ' reviews'})
                                        </Text>
                                      </View>
                                    ) : (
                                      false
                                    )}
                                    <View style={{flexDirection: 'row'}}>
                                      {item.price.regularPrice.amount.value >
                                      item.price.minimalPrice.amount.value ? (
                                        <Text
                                          allowFontScaling={false}
                                          style={styles.cutPrice}>
                                          {
                                            item.price.regularPrice.amount
                                              .currency_symbol
                                          }
                                          {item.price.regularPrice.amount.value}
                                        </Text>
                                      ) : null}
                                      <Text style={styles.mainPriceText}>
                                        {
                                          item.price.minimalPrice.amount
                                            .currency_symbol
                                        }
                                        {item.price.minimalPrice.amount.value}
                                      </Text>
                                      {item.price.regularPrice.amount.value >
                                      item.price.minimalPrice.amount.value ? (
                                        <Text
                                          allowFontScaling={false}
                                          style={styles.precentageText}>
                                          {(
                                            100 -
                                            (item.price.minimalPrice.amount
                                              .value *
                                              100) /
                                              item.price.regularPrice.amount
                                                .value
                                          ).toFixed(2)}
                                          %Off
                                        </Text>
                                      ) : null}
                                    </View>
                                  </View>
                                  {item.id !== this.product?.id ? (
                                    <TouchableOpacity
                                      activeOpacity={0.5}
                                      onPress={() => {
                                        let index =
                                          this.state.frequentlyBoughtTogetherId.indexOf(
                                            item.id,
                                          );
                                        if (
                                          this.state.frequentlyBoughtTogetherId.indexOf(
                                            item.id,
                                          ) !== -1
                                        ) {
                                          let newArray = [
                                            ...this.state
                                              .frequentlyBoughtTogetherId,
                                          ];
                                          newArray.splice(index, 1);
                                          this.setState({
                                            frequentlyBoughtTogetherId:
                                              newArray,
                                          });
                                        } else {
                                          let newArray = [
                                            ...this.state
                                              .frequentlyBoughtTogetherId,
                                          ];
                                          newArray.push(item.id);
                                          this.setState({
                                            frequentlyBoughtTogetherId:
                                              newArray,
                                          });
                                        }
                                      }}
                                      style={styles.checkboxContainer}>
                                      {this.state.frequentlyBoughtTogetherId.includes(
                                        item.id,
                                      ) ? (
                                        <MCIcon
                                          size={25}
                                          name="checkbox-blank-outline"
                                        />
                                      ) : (
                                        <Ionicons
                                          size={25}
                                          name="ios-checkbox-outline"
                                          style={{color: '#1abf46'}}
                                        />
                                      )}
                                    </TouchableOpacity>
                                  ) : null}
                                </TouchableOpacity>
                              );
                            } else {
                              return null;
                            }
                          })}
                          {count > 1 && (
                            <View
                              style={[
                                styles.itemContainer,
                                styles.frequentPriceContainer,
                              ]}>
                              <Text style={styles.frequentTotalText}>
                                Total - {currency}
                                {totalAmount}
                              </Text>
                              <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() =>
                                  this.frequentAddToCart(productData)
                                }
                                style={styles.frequentButtonContainer}>
                                <Text
                                  style={
                                    styles.frequentButtonText
                                  }>{`Add ${count} item to cart`}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                        <View style={styles.separator} />
                      </>
                    );
                  }
                  return null;
                }}
              </Query>
            );
          } else {
            return null;
          }
        }}
      </Query>
    );
  };

  getGroupedProductData = async id => {
    if (Object.keys(this.state.groupedProductData).length === 0) {
      const {data} = await newclient.query({
        query: GET_GROUP_PRODUCT_QUERY,
        fetchPolicy: 'network-only',
        variables: {id: id},
      });
      if (data && data.childProductV2) {
        this.setState({
          groupedProductData: data?.childProductV2,
        });
      }
    }
    return null;
  };

  render() {
    const {urlKey, productId, navigation} = this.props;
    const {userInfo, brands} = this.context;
    let navProductId = navigation.getParam('productId');
    let productUrl = this.getProductUrl();
    return (
      <Fragment>
        {!urlKey && (
          <HeaderComponent
            navigation={this.props.navigation}
            label={''}
            style={{height: 40}}
          />
        )}
        <Query
          query={GET_PRODUCT_QUERY}
          client={newclient}
          variables={{id: productId ? productId : navProductId}}
          fetchPolicy="cache-and-network"
          onCompleted={res => this.setState({AnalyticsEvents: res})}
          onError={error => {
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {({data, loading, error}) => {
            if (loading || this.state.isLoading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (data.productData) {
              const product = data.productData[0];
              this.product = product;

              if (!product) {
                return (
                  <View>
                    <Image
                      source={{
                        uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Error/err404.png',
                      }}
                      style={{width: '100%', height: '70%'}}
                      resizeMode={'contain'}
                    />
                    <Text
                      style={{textAlign: 'center'}}
                      allowFontScaling={false}>
                      Oops!! the page have been moved.
                    </Text>
                    <Text
                      style={{textAlign: 'center'}}
                      allowFontScaling={false}>
                      Go to our home page.
                    </Text>
                  </View>
                );
              }
              this.sliderImageData(product.media_gallery_entries);
              if (!this.state.analyticsEventCalled) {
                // Check if the function has been called
                this.analyticsEvent(product);
                this.setState({analyticsEventCalled: true}); // Update the flag
              }
              this.getGroupedProductData(product?.id);
              return (
                <View
                  style={{
                    flex: 1,
                  }}>
                  <ScrollView style={{flex: 1}}>
                    {/* <ProductImages
                      _this={this}
                      image={product.image.url}
                      gallery={product.media_gallery_entries}
                      onImagePress={(data) => this.onImagePress(data)}
                    /> */}
                    {this.attachmentView(product, product?.sku)}
                    <ProductSpecification
                      groupedProductData={this.state.groupedProductData}
                      product={product}
                      _this={this}
                      brand={brands}
                      productPrice={this.state.groupedProductPrice}
                      productPriceQty={this.state.groupedProductQuantity}
                    />
                    <ProductTabs
                      product={product}
                      navigation={this.props.navigation}
                    />
                    {product?.type_id !== 'grouped'
                      ? this.frequentlyBought(product?.id)
                      : null}
                    <BulKQuote
                      _this={this}
                      product={product}
                      closeBulkModal={this.closeBulkModal}
                      openBulkModal={this.openBulkModal}
                    />
                    <ProductReviews product={product} _this={this} />
                  </ScrollView>

                  <ProductAction
                    // disabled={
                    //   this.state?.groupedProductData?.items?.length > 0
                    //     ? !this.state.groupedProductData?.parent_stock_status
                    //     : false
                    // }
                    disabled={
                      this.state?.groupedProductData?.items?.length > 0 &&
                      product.type_id === 'grouped'
                        ? !this.state.groupedProductData.parent_stock_status
                        : product.type_id === 'simple'
                        ? !product.is_in_stock
                        : true
                    }
                    addToCartPress={() => this.addToCartPress()}
                    buyNowPress={() => this.buyNowPress()}
                    product={product}
                    openBulkModal={this.openBulkModal}
                  />
                </View>
              );
            } else {
              return null;
            }
          }}
        </Query>
        {this.state.allActiveImages.length && this.state.showBigImage ? (
          <Modal
            visible={this.state.showBigImage}
            transparent={true}
            onRequestClose={() => {
              this.setState({showBigImage: false});
            }}>
            <ImageViewer
              index={this.state.showBigImageIndex}
              backgroundColor={'#FFF'}
              imageUrls={this.state.allActiveImages}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.setState({showBigImage: false})}
              style={styles.closeIconContainer}>
              <Icon name={'close'} size={22} color={'#FFF'} />
            </TouchableOpacity>
          </Modal>
        ) : null}
      </Fragment>
    );
  }
}
