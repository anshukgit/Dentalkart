import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {client, newclient} from '@apolloClient';
import sortByPosition from '@helpers/sort_by_position';
import {Query} from 'react-apollo';
import GET_FEATURED_BRANDS_QUERY from '../../../brandPage/graphql/get_featured_brand.gql.js';
import styles from '../../../brandPage/featured_brand/featured_brand.style.js';
import {DeviceWidth} from '@config/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents.js';

class TopFeaturedBrands extends Component {
  render() {
    return (
      <View>
        <View>
          <Query
            query={GET_FEATURED_BRANDS_QUERY}
            fetchPolicy="cache-and-network"
            client={newclient}>
            {({data, loading, error}) => {
              if (data && data.getBrand) {
                const datalist = sortByPosition(data.getBrand);
                return (
                  <View
                    style={{
                      marginBottom: 12,
                      marginTop: 12,
                      marginHorizontal: 7,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        paddingLeft: 6,
                        paddingRight: 6,
                        marginBottom: 10,
                        alignItems: 'center',
                      }}>
                      <Text allowFontScaling={false} style={styles.topText}>
                        Top Brands
                      </Text>
                      <TouchableOpacity
                        style={styles.brandButton}
                        onPress={() => {
                          AnalyticsEvents('VIEW_ALL', 'All Click', {}),
                            this.props.navigation.navigate('BrandPageScreen');
                        }}>
                        <Text allowFontScaling={false} style={styles.BrandText}>
                          View all
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                          }}>
                          {datalist.map(
                            (value, index) =>
                              value.is_active &&
                              index < 8 && (
                                <TouchableOpacity
                                  style={{
                                    width: wp('22%'),
                                    alignItems: 'center',
                                    marginBottom: hp('2%'),
                                    marginRight: wp('2%'),
                                  }}
                                  key={index?.toString()}
                                  onPress={() => {
                                    AnalyticsEvents(
                                      'TOP_BRANDS',
                                      'Brand Selected-Home page',
                                      {
                                        brandName: value.name,
                                      },
                                    );
                                    this.props.navigation.navigate(
                                      'UrlResolver',
                                      {url_key: `/${value.url_path}.html`},
                                    );
                                  }}>
                                  <View style={styles.TopBrandImageContainer}>
                                    <Image
                                      source={{
                                        uri: `${value.logo}`,
                                      }}
                                      resizeMode="contain"
                                      style={styles.TopBrandImage}></Image>
                                  </View>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.bottomText}>
                                    {value.name}
                                  </Text>
                                </TouchableOpacity>
                              ),
                          )}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                );
              } else if (error) {
                return (
                  <Text allowFontScaling={false}>{JSON.stringify(error)}</Text>
                );
              } else if (loading) {
                return null;
              } else return null;
            }}
          </Query>
        </View>
      </View>
    );
  }
}

export default TopFeaturedBrands;
