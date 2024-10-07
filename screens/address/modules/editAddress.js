import React, {useState, Fragment} from 'react';
import {Text, View, TouchableOpacity, Switch} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import {EditAddress} from './editAddressStyle';
import {SecondaryColor} from '@config/environment';
import {Mutation} from 'react-apollo';
import {showErrorMessage} from '../../../helpers/show_messages';
import {Platform} from 'react-native';
import {StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import TextInputComponent from '@components/TextInputComponent';
import RNPickerSelect from 'react-native-picker-select';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {customerClient} from '../../../apollo_client';

const EditAddressForm = ({_this, stateList, countryList, query}) => {
  const {state} = _this.props.navigation,
    checkout = state.params?.checkout;
  const addressCount = state.params?.addressCount;
  const addressFormType = state.params?.type;
  let customStateList = stateList;
  const [st, setSt] = useState(_this.state.stateRegionId);
  const [ct, setCt] = useState(_this.state.country_code);
  return (
    <View style={[EditAddress.container]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}>
        <View style={[EditAddress.inputFieldGroup]}>
          <View style={EditAddress.textinputMainView}>
            <View style={EditAddress.textinputSubView}>
              <Text allowFontScaling={false} style={EditAddress.labelText}>
                First Name{' '}
                <Text allowFontScaling={false} style={EditAddress.AsteriskIcon}>
                  *
                </Text>
              </Text>
              <TextInputComponent
                placeholder="" //Josh
                placeholderTextColor={SecondaryColor}
                onChangeText={firstname =>
                  _this.validate('firstname', firstname)
                }
                value={_this.state.firstname}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => _this._next('one')}
                blurOnSubmit={false}
                autoFocus={true}
                style={[
                  EditAddress.TextInput,
                  _this.state.isSubmitted && _this.state.firstnameError
                    ? EditAddress.errorColor
                    : {},
                ]}
                errorTxt={_this.state.firstnameError}
                isError={true}
              />
            </View>
            <View style={[EditAddress.textinputSubView]}>
              <Text allowFontScaling={false} style={EditAddress.labelText}>
                Last Name{' '}
                <Text allowFontScaling={false} style={EditAddress.AsteriskIcon}>
                  *
                </Text>
              </Text>
              <TextInputComponent
                placeholder="" //Brolin
                placeholderTextColor={SecondaryColor}
                onChangeText={lastname => _this.validate('lastname', lastname)}
                value={_this.state.lastname}
                autoCapitalize="none"
                id={ref => {
                  _this._inputs.one = ref;
                }}
                returnKeyType="next"
                onSubmitEditing={() => _this._next('two')}
                blurOnSubmit={false}
                style={[
                  EditAddress.TextInput,
                  _this.state.isSubmitted && _this.state.lastnameError
                    ? EditAddress.errorColor
                    : {},
                ]}
                errorTxt={_this.state.lastnameError}
                isError={true}
              />
            </View>
          </View>
          <View style={[{marginTop: 8}]}>
            <Text allowFontScaling={false} style={EditAddress.labelText}>
              Mobile{' '}
              <Text allowFontScaling={false} style={EditAddress.AsteriskIcon}>
                *
              </Text>
            </Text>
            <TextInputComponent
              placeholder="" //1234567890
              placeholderTextColor={SecondaryColor}
              onChangeText={telephone => _this.validate('telephone', telephone)}
              value={_this.state.telephone}
              keyboardType={'numeric'}
              maxLength={10}
              errorTxt={_this.state.telephoneError}
              isError={true}
              style={[
                EditAddress.emailTextInputView,
                _this.state.isSubmitted && _this.state.telephoneError
                  ? EditAddress.errorColor
                  : {},
              ]}
              id={ref => {
                _this._inputs.two = ref;
              }}
              returnKeyType="next"
              onSubmitEditing={() => _this._next('three')}
              blurOnSubmit={false}
            />
          </View>
          <View style={[{marginTop: 8}]}>
            <Text allowFontScaling={false} style={EditAddress.labelText}>
              Alternate Telephone Number{' '}
            </Text>
            <TextInputComponent
              placeholder="" //1234567890
              placeholderTextColor={SecondaryColor}
              onChangeText={altTelephone =>
                _this.validate('alternate_telephone', altTelephone)
              }
              value={_this.state.alternate_telephone}
              keyboardType={'numeric'}
              maxLength={10}
              errorTxt={_this.state.alternate_telephoneError}
              isError={true}
              style={[
                EditAddress.emailTextInputView,
                _this.state.isSubmitted && _this.state.alternate_telephoneError
                  ? EditAddress.errorColor
                  : {},
              ]}
              id={ref => {
                _this._inputs.three = ref;
              }}
              returnKeyType="next"
              onSubmitEditing={() => _this._next('four')}
              blurOnSubmit={false}
            />
          </View>

          <View style={[{marginTop: 8}]}>
            <Text allowFontScaling={false} style={EditAddress.labelText}>
              Street{' '}
              <Text allowFontScaling={false} style={EditAddress.AsteriskIcon}>
                *
              </Text>
            </Text>
            <TextInputComponent
              placeholder="" //North End Road.
              placeholderTextColor={SecondaryColor}
              onChangeText={street => _this.validate('street', street)}
              value={_this.state.street}
              errorTxt={_this.state.streetError}
              isError={true}
              style={[
                EditAddress.TextInput,
                _this.state.isSubmitted && _this.state.streetError
                  ? EditAddress.errorColor
                  : {},
              ]}
              id={ref => {
                _this._inputs.four = ref;
              }}
              returnKeyType="next"
              onSubmitEditing={() => _this._next('five')}
              blurOnSubmit={false}
            />
          </View>

          <View style={[{marginTop: 8}]}>
            <Text allowFontScaling={false} style={EditAddress.labelText}>
              Landmark(optional)
            </Text>
            <TextInputComponent
              placeholder="" //India Gate
              placeholderTextColor={SecondaryColor}
              onChangeText={landmark => _this.setState({landmark})}
              value={_this.state.landmark}
              id={ref => {
                _this._inputs.five = ref;
              }}
              returnKeyType="next"
              onSubmitEditing={() => _this._next('six')}
              blurOnSubmit={false}
              isError={true}
              style={[EditAddress.TextInput]}
            />
          </View>

          <View style={[EditAddress.textinputMainView, {marginTop: 13}]}>
            <View style={EditAddress.textinputSubView}>
              <Text allowFontScaling={false} style={EditAddress.labelText}>
                City{' '}
                <Text allowFontScaling={false} style={EditAddress.AsteriskIcon}>
                  *
                </Text>
              </Text>
              <TextInputComponent
                placeholder="" //New Delhi
                placeholderTextColor={SecondaryColor}
                onChangeText={city => _this.validate('city', city)}
                value={_this.state.city}
                errorTxt={_this.state.cityError}
                isError={true}
                style={[
                  EditAddress.TextInput,
                  _this.state.isSubmitted && _this.state.cityError
                    ? EditAddress.errorColor
                    : {},
                ]}
                id={ref => {
                  _this._inputs.six = ref;
                }}
                returnKeyType="next"
                onSubmitEditing={() => _this._next('seven')}
                blurOnSubmit={false}
              />
            </View>
            <View style={EditAddress.textinputSubView}>
              <Text allowFontScaling={false} style={EditAddress.labelText}>
                Pincode{' '}
                <Text allowFontScaling={false} style={EditAddress.AsteriskIcon}>
                  *
                </Text>
              </Text>
              <TextInputComponent
                placeholder="" //110001
                placeholderTextColor={SecondaryColor}
                onChangeText={postcode => _this.validate('postcode', postcode)}
                value={_this.state.postcode}
                keyboardType={'numeric'}
                maxLength={6}
                errorTxt={_this.state.postcodeError}
                isError={true}
                errorStyle={{fontSize: 10}}
                style={[
                  EditAddress.TextInput,
                  _this.state.isSubmitted && _this.state.postcodeError
                    ? EditAddress.errorColor
                    : {},
                ]}
                id={ref => {
                  _this._inputs.seven = ref;
                }}
              />
            </View>
          </View>
          <Fragment>
            {countryList ? (
              <View style={[{marginTop: 8, height: 80}]}>
                <Text allowFontScaling={false} style={EditAddress.labelText}>
                  Select Country{' '}
                  <Text
                    allowFontScaling={false}
                    style={EditAddress.AsteriskIcon}>
                    *
                  </Text>
                </Text>
                <View
                  style={[
                    EditAddress.dropdownWrapper,
                    _this.state.isSubmitted && _this.state.country_codeError
                      ? EditAddress.errorColor
                      : {},
                  ]}>
                  {Platform.OS == 'android' ? (
                    <Picker
                      selectedValue={_this.state.country_code}
                      onValueChange={itemValue => {
                        setCt(itemValue);
                        _this._onCountryValueChange(itemValue);
                      }}
                      itemStyle={{
                        borderColor: 'green',
                        borderWidth: 1,
                        marginTop: -100,
                      }}
                      placeholder={'India'}
                      mode={'dropdown'}
                      style={[pickerSelectStyles.inputAndroid]}>
                      {countryList.map((country, index) => {
                        return (
                          <Picker.Item
                            key={index?.toString()}
                            label={country.label}
                            value={country.value}
                          />
                        );
                      })}
                    </Picker>
                  ) : (
                    <View
                      style={[
                        pickerSelectStyles.inputAndroid,
                        {paddingHorizontal: 15, justifyContent: 'center'},
                      ]}>
                      <RNPickerSelect
                        onValueChange={itemValue => {
                          setCt(itemValue);
                          _this._onCountryValueChange(itemValue);
                        }}
                        style={pickerSelectStyles.inputAndroid}
                        items={countryList}
                        value={_this.state.country_code}
                      />
                    </View>
                  )}
                </View>
              </View>
            ) : null}
          </Fragment>

          {false ? (
            <View style={{width: '100%'}}>
              <Text allowFontScaling={false} style={EditAddress.labelText}>
                State{' '}
                <Text allowFontScaling={false} style={EditAddress.AsteriskIcon}>
                  *
                </Text>
              </Text>
              <TextInputComponent
                placeholder="" //Delhi
                placeholderTextColor={SecondaryColor}
                onChangeText={state => _this.validate('state', state)}
                value={_this.state.state}
                errorTxt={_this.state.stateError}
                isError={true}
                style={[
                  EditAddress.emailTextInputView,
                  _this.state.isSubmitted && _this.state.stateError
                    ? EditAddress.errorColor
                    : {},
                ]}
              />
            </View>
          ) : (
            <Fragment>
              {customStateList ? (
                <View style={[{marginTop: 8, height: 80}]}>
                  <Text allowFontScaling={false} style={EditAddress.labelText}>
                    Select State{' '}
                    <Text
                      allowFontScaling={false}
                      style={EditAddress.AsteriskIcon}>
                      *
                    </Text>
                  </Text>
                  <View
                    style={[
                      EditAddress.dropdownWrapper,
                      _this.state.isSubmitted && _this.state.stateError
                        ? EditAddress.errorColor
                        : {},
                    ]}>
                    {Platform.OS == 'android' ? (
                      <Picker
                        selectedValue={st}
                        onValueChange={itemValue => {
                          setSt(itemValue);
                          _this._onValueChange(itemValue);
                        }}
                        itemStyle={{
                          borderColor: 'green',
                          borderWidth: 1,
                          marginTop: -100,
                        }}
                        placeholder={'Delhi'}
                        mode={'dropdown'}
                        style={[pickerSelectStyles.inputAndroid]}>
                        {customStateList.map((state, index) => {
                          return (
                            <Picker.Item
                              key={index?.toString()}
                              label={state.label}
                              value={state.value}
                            />
                          );
                        })}
                      </Picker>
                    ) : (
                      <View
                        style={[
                          pickerSelectStyles.inputAndroid,
                          {paddingHorizontal: 15, justifyContent: 'center'},
                        ]}>
                        <RNPickerSelect
                          onValueChange={itemValue => {
                            setSt(itemValue);
                            _this._onValueChange(itemValue);
                          }}
                          style={pickerSelectStyles.inputAndroid}
                          items={customStateList}
                          value={_this.state.stateRegionId}
                        />
                      </View>
                    )}
                  </View>
                </View>
              ) : null}
            </Fragment>
          )}

          {checkout ? (
            <TouchableOpacity
              onPress={() => _this.changeCountry()}
              style={EditAddress.countryCangeWrapper}>
              <View>
                <Text
                  allowFontScaling={false}
                  style={EditAddress.changeCountryText}>
                  Change?
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          <View style={[{marginTop: 12}]}>
            <Text allowFontScaling={false} style={EditAddress.labelText}>
              {_this.state?.apiValidations?.tax_label || 'Tax'}
            </Text>

            <TextInputComponent
              placeholder="" //20AAACB2894G1Z1
              placeholderTextColor={SecondaryColor}
              onChangeText={tax => _this.validate('tax', tax)}
              value={_this.state?.tax}
              keyboardType={'default'}
              style={[
                EditAddress.emailTextInputView,
                _this.state.isSubmitted && _this.state.taxError
                  ? EditAddress.errorColor
                  : {},
              ]}
              errorTxt={_this.state.taxError}
              isError={true}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          {((addressCount > 0 && addressFormType === 'add') ||
            (addressCount > 1 && addressFormType === 'edit')) && (
            <TouchableOpacity
              onPress={() =>
                _this.setState({
                  default_shipping: !_this.state.default_shipping,
                })
              }
              style={[EditAddress.checkBoxWrapper, {marginTop: 15}]}>
              <View
                style={{
                  width: '80%',
                  height: 45,
                  justifyContent: 'space-around',
                }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    EditAddress.checkBoxText,
                    {fontSize: 16, fontWeight: '500', color: '#34495B'},
                  ]}>
                  Set as default
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    EditAddress.checkBoxText,
                    {fontSize: 12, color: '#7E94A8'},
                  ]}>
                  Information is encrypted and securely stored
                </Text>
              </View>

              <View
                style={{width: '20%', height: 45, justifyContent: 'center'}}>
                <Switch
                  trackColor={{false: '#E0E0E0', true: '#aaa'}}
                  thumbColor={'#6B90BC'}
                  ios_backgroundColor={'#E0E0E0'}
                  onValueChange={() =>
                    _this.setState({
                      default_shipping: !_this.state.default_shipping,
                    })
                  }
                  value={_this.state.default_shipping}
                />
              </View>
            </TouchableOpacity>
          )}

          <View style={[EditAddress.textinputMainView]}>
            <View style={EditAddress.textinputSubView}>
              <TouchableCustom
                underlayColor={'#ffffff10'}
                onPress={() => _this.props.navigation.navigate('Address')}>
                <View
                  style={[
                    EditAddress.button,
                    {
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: '#6B90BC',
                    },
                    ,
                  ]}>
                  <Text
                    allowFontScaling={false}
                    style={[EditAddress.buttonText, {color: '#6B90BC'}]}>
                    Cancel
                  </Text>
                </View>
              </TouchableCustom>
            </View>
            <View style={EditAddress.textinputSubView}>
              <Mutation
                mutation={query}
                client={customerClient}
                update={_this.postSavingAddress.bind(_this)}
                onError={error => {
                  console.log('error==========', error);
                  showErrorMessage(`${error.message}. Please try again.`);
                }}>
                {(saveAddress, {data, loading, error}) => {
                  if (loading) {
                    return (
                      <View style={EditAddress.button}>
                        <Text
                          allowFontScaling={false}
                          style={EditAddress.buttonText}>
                          Saving...
                        </Text>
                      </View>
                    );
                  }
                  return (
                    <TouchableCustom
                      activeOpacity={_this.state.isVerified ? 0 : 1}
                      underlayColor={'#ffffff10'}
                      onPress={() => {
                        _this.saveAddress(saveAddress);
                      }}>
                      <View style={EditAddress.button}>
                        <Text
                          allowFontScaling={false}
                          style={EditAddress.buttonText}>
                          Save
                        </Text>
                      </View>
                    </TouchableCustom>
                  );
                }}
              </Mutation>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    color: '#282828',
    borderWidth: 1,
    width: '100%',
  },
  inputAndroid: {
    height: 40,
    width: '100%',
    color: '#000',
    borderWidth: 1,
    borderColor: colors.LightCyan,
    borderRadius: 3,
  },
});
export default EditAddressForm;
