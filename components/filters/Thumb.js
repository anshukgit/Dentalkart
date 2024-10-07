import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const THUMB_RADIUS = 12;

const Thumb = () => {
  return (
    <View style={styles.root}/>
    
  );
};

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderColor: '#0866d5',
    backgroundColor: '#1976d2',
  },
  linearGradient: {
    // backgroundColor:"#1976d2",
    // backgroundColor:"rgba(171, 203, 239, 1.0)",
    backgroundColor:"red",
    marginHorizontal: 38,
    padding:0,
    borderRadius: 20,
  },
});

export default memo(Thumb);
