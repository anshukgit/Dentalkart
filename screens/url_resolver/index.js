import React, {Component} from 'react';
import {View, ScrollView, Image, Text} from 'react-native';
import {DentalkartContext} from '@dentalkartContext';
import Loader from '@components/loader';
import Category from '@screens/category';
import ProductDetails from '@screens/product';
import Header from '@components/header';
import HeaderComponent from '@components/HeaderComponent';

export default class UrlResolver extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      pageType: null,
    };
  }
  static contextType = DentalkartContext;
  getPageType = async (url = null) => {
    const {navigation} = this.props;
    const urlKey = url ? url : navigation.getParam('url_key');
    console.log('urlKey: ===============================' + urlKey);

    const {urlResolver} = this.context;
    console.log(urlKey);
    const page = await urlResolver(urlKey);
    console.log('page======', page);
    if (!page?.urlResolver) {
      this.props.navigation.navigate('Home');
    } else {
      this.setState({loading: false, pageType: page});
    }
  };
  componentDidMount() {
    this.getPageType();
  }
  componentDidUpdate(prevProps) {
    let prevUrl = prevProps.navigation.getParam('url_key');
    let newUrl = this.props.navigation.getParam('url_key');
    if (prevUrl !== newUrl) {
      this.getPageType();
    }
  }
  render() {
    const {loading, pageType} = this.state;
    const {navigation} = this.props;
    const {userInfo} = this.context;
    const urlKey = navigation?.getParam('url_key');
    const referralCode = navigation?.getParam('referralCode');
    const referType = navigation?.getParam('referType');
    return (
      <View style={{flex: 1}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={''}
          style={{height: 40}}
        />

        {loading ? (
          <Loader loading={loading} transparent={true} />
        ) : (
          <>
            {!loading && pageType && pageType.urlResolver ? (
              <View style={{flex: 1}}>
                {pageType.urlResolver.type === 'CATEGORY' ? (
                  <Category
                    urlResolver={pageType.urlResolver}
                    navigation={this.props.navigation}
                    getNewPageType={url => this.getPageType(url)}
                  />
                ) : (
                  <View style={{flex: 1}}>
                    <ProductDetails
                      urlKey={urlKey}
                      productId={pageType?.urlResolver?.id}
                      navigation={this.props.navigation}
                      referralCode={referralCode}
                      referType={referType}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View>
                <Image
                  source={{
                    uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Error/err404.png',
                  }}
                  style={{width: '100%', height: '70%'}}
                  resizeMode={'contain'}
                />
                <Text style={{textAlign: 'center'}} allowFontScaling={false}>
                  Oops!! the page have been moved.
                </Text>
                <Text style={{textAlign: 'center'}} allowFontScaling={false}>
                  Go to our home page.
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  }
}
