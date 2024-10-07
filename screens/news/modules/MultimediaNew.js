import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import getRequest from '@helpers/get_request';
import Constants from '@config/constants';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {withNavigationFocus} from 'react-navigation';

const MultimediaNew = ({navigation, props}) => {
  const [loading, setLoading] = useState(null);
  const [reelsData, setReelsData] = useState([]);
  const isFocused = navigation.isFocused();
  const getVideos = async () => {
    setLoading(true);
    let res = await getRequest(
      `${Constants.FEEDS_API_BASE_URL}/feeds?order=desc`,
    );
    let multimediaData = await res.json();
    if (multimediaData.status === 'success') {
      console.log(multimediaData.data.rows);
      setReelsData(multimediaData.data.rows);
    }
    setLoading(false);
  };
  useEffect(() => {
    getVideos();
  }, [isFocused]);

  const width = Dimensions.get('window').width;
  // const itemMargin = width - 300 - 32;
  const itemMargin = width - 300 - 32;

  // const screenWidth = Dimensions.get('window').width;
  // const numColumns = 2;
  // const gap = 5;

  // const availableSpace = screenWidth - (numColumns - 1) * gap;
  // const itemSize = availableSpace / numColumns;

  const renderItems = ({item, index}) => {
    return (
      <View
        style={[
          styles.itemContainer,
          index % 2 == 0
            ? {marginRight: itemMargin / 2}
            : {marginLeft: itemMargin / 2},
        ]}>
        {/* // style={{
        //   borderRadius: 8,
        //   marginVertical: 8,
        //   height: itemSize,
        //   width: itemSize,
        // }}> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('VideoNews', {
              videoId: item.id,
              source: 'THUMBNAIL',
            });
          }}
          key={index}
          style={styles.subDomainItem}>
          <Image
            style={styles.img}
            resizeMode="cover"
            source={{uri: item.thumbnail_url}}
          />
          <View style={styles.videoTimeCont}>
            <View style={styles.videoCountBG}>
              <Text style={styles.videoCountText}>
                {Number(item?.duration) > 60
                  ? Number(item?.duration / 60)
                      .toFixed(2)
                      .replace('.', ':')
                  : '0:' + Number(item?.duration)}
              </Text>
            </View>
            {item?.isLiked ? (
              <Image
                style={[styles.likeImg]}
                source={require('../../../assets/heart-liked.png')}
              />
            ) : (
              <Image
                style={styles.likeImg}
                source={require('../../../assets/heart.png')}
              />
            )}
          </View>
          <View style={styles.videoTitle}>
            <Text style={styles.titles} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      {loading ? (
        <View style={styles.loadingCont}>
          <ActivityIndicator size="small" transparent={true} />
        </View>
      ) : (
        <View style={styles.screenContainer}>
          <View style={styles.userContinuer}>
            <Text style={styles.sectionHeaderTitleText}>Shorts</Text>
          </View>
          {reelsData.length > 0 ? (
            <FlatList
              contentContainerStyle={{
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
              numColumns={2}
              // numColumns={numColumns}
              // contentContainerStyle={{gap}}
              // columnWrapperStyle={{gap}}
              // key={numColumns}
              data={reelsData}
              renderItem={renderItems}
              keyExtractor={(item, index) => item?.id?.toString() + '_' + index}
            />
          ) : (
            <View style={styles.notFound}>
              <Image
                style={{width: 100}}
                resizeMode="contain"
                source={require('../../../assets/not-found.png')}
              />
              <Text style={{fontSize: 16}}>Videos not found</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default withNavigationFocus(MultimediaNew);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  itemContainer: {
    borderRadius: 8,
    // alignSelf: 'center',
    width: 150,
    height: 200,
    marginVertical: 8,
    // marginHorizontal: '10%',
  },
  notFound: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subDomainItem: {
    alignSelf: 'center',
    width: 150,
    height: 160,
    borderRadius: 8,
  },
  sectionHeaderTitleText: {
    fontWeight: 'bold',
    fontSize: widthPercentageToDP('5'),
    color: '#344161',
  },
  titles: {
    color: '#344161',
    fontWeight: '600',
    fontSize: 12,
    padding: 8,
  },
  img: {
    borderRadius: 8,
    width: 150,
    height: 160,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overlayColor: '#ffffff',
  },
  videoTimeCont: {
    width: 150,
    padding: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    zIndex: 2,
    bottom: 10,
    elevation: 5,
    paddingHorizontal: 10,
  },
  videoCountBG: {
    backgroundColor: '#868686',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  videoCountText: {fontSize: 7, fontWeight: '600', color: '#FFFFFF'},
  loadingCont: {
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  userContinuer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 8,
    marginLeft: 10,
  },
  likeImg: {width: 16, height: 16},
});
