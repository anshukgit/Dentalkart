import React from 'react';
import {TextInput} from 'react-native';
// import { BaseColor,BaseStyle,Typography} from "@config";
// import { FontFamily } from '@config/typography';
// import { screenPadding, moderateScale, writeLog, verticalScale, responsiveHeight, responsiveFontSize, responsiveWidth } from '../helpers/functions';
class TextInputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Visible: false,
      customerName: '',
      instruction: '',
    };
  }

  render() {
    const {
      multiline,
      style,
      placeholder,
      label,
      secureTextEntry,
      onSubmitEditing,
      keyboardType,
      onBlur,
      returnKeyType,
      value,
      onChangeText,
      id,
      minLength,
      maxLength,
      blurOnSubmit,
      autoCapitalize,
      onFocus,
      autoFocus,
      disabled,
      editable,
      numberOfLines,
    } = this.props;
    return (
      <TextInput
        numberOfLines={numberOfLines}
        underlineColorAndroid="transparent"
        onSubmitEditing={onSubmitEditing}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        value={value}
        ref={id}
        onFocus={onFocus}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        placeholderTextColor={'#C4CDDD'}
        returnKeyType={returnKeyType}
        multiline={multiline}
        editable={editable}
        placeholderStyle={{fontSize: 500}}
        onBlur={onBlur}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
        blurOnSubmit={blurOnSubmit}
        disabled={disabled}
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            fontSize: 16,
          },
          numberOfLines && {height: 35 * numberOfLines},
          style,
        ]}>
        {label}
      </TextInput>
    );
  }
}
export default TextInputComponent;
