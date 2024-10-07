import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {
  DeviceWidth,
  productBaseUrl,
  productBaseUrlSlash,
} from '@config/environment';
import styles from './homepagebanner.style';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';

export default class HomepageBanner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  navigateRoute = item => {
    const {navigation} = this.props;
    AnalyticsEvents('BANNER_CLICKED', 'Promo Banner', item);
    console.log('item-========================', item);
    if (item.relative) {
      if (item.link && item.link.includes('sale')) {
        navigation.navigate('Branding', {
          saleUrl: item.link,
        });
      } else if (item.link && item.link.includes('membership')) {
        navigation.navigate('MemberShip');
      } else if (item.link !== '#') {
        navigation.navigate('UrlResolver', {url_key: item.link});
      }
    } else {
      Linking.openURL(
        String(item?.link).includes('https://www.dentalkart.com')
          ? item.link
          : 'https://www.dentalkart.com' +
              (String(item?.link).startsWith('/')
                ? item.link
                : '/' + item.link),
      );
    }
  };
  sliderImage = ({item}) => {
    const {navigation} = this.props;
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => this.navigateRoute(item)}>
          <Image
            resizeMethod={'resize'}
            source={{uri: item.mobile_image}}
            alt={item.title}
            style={styles.sliderImage}
          />
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const {data} = this.state;
    return (
      <View>
        <TouchableOpacity>
          <View style={[styles.banner, {paddingVertical: 4, marginTop: '12%'}]}>
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
