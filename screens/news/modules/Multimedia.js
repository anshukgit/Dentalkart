import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {MULTIMEDIA} from '../graphql';
import {newclient} from '@apolloClient';
import {NavigationEvents} from 'react-navigation';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';

const Multimedia = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [multimediaData, setMultimediaData] = useState([]);

  useEffect(() => {
    fetchMultimedia();
  }, []);

  const fetchMultimedia = async () => {
    setShowLoader(true);
    try {
      const {data, error} = await newclient.query({
        query: MULTIMEDIA,
        fetchPolicy: 'network-only',
        variables: {type: 'video'},
      });
      console.log('data', data);
      if (data && data?.multimedia) {
        setShowLoader(false);
        setMultimediaData(data?.multimedia?.video);
      }
    } catch (e) {
      console.log('e', e);
      setShowLoader(false);
    }
  };

  const loaderView = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size={'large'} color={'#2b79ac'} />
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <NavigationEvents
        onWillFocus={async () => {
          this.fetchMultimedia();
        }}
      />
      <View style={styles.sectionHeaderContainer}>
        <View style={{flex: 1}}>
          <Text numberOfLines={1} style={styles.sectionHeaderTitleText}>
            Multimedia
          </Text>
        </View>
      </View>
      <ScrollView>
        {multimediaData?.map((item) => (
          <View style={styles.rowContainer}>
            <TouchableOpacity
              onPress={() =>
                props?.navigation?.navigate('VideoPlay', {source: item?.source})
              }
              activeOpacity={0.5}
              style={styles.rowImageContainer}>
              <Image
                source={{
                  uri: item?.thumbnail,
                }}
                style={styles.rowImageStyle}
              />
              <View style={styles.rowAbsolutePlayContainer}>
                <FontAwesome
                  name={'play'}
                  size={22}
                  style={styles.rowPlayStyle}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.rowTextContainer}>
              <View>
                <Text style={styles.rowTitleText} numberOfLines={2}>
                  {item?.title}
                </Text>
              </View>
              <View>
                <Text style={styles.rowDescText} numberOfLines={2}>
                  {item?.created_at?.split(' ')[0]}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {showLoader ? loaderView() : null}
    </View>
  );
};

export default Multimedia;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  loaderContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  sectionHeaderContainer: {
    width: wp('95%'),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  sectionHeaderTitleText: {
    fontWeight: 'bold',
    fontSize: wp('5'),
    color: '#344161',
  },
  rowContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
    width: wp('95%'),
    alignSelf: 'center',
    paddingVertical: hp('2%'),
  },
  rowImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowImageStyle: {
    width: wp('35%'),
    height: wp('25%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  rowAbsolutePlayContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 40,
  },
  rowPlayStyle: {color: 'rgba(255,255,255,0.7)', marginLeft: 5},
  rowTextContainer: {
    marginLeft: wp('2%'),
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: hp('0.5%'),
  },
  rowTitleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  rowDescText: {
    color: '#808080',
  },
});
