import React, {Component} from 'react';
import {
  View,
  FlatList,
  Image,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  InteractionManager,
  Platform,
} from 'react-native';
import Header from '@components/header';
import {brandingStyle} from './branding.style';
import {
  DeviceWidth as Width,
  DeviceHeight as Height,
} from '@config/environment';
import {Query} from 'react-apollo';
import {GET_TEMPLATE_QUERY} from './graphql';
import Loader from '@components/loader';
import {showErrorMessage} from '../../helpers/show_messages';
import {newclient} from '../../apollo_client';
import {Text} from 'react-native';
import {BASE_URL, DeviceHeight, StatusBarHeight} from '@config/environment';
import HeaderComponent from '@components/HeaderComponent';

class Branding extends Component {
  _handleNavigation(item) {
    const {navigate} = this.props.navigation;
    console.log('_handleNavigation', item);
    if (item.landingURL && item.landingURL.includes('membership')) {
      navigate('MemberShip');
    } else if (item.landingURL && item.landingURL === '/brands') {
      InteractionManager.runAfterInteractions(() => {
        navigate('BrandPageScreen');
      });
    } else if (item.landingURL) {
      if (item.landingURL === '/' || item.landingURL === '//') {
        navigate('Home');
      } else {
        InteractionManager.runAfterInteractions(() => {
          navigate('UrlResolver', {url_key: item.landingURL});
        });
      }
    } else {
      InteractionManager.runAfterInteractions(() => {
        navigate('Home');
      });
    }
  }
  render() {
    const {navigation} = this.props;
    const saleUrl = navigation.state.params
      ? navigation.state.params.saleUrl
      : '';
    let templateId = '';
    if (saleUrl) {
      const splitArr = saleUrl.split('/');
      templateId = splitArr[splitArr.length - 1];
    }
    const checkValidity = (startDate, expiryDate) => {
      let startTime = new Date(startDate).getTime();
      let endTime = new Date(expiryDate).getTime();
      let currentTime =
        new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;
      let validity =
        currentTime > startTime && currentTime < endTime ? true : false;
      return validity;
    };
    return (
      <View style={brandingStyle.saleWrapper}>
        <Query
          query={GET_TEMPLATE_QUERY}
          variables={{templateId: templateId}}
          fetchPolicy="network-only"
          client={newclient}
          onError={error => {
            console.log('error : ', error);
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {({data, loading, error}) => {
            console.log('brandingStyle ========data', JSON.stringify(data));
            if (loading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (data && data.getTemplatesById) {
              const product = data.getTemplatesById;
              const validity = checkValidity(
                data.getTemplatesById.startDate,
                data.getTemplatesById.expiryDate,
              );
              this.product = product.rows;
              if (!product) {
                return (
                  <Text allowFontScaling={false}>
                    The requested sale doesn't exist
                  </Text>
                );
              }
              if (!validity) {
                console.log('validate fail ed ========================');
                const {navigation} = this.props;
                navigation.navigate('Home');
              }
              return (
                <>
                  <HeaderComponent
                    navigation={this.props.navigation}
                    label={data.getTemplatesById.templateName}
                    style={{height: 40}}
                  />
                  <ScrollView style={{marginBottom: 50}}>
                    <FlatList
                      data={this.product}
                      renderItem={({item}) => {
                        let totalWidth = 0;
                        item.column.map(
                          cn => (totalWidth = totalWidth + Number(cn.width)),
                        );
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <FlatList
                              data={item.column}
                              renderItem={({item}) => {
                                if (item.landingURL) {
                                  return (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this._handleNavigation(item)
                                      }>
                                      <View>
                                        <Image
                                          source={{uri: item.mimgURL}}
                                          style={{
                                            resizeMode: 'cover',
                                            width:
                                              (Number(item.width) /
                                                totalWidth) *
                                              Width,
                                            height:
                                              ((Number(item.width) /
                                                totalWidth) *
                                                Width *
                                                Number(item.height)) /
                                              Number(item.width),
                                          }}
                                          resizeMethod={'resize'}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  );
                                } else {
                                  return (
                                    <View>
                                      <Image
                                        source={{uri: item.mimgURL}}
                                        style={{
                                          resizeMode: 'cover',
                                          width:
                                            (Number(item.width) / totalWidth) *
                                            Width,
                                          height:
                                            ((Number(item.width) / totalWidth) *
                                              Width *
                                              Number(item.height)) /
                                            Number(item.width),
                                        }}
                                        resizeMethod={'resize'}
                                      />
                                    </View>
                                  );
                                }
                              }}
                              keyExtractor={item => item.mimgURL}
                              horizontal={true}
                            />
                          </View>
                        );
                      }}
                      keyExtractor={item => item.row_id}
                      initialNumToRender={5}
                    />
                  </ScrollView>
                </>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}
export default Branding;

// console.log('-------------');
// console.log('-------------');
// console.log('-------------');
// console.log('-------------');
// console.log('-------------');
// console.log(JSON.stringify(data.getTemplatesById.startDate, null, "\t"));
// console.log(validity);
// console.log(JSON.stringify(data.getTemplatesById.expiryDate, null, "\t"));
// console.log('-------------');
// console.log('-------------');
// console.log('-------------');
// console.log('-------------');
// console.log('-------------');
