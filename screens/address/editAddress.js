import React from 'react';
import {View, ScrollView, Alert} from 'react-native';
import EditAddressForm from './modules/editAddress';
import {DentalkartContext} from '@dentalkartContext';
import {COUNTRIES_QUERY} from '@screens/country';
import {client} from '@apolloClient';
import {NavigationActions, StackActions} from 'react-navigation';

import {
  ADD_ADDRESS_QUERY,
  UPDATE_ADDRESS_QUERY,
  GET_ADDRESSES_QUERY,
  GET_ADDRESS_VALIDATION_RULES_QUERY,
} from './graphql';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import SyncStorage from '@helpers/async_storage';
import HeaderComponent from '@components/HeaderComponent';
import Loader from '@components/loader';
import {customerClient} from '../../apollo_client';

class EditAddressesScreen extends React.Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    const {state} = this.props.navigation;
    const item = state.params.item ? state.params.item : '';
    let alternateTelephoneIndex = item?.custom_attributes?.findIndex(
      e => e?.attribute_code === 'alternate_telephone',
    );
    this.state = {
      firstname: item?.firstname ?? '',
      lastname: item?.lastname ?? '',
      telephone: item?.telephone ?? '',
      alternate_telephone:
        item?.custom_attributes?.[alternateTelephoneIndex]?.value ?? '',
      postcode: item?.postcode ?? '',
      street: item?.street?.[0] ? item?.street?.[0] : '',
      city: item?.city ?? '',
      state: item?.region?.region ?? '',
      stateRegionId: item?.region?.region_id ?? '',
      landmark: item?.street?.[1] ? item?.street?.[1] : '',
      country_code: null,
      country: {},
      countryName: '',
      countryRegionId: item?.country_code ? item?.country_code : 'IN',
      tax: item?.vat_id ?? '',
      address_id: item?.id ?? '',
      default_shipping: item.default_shipping ? true : false,
      deliveryAddress: props.deliveryAddress,
      editData: null,
      title: item.id ? 'Edit Address' : 'Add New Address',
      isVerified: item ? true : false,
      firstnameError: '',
      lastnameError: '',
      telephoneError: '',
      alternate_telephoneError: '',
      postcodeError: '',
      streetError: '',
      cityError: '',
      countryError: '',
      stateError: '',
      locationError: '',
      country_codeError: '',
      taxError: '',
      countryList: [],
      regionList: [],
      apiValidations: {},
      isLoader: false,
      isSubmitted: item ? true : false,
      requiredFields: [
        'firstname',
        'lastname',
        'street',
        'city',
        'country_code',
        'telephone',
      ],
      onlyAlphabeticFields: ['firstname', 'lastname', 'city'],
      onlyNumericFields: ['telephone', 'alternate_telephone'],
    };
    this._inputs = {};
  }

  _next(field) {
    this._inputs[field] && this._inputs[field].focus();
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Edit Address',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };

  async requestOptionalValidations(code) {
    const {state} = this.props.navigation,
      item = state.params.item ? state.params.item : '';
    const country_code = item
      ? item.country_code
      : this.context?.country?.country_id;
    if (country_code) {
      const payload = {
        countryId: code ?? country_code,
      };
      try {
        const {data} = await client.query({
          query: GET_ADDRESS_VALIDATION_RULES_QUERY,
          variables: payload,
          fetchPolicy: 'cache-first',
        });
        if (data.getValidationRules) {
          let rules = {
            alternate_telephone_format:
              data.getValidationRules.telephone_format,
            ...data.getValidationRules,
          };
          this.setState({apiValidations: rules}, () => {
            this.validate('telephone', this.state.telephone);
            this.validate('postcode', this.state.postcode);
            this.validate(
              'alternate_telephone',
              this.state.alternate_telephone,
            );
          });
        }
      } catch (error) {
        this.setState({apiValidations: {}}, () => {
          this.validate('telephone', this.state.telephone);
          this.validate('postcode', this.state.postcode);
          this.validate('alternate_telephone', this.state.alternate_telephone);
        });
      }
    }
  }

  async componentDidMount() {
    this.triggerScreenEvent();
    this.setState({isLoader: true});
    await this.getCountries();
    const {state} = this.props.navigation,
      item = state.params.item ? state.params.item : '';
    const country_code = item
      ? item.country_code
      : this.context?.country?.country_id;
    this._onCountryValueChange(country_code);
    this._onValueChange(item?.region?.region_id);

    this.requestOptionalValidations();
    this.setState({isLoader: false});
  }

  getCountries = async () => {
    try {
      const {data} = await client.query({
        query: COUNTRIES_QUERY,
        fetchPolicy: 'cache-first',
      });
      if (data.countries) {
        let newArray = data.countries.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.full_name_english || item.id,
          };
        });
        this.setState({countryList: newArray});
      }
    } catch (error) {
      showErrorMessage(`${error.message}. Please try again.`);
    }
  };

  getRegionsByCountryAndRegionId = (countryId, regionId) => {
    if (countryId && regionId) {
      let countryInfo = this.state.countryList.filter(
        item => item.id === countryId,
      );
      if (countryInfo?.[0]?.available_regions?.length > 0) {
        let region = countryInfo?.[0]?.available_regions?.filter(
          item => item.id === regionId,
        );
        return region;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  getRegions = (countryId = 'IN') => {
    let regionList = [];
    let countryInfo = this.state.countryList.filter(
      item => item.id === countryId,
    );
    if (countryInfo?.[0]?.available_regions?.length > 0) {
      countryInfo?.[0]?.available_regions?.map(item => {
        regionList.push({
          value: item.id,
          label: item.name,
        });
        return null;
      });
    }
    this.setState({
      regionList: regionList,
      stateRegionId: regionList?.[0]?.value || countryId,
    });
  };

  changeCountry() {
    const {navigate} = this.props.navigation;
    Alert.alert(
      'Change Country',
      'After changing country, currency will be changed.',
      [
        {text: 'Change Country', onPress: () => navigate('Country')},
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  }
  _onValueChange(itemValue) {
    if (itemValue) {
      this.setState({
        stateRegionId: itemValue,
      });
      this.validate('state', itemValue);
    } else {
      this.validate('state', '');
    }
  }

  _onCountryValueChange(itemValue) {
    if (itemValue) {
      // this.setState({country_code: itemValue});
      this.getRegions(itemValue);
      this.requestOptionalValidations(itemValue);
      this.validate('country_code', itemValue);
    } else {
      this.validate('country_code', '');
    }
  }

  onSavePress = async (id = '') => {
    const {checkout} = this.props.navigation.state.params;
    const {handleError, getUserInfo} = this.context;
    try {
      // const {data} = await client.query({
      const {data} = await customerClient.query({
        query: GET_ADDRESSES_QUERY,
        fetchPolicy: 'network-only',
      });
      this.props.navigation.goBack();
    } catch (error) {
      const msg = handleError(error);
      console.log('error====Addre', error);
      showErrorMessage(`${msg}. Please try again.`);
    }
  };

  postSavingAddress = async (cache, {data}) => {
    let message, id;
    if (data.createCustomerAddressV2) {
      message = 'Address added successfully';
      id = data.createCustomerAddressV2.id;
      // this.props.navigation.navigate('Cart');
    } else {
      id = data?.updateCustomerAddressV2?.id;
      const storedAddress = (await SyncStorage.get('delivery_address')) || '';
      if (storedAddress && storedAddress.id === id) {
        let region = this.getRegionsByCountryAndRegionId(
          data?.updateCustomerAddressV2?.country_code,
          data?.updateCustomerAddressV2?.region?.region_id,
        );
        if (region?.length > 0) {
          await SyncStorage.set('delivery_address', {
            ...data.updateCustomerAddressV2,
            region: {
              region: region[0]?.name,
              region_code: region[0]?.code,
              region_id: region[0]?.id,
            },
          });
        } else {
          await SyncStorage.set('delivery_address', data.updateCustomerAddress);
        }
      }
      message = 'Address updated successfully';
    }
    showSuccessMessage(message);
    this.onSavePress(id);
  };

  saveAddress(_saveAddress) {
    this.setState({isSubmitted: true});
    const {
      firstname,
      lastname,
      telephone,
      postcode,
      tax,
      street,
      landmark,
      city,
      country_code,
      default_shipping,
      address_id,
      stateRegionId,
      alternate_telephone,
    } = this.state;

    this.validate('firstname', firstname);
    this.validate('lastname', lastname);
    this.validate('postcode', postcode);
    this.validate('telephone', telephone);
    this.validate('alternate_telephone', alternate_telephone);
    this.validate('street', street);
    this.validate('country_code', country_code);
    this.validate('city', city);
    this.validate('tax', tax);
    if (
      this.state.firstnameError !== '' ||
      this.state.lastnameError !== '' ||
      this.state.telephoneError !== '' ||
      this.state.alternate_telephoneError !== '' ||
      this.state.postcodeError !== '' ||
      this.state.stateError !== '' ||
      this.state.country_codeError !== '' ||
      this.state.streetError !== '' ||
      this.state.cityError !== '' ||
      this.state.taxError !== ''
    ) {
      showErrorMessage('Please fill your details correctly.');
      return;
    } else {
      const mergeStreet = [street, landmark];
      let variables = {
        firstname,
        lastname,
        postcode,
        telephone,
        // mobile_no_code: 'alternate_telephone',
        // mobile_no_value: alternate_telephone,
        custom_attributes: {
          attribute_code: 'alternate_telephone',
          value: alternate_telephone,
        },
        street: mergeStreet,
        country_id: country_code,
        region: {region_id: stateRegionId || 0},
        // region_id: stateRegionId || 0,
        city: city.trim(),
        vat_id: tax,
        default_shipping: default_shipping,
        default_billing: false,
      };
      if (address_id) {
        //for update address id
        variables = {id: address_id, ...variables};
      }
      _saveAddress({variables: variables});
    }
  }

  validate(fieldName, value) {
    value = value ?? value?.trim();
    this.setState({
      [fieldName]: value,
    });
    this.setState({[`${fieldName}Error`]: ''});

    let requiredString = this.state.apiValidations?.[`${fieldName}_required`];
    if (!value && requiredString !== null && requiredString !== undefined) {
      if (requiredString === true) {
        this.setState({
          [`${fieldName}Error`]: 'Field can not be empty.',
        });
        return false;
      }
    }

    let str = this.state.apiValidations?.[`${fieldName}_format`];
    if (
      value &&
      (!str || str === 'null') &&
      this.state.onlyNumericFields.includes(fieldName)
    ) {
      let reg = /^[0-9]+$/;
      if (!reg.test(value)) {
        this.setState({
          [`${fieldName}Error`]: 'This field can contains only numbers.',
        });
        return false;
      }
    }

    if (value && str && str !== 'null') {
      let index = str.lastIndexOf('/');
      let s = str.substring(0, index) + '' + str.substring(index + 1);
      let regx = new RegExp(s.replace('/', ''));
      if (!regx.test(value)) {
        this.setState({
          [`${fieldName}Error`]: 'Please enter a valid Phone number.',
        });
        return false;
      }
    }

    if (value && this.state.onlyAlphabeticFields.includes(fieldName)) {
      let reg = /^[a-zA-Z ]*$/;
      if (!reg.test(value)) {
        this.setState({
          [`${fieldName}Error`]: 'This field can contains only alphabets.',
        });
        return false;
      }
    }

    if (!value && this.state.requiredFields.includes(fieldName)) {
      this.setState({
        [`${fieldName}Error`]: 'Field can not be empty.',
      });
      return false;
    }
    return true;
  }

  render() {
    const {state} = this.props.navigation;
    const {item} = state.params;
    return (
      <View style={{flex: 1}}>
        <Loader loading={this.state.isLoader} transparent={true} />
        <HeaderComponent
          navigation={this.props.navigation}
          label={this.state.title}
          onPress={() => this.props.navigation.navigate('Address')}
          style={{height: 40}}
        />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={'none'}>
          <EditAddressForm
            _this={this}
            stateList={this.state.regionList}
            countryList={this.state.countryList}
            query={item ? UPDATE_ADDRESS_QUERY : ADD_ADDRESS_QUERY}
          />
        </ScrollView>
      </View>
    );
  }
}

export default EditAddressesScreen;
