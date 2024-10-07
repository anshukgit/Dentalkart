import React, {Component, useContext, useState} from 'react';
import {View, Text, Button, FlatList, Image, TextInput} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import Header from '@components/header';
import {COUNTRIES_LIST_QUERY, SET_COUNTRY_QUERY} from './graphql';
import {Query, Mutation} from 'react-apollo';
import {DentalkartContext} from '@dentalkartContext';
import {MEDIA_URL} from '@config/environment';
import {CountryStyle} from './country_style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OIcon from 'react-native-vector-icons/Octicons';
import Loader from '@components/loader';
import {setCountry} from '@helpers/country';
import SyncStorage from '@helpers/async_storage';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {newclient} from '@apolloClient';
import HeaderComponent from '@components/HeaderComponent';

const CountryBlock = ({country, index, navigation}) => {
  const context = useContext(DentalkartContext);
  const {
    country: currentCountry,
    handleError,
    setAppCountry,
    client,
    userInfo,
  } = context;
  const flagUrl = `${MEDIA_URL}flags/${country.two_letter_abbreviation.toLowerCase()}.png`;
  const postSettingCountry = async (cache, {data}) => {
    const newCountry = {
      country_id: country.two_letter_abbreviation,
      country: country.full_name_english,
      currency_code: data.setCurrency.currency_code,
    };
    setCountry(newCountry);
    setAppCountry(newCountry);
    await SyncStorage.remove('delivery_address');
    await client.resetStore();
    navigation.push('Home');
  };
  return (
    <View>
      {country.full_name_english && (
        <Mutation
          key={country.id}
          variables={{country_code: country.two_letter_abbreviation}}
          mutation={SET_COUNTRY_QUERY}
          update={postSettingCountry}
          onError={error => handleError(error)}>
          {(setCountry, {data, loading, error}) => {
            return (
              <View>
                <TouchableCustom
                  onPress={() => setCountry()}
                  underlayColor={'#ffffff10'}>
                  <View style={CountryStyle.cardWrapper}>
                    <View style={CountryStyle.countryNameWrapper}>
                      <Image
                        resizeMethod={'scale'}
                        source={{uri: flagUrl}}
                        style={CountryStyle.countryImage}
                      />
                      <Text
                        allowFontScaling={false}
                        style={CountryStyle.countryName}>
                        {country.full_name_english}
                      </Text>
                    </View>
                    {country.two_letter_abbreviation ==
                    currentCountry?.country_id ? (
                      <Icon
                        name="check"
                        style={CountryStyle.selectedcountryIcon}
                      />
                    ) : null}
                  </View>
                </TouchableCustom>
                <Loader loading={loading} transparent={true} />
              </View>
            );
          }}
        </Mutation>
      )}
    </View>
  );
};
const CountryList = ({countries, navigation}) => {
  const allCountries = countries;
  const [countryName, setCountryName] = useState('');
  const [countryList, setcountryList] = useState(countries);
  const searchCountry = key => {
    setCountryName(key);
    let searcResults = [];
    searcResults = allCountries.filter(country =>
      country.full_name_english
        ? country.full_name_english.toLowerCase().includes(key.toLowerCase())
        : null,
    );
    setcountryList(key ? searcResults : allCountries);
  };
  return (
    <View>
      <View style={CountryStyle.searchFieldWrapper}>
        <OIcon name="search" style={CountryStyle.searchIcon} />
        <TextInput
          value={countryName}
          onChangeText={text => searchCountry(text)}
          placeholder="Search your country..."
          returnKeyType="search"
          underlineColorAndroid="transparent"
          style={CountryStyle.searchField}
          autoFocus={true}
        />
      </View>
      <FlatList
        style={CountryStyle.countryListWrapper}
        data={countryList}
        renderItem={({item, index}) => (
          <CountryBlock country={item} index={index} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps={'always'}
        initialNumToRender={250}
        extraData={countryList}
        keyboardDismissMode={Platform.OS == 'ios' ? 'interactive' : 'on-drag'}
      />
    </View>
  );
};

export default class Country extends Component {
  static navigationOptions = {
    title: 'Change Country',
    drawerLabel: 'Change Country',
  };
  static contextType = DentalkartContext;
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Change Country`,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    const {handleError} = this.context;
    const {navigation} = this.props;
    return (
      <View>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Change Country'}
          style={{height: 40}}
        />
        <Query
          query={COUNTRIES_LIST_QUERY}
          fetchPolicy="cache-and-network"
          client={newclient}
          onError={error => handleError(error)}>
          {({loading, data, error}) => {
            if (loading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (error) return null;
            if (data.countries) {
              const {countries} = data;
              return (
                <CountryList countries={countries} navigation={navigation} />
              );
            }
          }}
        </Query>
      </View>
    );
  }
}
