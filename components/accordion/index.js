import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Platform, UIManager} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {styles} from './style';
import colors from '../../config/colors';

export default Accordian = ({
  data,
  refine,
  title,
  renderItem,
  isOpen = false,
}) => {
  const [expanded, setExpanded] = useState(isOpen);
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.row}
        onPress={() => setExpanded(!expanded)}>
        <Text style={[styles.title]}>{title}</Text>
        <Icon
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={30}
          color={colors.grey}
        />
      </TouchableOpacity>
      <View style={styles.parentHr} />
      {expanded &&
        data.map((item, index) => {
          return (
            <View style={styles.child} key={index?.toString()}>
              {renderItem(item, title)}
            </View>
          );
        })}
    </View>
  );
};
