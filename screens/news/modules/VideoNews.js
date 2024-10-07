import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  Dimensions,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import getRequest from '@helpers/get_request';
import {postRequest} from '@helpers/network';
import VideoPlayer from '@components/videoPlayer';
import Constants from '@config/constants';
import RBSheet from 'react-native-raw-bottom-sheet';
import {DentalkartContext} from '@dentalkartContext';
import {showInfoMessage, showErrorMessage} from '@helpers/show_messages';
import Share from 'react-native-share';
import moment from 'moment/moment';
// import FastImage from 'react-native-fast-image';
import {GET_PRODUCT_QUERY} from '../../product/graphql';
import {newclient} from '@apolloClient';
import {withNavigationFocus} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

const PRODUCT_IMAGE_URL = 'https://images.dentalkart.com/media/catalog/product';

const VideoNews = props => {
  const context = useContext(DentalkartContext);
  const referredVideoId = props.navigation?.state?.params?.videoId;
  const source = props.navigation?.state?.params?.source;
  const {userInfo} = context;
  const refRBSheet = useRef([]);
  const refRBProductSheet = useRef([]);
  const navigation = props.navigation;
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(null);
  const [reelsData, setReelsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentsData, setCommentsData] = useState([]);
  const [currentVideoData, setCurrentVideoData] = useState(null);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [featuredProductLoading, setFeaturedProductLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastProgress, setLastProgress] = useState(0);
  const [getProductData, setGetProductData] = useState([]);
  const isFocused = navigation.isFocused();

  // type videoPlaySource = 'SCROLL' | 'THUMBNAIL' | 'RECOMMENDED' | 'SEARCH';

  const VideosApi = useCallback(
    async (withLoader = true) => {
      setLoading(withLoader);
      let res = await getRequest(
        `${Constants.FEEDS_API_BASE_URL}/feeds?order=desc`,
      );
      let multimediaData = await res.json();
      if (multimediaData.status === 'success') {
        const videoIndex = multimediaData.data.rows.findIndex(
          data => data.id == referredVideoId,
        );
        if (videoIndex > -1) {
          setCurrentIndex(videoIndex);
        }
        // console.log('settingReels====data', JSON.stringify(multimediaData));
        setReelsData(multimediaData.data.rows);
      }
      setLoading(false);
    },
    [referredVideoId],
  );
  const GetCommentsApi = async videoId => {
    let res = await getRequest(
      `${Constants.FEEDS_API_BASE_URL}/feeds-action/comments?video_id=${videoId}`,
    );
    let commentsData = await res.json();
    if (commentsData.status === 'success') {
      setCommentsData(commentsData.data.rows);
    }
  };

  useEffect(() => {
    VideosApi();
  }, [VideosApi]);
  const baseOptions = {
    vertical: true,
    width: width,
    height: height,
  };

  const getStreamVideo = useCallback(async () => {
    const videoId = reelsData[currentIndex].id;
    let res = await getRequest(
      `${Constants.FEEDS_API_BASE_URL}/feeds/${videoId}`,
    );
    let videoData = await res.json();
    if (videoData.status === 'success') {
      // console.log(videoData.data);
      setCurrentVideoData(videoData.data);
    }
  }, [setCurrentVideoData, currentIndex, reelsData]);

  const AddLikeApi = useCallback(
    async videoId => {
      let res = await postRequest(
        `${Constants.FEEDS_API_BASE_URL}/feeds-action/like`,
        {
          video_id: videoId,
        },
      );
      const response = await res.json();
      if (response.status === 'success') {
        getStreamVideo(videoId);
      }
    },
    [getStreamVideo],
  );
  const AddCommentApi = useCallback(
    async (videoId, comment) => {
      setComment('');
      let res = await postRequest(
        `${Constants.FEEDS_API_BASE_URL}/feeds-action/comment`,
        {
          video_id: videoId,
          comment: comment,
        },
      );
      const response = await res.json();

      if (response.status === 'success') {
        GetCommentsApi(videoId);
        getStreamVideo(videoId);
      }
    },
    [getStreamVideo],
  );

  const renderCommentItem = useCallback(({item}) => {
    return (
      <View style={[styles.continuer]}>
        <View style={{marginLeft: 4}}>
          <Text style={styles.userNameText}>{item.customer_name}</Text>
          <Text style={styles.commentDate}>
            {moment(item.created_at).format('MMM DD, YYYY hh:mm a')}
          </Text>
          <Text style={styles.comments}>{item.comment}</Text>
        </View>
      </View>
    );
  }, []);

  const shareVideo = useCallback(item => {
    const options = {
      title: item.title,
      url: `${Constants.FEEDS_API_BASE_URL}/feeds/${item.id}`,
      type: 'video/mp4',
    };
    Share.open(options)
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        showErrorMessage(err);
      });
  }, []);

  useEffect(() => {
    getStreamVideo();
  }, [getStreamVideo]);

  const splitData = useMemo(() => {
    const beforePosition = currentIndex - 1;
    const afterPosition = currentIndex + 1;
    let loadingIndexs = [];
    if (beforePosition >= 0 && afterPosition >= 0) {
      loadingIndexs = [beforePosition, currentIndex, afterPosition];
    } else if (beforePosition <= 0) {
      loadingIndexs = [currentIndex, afterPosition];
    } else {
      loadingIndexs = [beforePosition, currentIndex];
    }
    return loadingIndexs;
  }, [currentIndex]);

  const updateHistory = useCallback(
    async (videoId, progress) => {
      let videoPlayInitialSource = '';
      if (videoId === referredVideoId) {
        videoPlayInitialSource = !!source ? source : 'RECOMMENDED';
      } else {
        videoPlayInitialSource = 'SCROLL';
      }
      await postRequest(`${Constants.FEEDS_API_BASE_URL}/history`, {
        video_id: videoId,
        watch_time: progress,
        source: videoPlayInitialSource,
      });
    },
    [referredVideoId, source],
  );

  const updateEngagement = useCallback(async () => {
    await postRequest(`${Constants.FEEDS_API_BASE_URL}/engagement`, {
      section_id: 1,
    });
  }, []);

  useEffect(() => {
    updateEngagement();

    return () => {
      updateEngagement();
    };
  }, [updateEngagement]);

  const getChildProgress = useCallback(
    (progress, videoId) => {
      if (!!progress?.currentTime) {
        updateHistory(videoId, progress.currentTime);
      }
    },
    [updateHistory],
  );

  const getFeaturedProduct = async productId => {
    setGetProductData('');
    try {
      const productsId = JSON.parse(productId);
      // console.log('productsId=====productsId', productsId);
      // const data = await newclient.query({
      //   query: GET_PRODUCT_QUERY,
      //   variables: {
      //     id: productsId,
      //   },
      // });
      let productData;
      productsId.map(async item => {
        const data = await postRequest(
          'https://serverless-prod.dentalkart.com/api/v1/products/list',
          {id: item},
          {'x-api-key': 'ZFobrRyccnTyXyXHPUVO4eyyKEKoSjWB'},
        );
        productData = await data.json();
        // console.log('GET_PRODUCT_QUERY===', JSON.stringify(productData));
        setGetProductData(prev => [...prev, productData.products?.[0]]);
      });
      setFeaturedProductLoading(false);
      if (productData?.length > 0) {
        setFeaturedProduct(getProductData);
        setFeaturedProductLoading(false);
      }
    } catch (error) {
      setFeaturedProductLoading(false);
    }
  };

  const RenderFeaturedProduct = useCallback(
    ({item, sheetId}) => {
      return (
        <View style={styles.productContainer}>
          <View style={styles.productBody}>
            <Image
              style={{width: 120, height: 120}}
              resizeMode="cover"
              source={{
                uri:
                  PRODUCT_IMAGE_URL +
                  item?.custom_attributes.find(
                    e => e.attribute_code === 'thumbnail',
                  )?.value,
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <Text numberOfLines={2} style={{color: '#949494'}}>
              {item.name}
            </Text>
            <Text
              numberOfLines={3}
              style={{color: '#949494', fontSize: 10, lineHeight: 15}}>
              {/* {item.short_description} */}
              {
                item?.custom_attributes.find(
                  e => e.attribute_code === 'short_description',
                )?.value
              }
            </Text>
            <View style={styles.productPriceContainer}>
              <Text style={{fontWeight: '800', fontSize: 18}}>
                <Text>₹</Text>
                {item?.custom_attributes.find(
                  e => e.attribute_code === 'special_price',
                )?.value
                  ? parseFloat(
                      item?.custom_attributes.find(
                        e => e.attribute_code === 'special_price',
                      )?.value,
                    ).toFixed(2)
                  : item.price}
              </Text>

              {item?.price &&
                item?.custom_attributes.find(
                  e => e.attribute_code === 'special_price',
                )?.value && (
                  <Text style={styles.price}>
                    <Text>₹</Text>

                    {item.price}
                  </Text>
                )}
              {item?.custom_attributes.find(
                e => e.attribute_code === 'special_price',
              )?.value && (
                <Text style={styles.priceOff}>
                  {(
                    (item?.custom_attributes.find(
                      e => e.attribute_code === 'special_price',
                    )?.value /
                      item.price) *
                    100
                  ).toFixed(2)}{' '}
                  % Off
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                refRBProductSheet.current[sheetId].close();
                setIsPlaying(true);
                // navigation.navigate('ProductDetails', {
                //   productId: item?.id,
                // });

                navigation.navigate('UrlResolver', {
                  url_key:
                    item?.parent_url_key !== ''
                      ? item?.parent_url_key + '.html'
                      : item?.custom_attributes.find(
                          e => e.attribute_code === 'url_key',
                        )?.value,
                });
              }}>
              <Text style={styles.productViewDetails}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [navigation],
  );

  const renderProductSeparator = useCallback(() => {
    return <View style={{marginVertical: 10}} />;
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View style={{flex: 1, backgroundColor: '#000000'}}>
          {splitData.includes(index) && (
            <VideoPlayer
              id={reelsData[index]?.id}
              videoURL={
                Platform.OS === 'android'
                  ? reelsData[index]?.streaming_url
                  : reelsData[index]?.video_url
              }
              paused={currentIndex !== index || isPlaying}
              getChildProgress={getChildProgress}
            />
          )}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']}
            style={styles.gradient}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}>
            <View style={styles.mainContinuer}>
              <View style={styles.descriptionContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Image
                    style={styles.profileImage}
                    source={{uri: reelsData[index]?.author_image}}
                  />
                  <Text style={styles.profileName}>
                    {reelsData[index]?.author_name}
                  </Text>
                </View>

                <Text numberOfLines={3} style={styles.desecrations}>
                  {reelsData[index]?.title.trim()}
                </Text>
                {reelsData[index]?.featured_product !== null ? (
                  <TouchableOpacity
                    // onPress={() => refRBProductSheet.current[item.id].open()}
                    onPress={() => {
                      refRBProductSheet.current[item.id].open();
                      setFeaturedProductLoading(true);
                      setTimeout(() => {
                        getFeaturedProduct(
                          reelsData[index]?.featured_product,
                          item.id,
                          // [1995, 19995],
                        );
                      }, 500);
                    }}
                    style={styles.featuredProductContainer}>
                    <Text style={styles.featuredProductText}>
                      Featured products
                    </Text>
                    <Image
                      style={styles.featuredProductArrowIcon}
                      source={require('../../../assets/down-arrow.png')}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View
                style={{
                  width: '25%',
                  height: 180,
                  // backgroundColor: 'green',
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  paddingBottom: 50,
                }}>
                <View style={styles.actionBox}>
                  {currentVideoData?.isLiked ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          AddLikeApi(item.id);
                        }}>
                        <Image
                          source={require('../../../assets/heart-liked.png')}
                          style={styles.iconSize}
                        />
                        <Text style={styles.fontStyle}>
                          {currentVideoData?.like_count}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (userInfo) {
                          AddLikeApi(item.id);
                        } else {
                          showInfoMessage(
                            'You need to login first before liking the video',
                          );
                        }
                      }}>
                      <Image
                        style={styles.iconSize}
                        source={require('../../../assets/heart.png')}
                      />
                      <Text style={styles.fontStyle}>
                        {currentVideoData?.like_count}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={[styles.actionBox, {marginTop: 24}]}>
                  <TouchableOpacity
                    onPress={() => {
                      if (userInfo) {
                        setCommentsData('');
                        GetCommentsApi(item.id);
                        refRBSheet.current[item.id].open();
                      } else {
                        showInfoMessage(
                          'You need to login first before commenting on the video',
                        );
                      }
                    }}>
                    <Image
                      style={styles.iconSize}
                      source={require('../../../assets/comment.png')}
                    />
                    <Text style={[styles.fontStyle]}>
                      {currentVideoData?.comment_count}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <View
                style={[
                  styles.actionBox,
                  {
                    marginTop: 24,
                  },
                ]}>
                <TouchableOpacity onPress={() => shareVideo(item)}>
                  <Image
                    style={styles.iconSize}
                    source={require('../../../assets/share.png')}
                  />
                </TouchableOpacity>
              </View> */}
              </View>
            </View>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.7}
            style={styles.goBackIcon}>
            <Image source={require('../../../assets/backArrow.png')} />
          </TouchableOpacity>

          <RBSheet
            gestureEnabled={true}
            height={400}
            ref={el => (refRBSheet.current[item.id] = el)}
            closeOnDragDown={false}
            closeOnPressMask={false}>
            <SafeAreaView style={styles.commentHeadingMainCont}>
              <View style={styles.commentHeadingCont}>
                <Text style={styles.commentHeading}>Comments</Text>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current[item.id].close();
                  }}>
                  <Image
                    style={styles.closeIcon}
                    source={require('../../../assets/close.png')}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                style={{flex: 1, marginBottom: 20}}
                data={commentsData}
                renderItem={renderCommentItem}
              />

              <View style={styles.commentInput}>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  style={{width: '90%', marginLeft: 5}}
                  placeholder="Add a comment"
                />
                <TouchableOpacity
                  onPress={() => AddCommentApi(item.id, comment)}>
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../../../assets/send.png')}
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </RBSheet>

          <RBSheet
            gestureEnabled={true}
            height={450}
            ref={el => (refRBProductSheet.current[item.id] = el)}
            closeOnDragDown={false}
            closeOnPressMask={false}>
            <View style={styles.commentHeadingMainCont}>
              <>
                <View style={styles.commentHeadingCont}>
                  <Text style={styles.commentHeading}>
                    All Products (
                    {featuredProductLoading ? '0' : getProductData.length})
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      refRBProductSheet.current[item.id].close();
                    }}>
                    <Image
                      style={styles.closeIcon}
                      source={require('../../../assets/close.png')}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={styles.featuredProductContentContainer}
                  data={getProductData}
                  // renderItem={renderFeaturedProduct}
                  renderItem={({item: childItems}) => {
                    return (
                      <RenderFeaturedProduct
                        item={childItems}
                        sheetId={item.id}
                      />
                    );
                  }}
                  ItemSeparatorComponent={renderProductSeparator}
                  ListEmptyComponent={
                    <ActivityIndicator
                      style={styles.featuredLoading}
                      size={'large'}
                    />
                  }
                />
              </>
            </View>
          </RBSheet>
        </View>
      );
    },
    [
      getProductData,
      navigation,
      commentsData,
      comment,
      renderCommentItem,
      currentIndex,
      userInfo,
      currentVideoData,
      AddCommentApi,
      AddLikeApi,
      reelsData,
      splitData,
      getChildProgress,
      renderProductSeparator,
      featuredProduct,
      featuredProductLoading,
      isPlaying,
    ],
  );

  const setWatchProgress = useCallback(index => {
    setCurrentIndex(index);
  }, []);

  const getVideoProgress = useCallback(
    progress => {
      const videoProgress = Math.abs(progress);
      if (videoProgress !== lastProgress) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      setLastProgress(videoProgress);
    },
    [lastProgress],
  );

  useEffect(() => {
    if (isFocused) {
      setIsPlaying(false);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.flexView}>
      {loading ? (
        <View style={styles.loadingCss}>
          <ActivityIndicator size="small" transparent={true} />
        </View>
      ) : reelsData.length > 0 ? (
        <View style={styles.screenContainer}>
          <GestureHandlerRootView>
            <Carousel
              {...baseOptions}
              loop={false}
              autoPlay={false}
              data={reelsData}
              onSnapToItem={setWatchProgress}
              renderItem={renderItem}
              defaultIndex={currentIndex}
              currentIndex={currentIndex}
              windowSize={1}
              onProgressChange={getVideoProgress}
            />
          </GestureHandlerRootView>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default withNavigationFocus(VideoNews);
const styles = StyleSheet.create({
  flexView: {flex: 1},
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  iconSize: {width: 24, height: 24},
  fontStyle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  IconsContainer: {
    flexDirection: 'row',
    width: '40%',
    alignItems: 'center',
  },
  actionBox: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  headerStyle: {
    width: 100,
    height: 25,
    resizeMode: 'contain',
  },
  goBackIcon: {
    position: 'absolute',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 4,
  },

  subscribeText: {fontSize: 8, fontWeight: '600', color: '#868686'},
  subscribeContinuer: {
    backgroundColor: '#FFFFFF',
    width: 52,
    borderRadius: 8,
    // padding: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 14,
    marginLeft: 10,
  },
  userName: {
    fontWeight: '600',
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  mainContinuer: {
    marginHorizontal: 16,
    // position: 'absolute',
    // bottom: Platform.OS === 'android' ? 20 : 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  descriptionContainer: {
    width: '75%',
  },
  desecrations: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    // height: 50,
    textAlignVertical: 'bottom',
  },
  featuredProductContainer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredProductText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuredProductArrowIcon: {
    marginLeft: 10,
    width: 16,
    height: 16,
  },
  userIcon: {width: 38, height: 38, resizeMode: 'contain'},
  actionSheetContainerStyle: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continuer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userComment: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
  },
  userImgContinuer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  userNameText: {
    fontWeight: '600',
    color: '#808080',
    paddingTop: 12,
  },
  commentDate: {
    fontWeight: '600',
    fontSize: 10,
    color: '#808080',
    paddingVertical: 2,
  },
  comments: {
    fontWeight: '400',
    color: '#000',
    fontSize: 16,
    bottom: 2,
    textTransform: 'capitalize',
  },
  closeIcon: {width: 22, height: 22},
  commentHeading: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  commentHeadingCont: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  commentHeadingMainCont: {
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: 20,
    // paddingVertical: 10,
  },
  commentInput: {
    borderColor: '#d3d3d3',
    borderRadius: 20,
    // height: 38,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 0.5,
    bottom: 10,
    marginHorizontal: 16,
  },
  loadingCss: {
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingCssS: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: '5%',
    backgroundColor: '#d3d3d3',
  },
  profileImage: {
    width: 28,
    height: 28,
  },
  profileName: {
    textTransform: 'capitalize',
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '500',
  },
  featuredProductContentContainer: {flex: 1, marginBottom: 10, marginTop: 10},
  productContainer: {
    width: '100%',
    backgroundColor: '#F8FDFF',
    elevation: 1,
    shadowRadius: 8,
    flexDirection: 'row',
  },
  productBody: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  price: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: '#ffb3b3',
  },
  priceOff: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
    color: '#00C938',
  },
  productViewDetails: {
    color: '#2b79ac',
    marginVertical: 4,
    marginRight: 16,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  featuredLoading: {
    marginTop: '50%',
  },
  featuredProductLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 20 : 100,
    width: '100%',
    height: 200,
  },
});
