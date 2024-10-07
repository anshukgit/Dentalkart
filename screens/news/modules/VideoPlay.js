import {View, SafeAreaView, ActivityIndicator} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import HeaderComponent from '@components/HeaderComponent';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Loader from '@components/loader';

export default function VideoPlay(props) {
  const {source = ''} = props?.navigation?.state?.params || {};
  const [showLoader, setShowLoader] = useState(true);
  const playerRef = useRef();

  useEffect(() => {
    if (!showLoader) {
      playerRef.current?.play();
    }
  }, [showLoader]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderComponent
        navigation={props?.navigation}
        isempty={true}
        style={{height: 40}}
      />
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            height: hp('30%'),
          }}>
          <YoutubePlayer
            height={300}
            play={true}
            videoId={source}
            onReady={() => {
              setShowLoader(false), playerRef.current?.play();
            }}
            onChangeState={state => {
              setShowLoader(false), playerRef.current?.play();
            }}
          />
        </View>
      </View>
      <Loader loading={showLoader} transparent={true} />
    </SafeAreaView>
  );
}
