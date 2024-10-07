import React, {Component} from 'react';
import {View, StatusBar, Platform, SafeAreaView} from 'react-native';
import {
  StatusBarColor,
  StatusBarHeight,
  SecondaryColor,
} from '@config/environment';

export const StatusBarScreen = () => {
  return (
    <View
      style={
        Platform.OS === 'ios'
          ? {height: Platform.StatusBarHeight, backgroundColor: SecondaryColor}
          : {}
      }>
      <StatusBar
        barStyle="default"
        hidden={false}
        backgroundColor={SecondaryColor}
        translucent={false}
      />
    </View>
  );
};
