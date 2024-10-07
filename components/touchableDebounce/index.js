import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {debounce} from 'lodash';

const TouchableDebounce = ({
  debounceTime = 500,
  onPress,
  children,
  ...props
}) => {
  const handler = useCallback(debounce(onPress, debounceTime), []);

  return (
    <TouchableOpacity {...props} onPress={handler}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableDebounce;
