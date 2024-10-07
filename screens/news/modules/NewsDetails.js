import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Image,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-navigation';
import HeaderComponent from '@components/HeaderComponent';
import styles from '../news.style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';
import {LIKE_NEWS, BOOKMARK_NEWS} from '../graphql';
import {newclient} from '@apolloClient';
import {showSuccessMessage} from '../../../helpers/show_messages';
import Share from 'react-native-share';
import {DentalkartContext} from '@dentalkartContext';
import {newsClick} from '../../../helpers/sendData';
import DeviceInfo from 'react-native-device-info';

export default NewsDetails = ({navigation}) => {
  let {data} = navigation.state.params;
  const [showNews, setShowNews] = useState(false);
  const [showNewsLink, setShowNewsLink] = useState(null);
  const [bookmarkedNews, setBookmarkedNews] = useState(false);
  const [likedNews, setLikedNews] = useState(false);
  const context = useContext(DentalkartContext);
  const {userInfo} = context;

  useEffect(() => {
    let sendData = {
      id: data?.id,
      type: data?.type,
      created_at: data?.date,
      customer_id:
        userInfo && userInfo.getCustomer
          ? userInfo.getCustomer.id
            ? userInfo.getCustomer.id
            : userInfo?.getCustomer?.email
          : null,
      platform: Platform.OS,
      urn: DeviceInfo.getUniqueId(),
    };
    newsClick(sendData);
  }, [data]);

  const sharePressed = item => {
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFF',
      }}>
      <HeaderComponent
        navigation={navigation}
        isempty={true}
        style={{height: 40}}
        newsHeader={true}
        bookmark={bookmarkedNews}
        like={likedNews}
        shareNews={() => sharePressed(data)}
        bookmarkNews={async () => {
          await newclient.mutate({
            mutation: BOOKMARK_NEWS,
            variables: {id: data?.id},
          });
          showSuccessMessage('News has been saved');
          setBookmarkedNews(true);
        }}
        likeNews={async () => {
          await newclient.mutate({
            mutation: LIKE_NEWS,
            variables: {id: data?.id},
          });
          setLikedNews(true);
        }}
      />
      <ScrollView>
        <Image source={{uri: data.image}} style={styles.newsScrollImage} />
        <View style={styles.newsScrollTitleContainer}>
          <Text numberOfLines={2} style={styles.newsTitle}>
            {data.title}
          </Text>
          <Text style={styles.newsDate}>{data?.date}</Text>
        </View>
        <View style={styles.newsUnderline} />
        <View style={styles.newsScrollNewsContainer}>
          <Text numberOfLines={1} style={styles.fullNews}>
            {' '}
            {`Full News`}
          </Text>
          <Text style={styles.fullNewsContent}>{data?.content}</Text>
          <Text
            onPress={() => {
              setShowNews(true);
              setShowNewsLink(data?.source_link);
            }}
            numberOfLines={2}
            style={styles.cardLink}>
            {data.source_link}
          </Text>
        </View>
        {showNewsLink && (
          <Modal
            animationIn="slideInRight"
            animationOut="slideOutRight"
            deviceWidth={1}
            deviceHeight={1}
            isVisible={showNews}>
            <SafeAreaView style={{flex: 1}}>
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() => {
                    setShowNews(false);
                    setShowNewsLink(null);
                  }}
                  style={styles.header}>
                  <Ionicons name="ios-close-circle-outline" size={25} />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <WebView
                  source={{uri: showNewsLink}}
                  startInLoadingState={true}
                />
              </View>
            </SafeAreaView>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
