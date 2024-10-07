import React from 'react';
import {ScrollView, View} from 'react-native';
import FeaturedBrands from './featured_brand';
import AllBrands from './all_brands';
import HeaderComponent from '@components/HeaderComponent';

export class BrandPageScreen extends React.Component {
  render() {
    return (
      <View>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'All Brands'}
          style={{height: 40}}
        />
        <ScrollView ref={(ref) => (this.scrollView = ref)}>
          <View
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              marginTop: 5,
              marginBottom: 80,
              backgroundColor: '#f0f0f0',
            }}>
            <FeaturedBrands navigation={this.props.navigation} />
            <AllBrands navigation={this.props.navigation} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default BrandPageScreen;
