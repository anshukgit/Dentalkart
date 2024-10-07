import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';

const RailSelected = () => {
  return (
    
    <View style={styles.root}/>

  );
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 6,
    // backgroundColor: 'rgba(255,255,255,0)',
    backgroundColor: '#1976d2',
    // backgroundColor: '#abcbef',
    borderRadius: 2,
  },
  linearGradient: {
    // backgroundColor:"rgba(255,255,255,0)",
    // backgroundColor:"#1976d2",
    backgroundColor:"#abcbef",
    padding:0,
    borderRadius: 20,
  },
});
