import React from 'react';
import {
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
  TouchableOpacity,
} from 'react-native';

export default (TouchableCustom =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback);
