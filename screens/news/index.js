import React from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import {FlatList, SafeAreaView, ScrollView} from 'react-navigation';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import {
  GET_NEWS,
  RECENTLY_VIEWED_NEWS,
  LIKE_NEWS,
  BOOKMARK_NEWS,
  ADD_TO_NEWS_HISTORY,
} from './graphql';
import {Query} from 'react-apollo';
import {newclient, client2} from '@apolloClient';
import styles from './news.style';
import {NavigationEvents} from 'react-navigation';
import Loader from '../../components/loader';
import colors from '../../config/colors';
import {showSuccessMessage} from '../../helpers/show_messages';
import Share from 'react-native-share';

export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNews: false,
      showNewsLink: null,
      activeIndex: 0,
      carouselItems: [],
      activeSlide: 0,
      bookMarkNewsId: [],
      likedNewsId: [],
      readingLoadData: false,
    };
  }

  componentDidMount = async () => {
    let bookmarkData = await newclient.mutate({
      mutation: BOOKMARK_NEWS,
      variables: {},
    });
    if (bookmarkData?.data?.bookmarkNews?.ids.length) {
      this.setState({
        bookMarkNewsId: bookmarkData?.data?.bookmarkNews?.ids,
      });
    }
  };

  openLink = link => {
    this.setState({showNews: true, showNewsLink: link});
  };

  sharePressed = item => {
    let options = {
      url: item?.source_link,
      title: 'News',
      message: item?.content,
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  _renderItem = (item, index, type, refetch) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this.navigateToNewsDetails(item)}
        style={[
          styles.cardContainer,
          type === 'small' ? styles.smallCardContainer : null,
        ]}>
        <View
          style={[
            styles.cardTopImageContainer,
            type === 'small' ? styles.cardTopSmallImageContainer : null,
          ]}>
          <Image
            style={[
              styles.cardTopImageStyle,
              type === 'small' ? styles.cardTopSmallImageContainer : null,
            ]}
            resizeMode="cover"
            source={{uri: item.image}}
          />
          {/* {type === "small" && <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => null}
            style={styles.cardAbsoluteHeartContainer}
          >
            <AntDesignIcon name={"heart"} size={wp("5%")} />
            <AntDesignIcon name={"hearto"} size={wp("5%")} />
          </TouchableOpacity>
          } */}
        </View>
        <View>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={3} style={styles.cardContent}>
            {item.content}
          </Text>
          {/* <Text
            onPress={() => this.openLink(item.source_link)}
            numberOfLines={1}
            style={styles.cardLabelLink}>{type === "large" ? "Click to read news :" : null}<Text style={styles.cardLink}> {item.source_link}</Text></Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  pagination = entries => {
    const {activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        dotContainerStyle={{
          width: 30,
        }}
        dotStyle={{
          width: 30,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: '#344161',
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  getRecentNews = () => {
    if (this.state.readingLoadData) {
      return (
        <Query
          query={RECENTLY_VIEWED_NEWS}
          client={newclient}
          fetchPolicy="network-only">
          {({loading, error, data, refetch}) => {
            if (data && data?.recentlyViewedNews?.length) {
              return (
                <View>
                  <View style={styles.sectionHeaderContainer}>
                    <View style={{flex: 1}}>
                      <Text
                        numberOfLines={1}
                        style={styles.sectionHeaderTitleText}>
                        As Per Your Reading History
                      </Text>
                    </View>
                    {/* <Text style={styles.sectionHeaderSubTitleText}>More</Text> */}
                  </View>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={data?.recentlyViewedNews}
                    renderItem={({item, index}) =>
                      this._renderItem(item, index, 'small', refetch)
                    }
                    keyExtractor={item => item.id}
                  />
                </View>
              );
            }
            return null;
          }}
        </Query>
      );
    }
    return null;
  };

  navigateToNewsDetails = async news => {
    this.props.navigation.push('NewsDetails', {data: news});
    await newclient.mutate({
      mutation: ADD_TO_NEWS_HISTORY,
      variables: {id: news.id},
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <NavigationEvents
          onWillFocus={async () => {
            this.setState({readingLoadData: true});
          }}
          onWillBlur={async () => {
            this.setState({readingLoadData: false});
          }}
        />
        <StatusBar barStyle="default" />
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}>
          <Query query={GET_NEWS} client={newclient} fetchPolicy="network-only">
            {({data, loading, error, refetch}) => {
              if (loading) {
                return (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator
                      size={'large'}
                      color={colors.blueColor}
                    />
                  </View>
                );
              }
              if (data && data.news) {
                return (
                  <>
                    <View>
                      <View style={styles.sectionHeaderContainer}>
                        <View style={{flex: 1}}>
                          <Text
                            numberOfLines={1}
                            style={styles.sectionHeaderTitleText}>
                            Recent Topics
                          </Text>
                        </View>
                        {/* <Text style={styles.sectionHeaderSubTitleText}>More</Text> */}
                      </View>
                      <Carousel
                        ref={c => {
                          this._carousel = c;
                        }}
                        data={data.news.slice(0, 4)}
                        renderItem={({item, index}) =>
                          this._renderItem(item, index, 'large', refetch)
                        }
                        onSnapToItem={index =>
                          this.setState({activeSlide: index})
                        }
                        sliderWidth={wp('100%')}
                        itemWidth={wp('100%')}
                      />
                      {this.pagination(data.news.slice(0, 4))}
                    </View>
                    {this.getRecentNews()}
                    <View style={styles.sectionHeaderContainer}>
                      <View style={{flex: 1}}>
                        <Text
                          numberOfLines={1}
                          style={styles.sectionHeaderTitleText}>
                          All News
                        </Text>
                      </View>
                      {/* <Text style={styles.sectionHeaderSubTitleText}>More</Text> */}
                    </View>
                    {data.news.slice(4, data.news.length).map(news => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => this.navigateToNewsDetails(news)}
                          style={[styles.cardContainer, styles.directionRow]}>
                          <View style={styles.cardTitleContentContainer}>
                            <View>
                              <Text numberOfLines={2} style={styles.cardTitle}>
                                {news.title}
                              </Text>
                              <Text
                                numberOfLines={4}
                                style={styles.cardContent}>
                                {news.content}
                              </Text>
                              {/* <Text
                                  onPress={() => this.openLink(news.source_link)}
                                  numberOfLines={1}
                                  style={styles.cardLink}>{news.source_link}</Text> */}
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={async () => {
                                  let a = await newclient.mutate({
                                    mutation: LIKE_NEWS,
                                    variables: {id: news.id},
                                  });
                                  this.setState({
                                    likedNewsId: [
                                      ...this.state.likedNewsId,
                                      news.id,
                                    ],
                                  });
                                  refetch();
                                }}
                                style={styles.cardBottomIconContainer}>
                                {this.state.likedNewsId.includes(news?.id) ? (
                                  <AntDesignIcon name={'like1'} size={22} />
                                ) : (
                                  <AntDesignIcon name={'like2'} size={22} />
                                )}
                                <Text style={styles.cardBottomIconText}>
                                  Like
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.sharePressed(news)}
                                style={styles.cardBottomIconContainer}>
                                <Ionicons
                                  name={'share-social-outline'}
                                  size={22}
                                />
                                {/* <Ionicons name={"share-social"} size={22} /> */}
                                <Text style={styles.cardBottomIconText}>
                                  Share
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={async () => {
                                  let bookmarkData = await newclient.mutate({
                                    mutation: BOOKMARK_NEWS,
                                    variables: {id: news.id},
                                  });
                                  if (
                                    bookmarkData?.data?.bookmarkNews?.ids.length
                                  ) {
                                    showSuccessMessage('News has been saved');
                                    this.setState({
                                      bookMarkNewsId:
                                        bookmarkData?.data?.bookmarkNews?.ids,
                                    });
                                  }
                                  refetch();
                                }}
                                style={styles.cardBottomIconContainer}>
                                {this.state.bookMarkNewsId.includes(
                                  news?.id,
                                ) ? (
                                  <FontistoIcon
                                    name={'bookmark-alt'}
                                    size={22}
                                  />
                                ) : (
                                  <FontistoIcon name={'bookmark'} size={22} />
                                )}
                                <Text style={styles.cardBottomIconText}>
                                  Save
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={styles.cardRightImageContainer}>
                            <Image
                              style={styles.cardRightImageStyle}
                              source={{uri: news.image}}
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                );
              } else if (error) {
                return (
                  <Text allowFontScaling={false}>{JSON.stringify(error)}</Text>
                );
              } else if (loading) {
                return null;
              } else return null;
            }}
          </Query>
          <Modal
            animationIn="slideInRight"
            animationOut="slideOutRight"
            deviceWidth={1}
            deviceHeight={1}
            isVisible={this.state.showNews}>
            <SafeAreaView style={{flex: 1}}>
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({showNews: false, showNewsLink: null})
                  }
                  style={styles.header}>
                  <Ionicons name="ios-close-circle-outline" size={25} />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <WebView
                  source={{uri: this.state.showNewsLink}}
                  startInLoadingState={true}
                />
              </View>
            </SafeAreaView>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
