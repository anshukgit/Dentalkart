import React from 'react';
import {View} from 'react-native';
import {SecondaryColor} from '../../config/environment';

const RadioButton = props => {
  return (
    <View
      style={[
        {
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: props.selected ? SecondaryColor : '#00000080',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}>
      {props.selected ? (
        <View
          style={[
            {
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: SecondaryColor,
            },
            props.dotStyle,
          ]}
        />
      ) : null}
    </View>
  );
};

export default RadioButton;
