import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {DentalkartContext} from '@dentalkartContext';
import {client, newclient} from '@apolloClient';
import sortByPosition from '@helpers/sort_by_position';
import {Query} from 'react-apollo';
import GET_FEATURED_BRANDS_QUERY from '../graphql/get_featured_brand.gql.js';
import styles from './featured_brand.style.js';
import AnalyticsEvents from '../../../components/Analytics/AnalyticsEvents.js';

const assetsLinks = {
  a: 'https://dentalkart-media.s3.ap-south-1.amazonaws.com/React/Brand+Page+Slider/Asset+4.png',
  b: 'https://dentalkart-media.s3.ap-south-1.amazonaws.com/React/Brand+Page+Slider/Asset+3.png',
  c: 'https://dentalkart-media.s3.ap-south-1.amazonaws.com/React/Brand+Page+Slider/Asset+2.png',
};

class FeaturedBrands extends Component {
  static contextType = DentalkartContext;

  assetsFunction = () => {
    return (
      <View style={styles.assetsWrapper}>
        <View style={styles.assetsImageBox}>
          <Image
            source={{
              uri: assetsLinks.a,
            }}
            style={styles.assetsImage}></Image>
          <Text allowFontScaling={false}>280+ Brands</Text>
        </View>
        <View style={styles.assetsImageBox}>
          <Image
            source={{
              uri: assetsLinks.b,
            }}
            style={styles.assetsImage}></Image>
          <Text allowFontScaling={false}>20000+ products</Text>
        </View>
        <View style={styles.assetsImageBox}>
          <Image
            source={{
              uri: assetsLinks.c,
            }}
            style={styles.assetsImage}></Image>
          <Text allowFontScaling={false}>100% genuine</Text>
        </View>
      </View>
    );
  };

  brandbody = ({datalist}) => {
    return (
      <View>
        <Text allowFontScaling={false} style={styles.topText}>
          Featured Brands
        </Text>
        <View style={styles.featuredBrandWrapper}>
          {datalist.map(
            (value, index) =>
              value.is_active &&
              index < 8 && (
                <TouchableOpacity
                  key={index.toString()}
                  style={styles.imageWrapper}
                  activeOpacity={0.4}
                  onPress={() => {
                    AnalyticsEvents('TOP_BRANDS', 'Brand Selected-Home page', {
                      brandName: value.name,
                    });
                    this.props.navigation.navigate('UrlResolver', {
                      url_key: `/${value.url_path}.html`,
                    });
                  }}>
                  <View style={styles.imageBox}>
                    <Image
                      source={{
                        uri: `${value.logo}`,
                      }}
                      style={styles.image}></Image>
                  </View>
                  <Text allowFontScaling={false} style={styles.bottomText}>
                    {value.name}
                  </Text>
                </TouchableOpacity>
              ),
          )}
        </View>
      </View>
    );
  };

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
                  <View>
                    {/*this.assetsFunction()*/}
                    {this.brandbody({datalist})}
                  </View>
                );
              } else if (error) {
                return (
                  <Text allowFontScaling={false}>{JSON.stringify(error)}</Text>
                );
              } else if (loading) {
                return <Text allowFontScaling={false}>Loading...</Text>;
              } else return null;
            }}
          </Query>
        </View>
      </View>
    );
  }
}

export default FeaturedBrands;
