import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';

import Carousel from 'react-native-snap-carousel';
import {
  DeviceWidth,
  productBaseUrl,
  productBaseUrlSlash,
} from '@config/environment';
import styles from './homepagebrands.style';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';

export default class HomepageBrands extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  sliderImage = ({item}) => {
    const {navigation} = this.props;
    return (
      <View>
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => {
            AnalyticsEvents('BANNER_CLICKED', 'Promo Banner', item);
            if (item.relative) {
              navigation.navigate('UrlResolver', {url_key: item.link});
            } else {
              Linking.openURL(
                String(item?.link).includes('https://www.dentalkart.com')
                  ? item.link
                  : 'https://www.dentalkart.com' + item.link,
              );
            }
          }}>
          <Image
            resizeMethod={'resize'}
            source={{uri: item.mobile_image}}
            alt={item.title}
            style={styles.sliderImage}
          />
        </TouchableCustom>
      </View>
    );
  };
  render() {
    const {data} = this.state;
    return (
      <View>
        <TouchableOpacity>
          <View
            style={[styles.banner, {marginTop: '12%', paddingVertical: 10}]}>
            <Carousel
              layout={'default'}
              ref={c => {
                this._carousel = c;
              }}
              data={data}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.7}
              renderItem={this.sliderImage}
              sliderWidth={DeviceWidth}
              itemWidth={DeviceWidth - 50}
              firstItem={1}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
