import React from 'react';
// We need to import the connectHighlight to our import
import {Text} from 'react-native';

export const CustomHighlight = ({searched, text}) => {
  try {
    const getIndexOfSubStr = (str, searchToken, preIndex, output) => {
      var result = str?.toLowerCase()?.indexOf(searchToken?.toLowerCase());
      if (result > -1) {
        output.push(result);
        str = str.substring(result + searchToken?.length);
        getIndexOfSubStr(str, searchToken, preIndex, output);
      }
      return output;
    };
    let matches =
      searched && text ? getIndexOfSubStr(text, searched, 0, []) : [];
    return matches?.length > 0 ? (
      matches.map((match, idx) => {
        return (
          <Text
            allowFontScaling={false}
            key={idx?.toString()}
            style={{
              fontWeight: '500',
              lineHeight: 20,
              color: '#25303C',
            }}>
            {idx - 1 >= 0
              ? text.substring(matches[idx - 1] + searched?.length, match)
              : text?.substring(0, match)}
            <Text
              allowFontScaling={false}
              style={{
                fontWeight: '700',
                lineHeight: 20,
                color: '#25303C',
              }}>
              {text.substring(match, match + searched?.length)}
            </Text>
            {idx + 1 === matches?.length
              ? text?.substring(match + searched?.length)
              : null}
          </Text>
        );
      })
    ) : (
      <Text
        allowFontScaling={false}
        style={{
          fontWeight: '500',
          lineHeight: 20,
          color: '#25303C',
        }}>
        {text}
      </Text>
    );
  } catch (error) {
    return (
      <Text
        allowFontScaling={false}
        style={{
          fontWeight: '500',
          lineHeight: 20,
          color: '#25303C',
        }}>
        {text}
      </Text>
    );
  }
};
