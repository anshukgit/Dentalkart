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
  BrandingStartDate,
  BrandingEndDate,
  SaleStartDate,
  SaleEndDate,
} from '@config/environment';
import styles from './homepageslider.style';
import brandingPageValidity from '@helpers/component_validity';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';

export default class HomepageSlider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  navigateRoute = item => {
    const {navigation} = this.props;
    AnalyticsEvents('BANNER_CLICKED', 'Banner Clicked', item);
    if (item.relative) {
      if (item.link && item.link.includes('sale')) {
        const isValid = brandingPageValidity(SaleStartDate, SaleEndDate);
        navigation.navigate('Branding', {
          saleUrl: item.link,
        });
      } else if (item.link && item.link.includes('membership')) {
        navigation.navigate('MemberShip');
      } else if (item.link !== '#') {
        console.log('item.link============', item.link);
        navigation.navigate('UrlResolver', {url_key: item.link});
      }
    } else {
      Linking.openURL(item.link);
      // navigation.navigate("Webview", { "url": item.link })
    }
    // if (isValid) {
    //     navigation.navigate('Branding')
    // }else {
    //     if (item.link && item.link.includes('sale'))
    //         isValid ? navigation.navigate('SalePage') : null;
    //     else if (item.link !== '#')
    //         navigation.navigate('UrlResolver', { url_key: item.link});
    // }
  };
  sliderImage = ({item}) => {
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
      <View style={styles.container}>
        {
          <View style={styles.sliderWrapper}>
            <Carousel
              layout={'default'}
              ref={c => {
                this._carousel = c;
              }}
              hasParallaxImages={true}
              data={data}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.7}
              renderItem={this.sliderImage}
              sliderWidth={DeviceWidth}
              itemWidth={DeviceWidth - 50}
              loop={true}
              loopClonesPerSide={6}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContentContainer}
            />
          </View>
        }
      </View>
    );
  }
}
