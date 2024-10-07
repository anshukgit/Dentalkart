import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

const VideoPlayer = ({id, paused, videoURL, getChildProgress}) => {
  const refVideo = useRef([]);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (paused) {
      getChildProgress(progress, id);
    }
  }, [getChildProgress, paused, progress, id]);

  const onProgress = useCallback(data => {
    setProgress(data);
  }, []);
  const onLoad = useCallback(data => {
    setDuration(data?.duration);
    setIsPaused(false);
    setLoading(false);
  }, []);

  return (
    <View style={{flex: 1}}>
      <TouchableWithoutFeedback
        onPress={() => {
          setIsPaused(!isPaused);
        }}
        key={id}>
        <Video
          source={{
            uri: videoURL,
            type: 'mp4',
            headers: {
              range: 'bytes-0',
            },
          }}
          ref={el => (refVideo.current[id] = el)}
          paused={isPaused || paused}
          style={styles.player}
          repeat={true}
          // resizeMode={'cover'}
          resizeMode={'contain'}
          volume={1.0}
          rate={1.0}
          autoPlay={true}
          posterResizeMode="cover"
          onProgress={onProgress}
          onLoad={onLoad}
          playInBackground={false}
          playWhenInactive={false}
          hideShutterView
          useTextureView={false}
          disableFocus
          progressUpdateInterval={Platform.OS === 'ios' ? 250 : 500}
        />
      </TouchableWithoutFeedback>

      {loading && (
        <View style={styles.playIconContainer}>
          <ActivityIndicator size="large" color={'#ffffff'} />
        </View>
      )}

      {isPaused ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setIsPaused(!isPaused);
          }}
          style={styles.playIconContainer}>
          <Ionicons name={'play-circle'} size={100} color={'#ffffff'} />
        </TouchableOpacity>
      ) : null}
      {progress ? (
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressForground,
              {width: (progress.currentTime / duration) * 100 + '%'},
            ]}
          />
        </View>
      ) : null}
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  progressForground: {
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  progressBackground: {
    width: '100%',
    height: 3,
    backgroundColor: '#3d3f4282',
  },
  player: {
    width: '100%',
    height:
      Dimensions.get('window').height - (Platform.OS === 'android' ? 3 : 90),
  },
  playIconContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
});
