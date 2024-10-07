import React, {PureComponent} from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import styles from './homepagecategory.style';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents.js';

export default class HomePageCategory extends PureComponent {
  render() {
    const {data} = this.props;
    return (
      <View
        style={{
          marginHorizontal: 7,
        }}>
        <View style={styles.headerContainer}>
          <Text allowFontScaling={false} style={styles.headerTitleText}>
            Shop By Category
          </Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              AnalyticsEvents('VIEW_ALL', 'All Click', {}),
                this.props.navigation.navigate('ShopByCategory');
            }}>
            <Text allowFontScaling={false} style={styles.headerViewAllText}>
              View all
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.container}>
            {data.items.map((category, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryContainer}
                  onPress={() =>
                    this.props.navigation.navigate('UrlResolver', {
                      url_key: `/${category.url_path}.html`,
                    })
                  }>
                  <View style={styles.categoryImageContainer}>
                    <Image
                      source={{
                        uri: category.iconUrl,
                      }}
                      resizeMode="contain"
                      style={styles.categoryImage}></Image>
                  </View>
                  <Text allowFontScaling={false} style={styles.categoryText}>
                    {category.categoryName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}
