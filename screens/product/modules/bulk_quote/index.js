import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {BULK_ORDER_MUTATION, DEMO_REQUEST} from '../../graphql';
import {
  View,
  Modal,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ToastAndroid,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import styles from './bulk_quote.style';
import Header from '@components/header';
import {validateEmail, validateMobile, validateName} from '@helpers/validator';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import {SafeAreaView} from 'react-navigation';
import HeaderComponent from '@components/HeaderComponent';
import {newclient} from '@apolloClient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';
import {Query} from 'react-apollo';
import {GET_GROUP_PRODUCT_QUERY} from '../../graphql';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// export default class BulKQuote extends Component{
//     render(){
//         return(
//             <View>
//                 <Text allowFontScaling={false}>Nakul</Text>
//             </View>
//         )
//     }
// }
let groupedProductData = [];
DropDownPicker.setListMode('SCROLLVIEW');
export default class BulKQuote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userNameError: '',
      userPhone: '',
      userPhoneError: '',
      userEmail: '',
      userEmailError: '',
      userPincode: '',
      userPincodeError: null,
      expectedPrice: null,
      expectedPriceError: null,
      bulkQuantity: null,
      bulkQuantityError: null,
      clinicName: null,
      clinicNameError: null,
      address: null,
      addressError: null,
      product_id: '',
      keyboardShown: false,
      open: false,
      value: '',
      productError: null,
      items: [],
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({keyboardShown: true});
  };

  _keyboardDidHide = () => {
    this.setState({keyboardShown: false});
  };

  handleBulkOrderDataChange = (name, value) => {
    if (value) {
      this.setState({
        [name]: value,
        [`${name}Error`]: '',
      });
    } else {
      this.setState({
        [name]: '',
      });
    }
  };
  onBulkOrderSubmit = async (bulkOrderMutation, source) => {
    const {
      userName,
      userEmail,
      userPhone,
      userPincode,
      bulkQuantity,
      expectedPrice,
      clinicName,
      address,
    } = this.state;
    let allClear = true;
    if (!userName) {
      this.setState({userNameError: 'Name is required field.'});
      allClear = false;
      // return false;
    } else if (userName && !(await validateName(userName))) {
      this.setState({userNameError: 'please enter only alphabets.'});
    } else {
      this.setState({userNameError: ''});
    }
    if (!userPhone) {
      this.setState({userPhoneError: 'Phone is required field.'});
      allClear = false;
      // return false;
    } else if (userPhone && !(await validateMobile(userPhone))) {
      this.setState({userPhoneError: 'please enter correct phone number.'});
      allClear = false;
      // return false;
    } else {
      this.setState({userPhoneError: ''});
    }
    if (!userEmail) {
      this.setState({userEmailError: 'Email is required field.'});
      allClear = false;
      // return false;
    } else if (userEmail && !(await validateEmail(userEmail))) {
      this.setState({userEmailError: 'Please enter correct email'});
      allClear = false;
      // return false;
    } else {
      this.setState({userEmailError: ''});
    }
    if (!userPincode) {
      this.setState({userPincodeError: 'please enter pincode'});
      allClear = false;
      // return false;
    } else if (userPincode && userPincode.length !== 6) {
      this.setState({userPincodeError: 'please enter valid pincode.'});
      allClear = false;
      // return false;
    } else {
      this.setState({userPincodeError: ''});
    }
    if (this.props.product.type_id === 'grouped' && this.state.value === '') {
      this.setState({productError: 'Please select a product'});
      allClear = false;
    } else {
      this.setState({productError: null});
    }

    if (source === 2) {
      if (!address) {
        this.setState({addressError: 'Address is required field.'});
        allClear = false;
      } else {
        this.setState({addressError: null});
      }
    } else {
      if (!expectedPrice) {
        this.setState({expectedPriceError: 'Please enter expected price.'});
        allClear = false;
        // return false;
      } else {
        this.setState({expectedPriceError: null});
      }
      if (!bulkQuantity) {
        this.setState({bulkQuantityError: 'Quantity is required field.'});
        allClear = false;
        // return false;
      } else {
        this.setState({bulkQuantityError: null});
      }
    }

    if (expectedPrice && source === 0) {
      let price =
        this.state.value !== ''
          ? groupedProductData.filter(item => item?.id === this.state.value)[0]
              ?.price
          : this.props.product?.price;
      let inRange =
        expectedPrice <= price.minimalPrice.amount.value &&
        expectedPrice >= price.minimalPrice.amount.value * 0.5;
      let totalPrice = expectedPrice * bulkQuantity;
      if (!inRange) {
        this.setState({
          expectedPriceError: `Excpected price should not be less then Rs ${
            price.minimalPrice.amount.value * 0.5
          }`,
        });
        allClear = false;
      }
      if (bulkQuantity && inRange && totalPrice < 10000) {
        Alert.alert('Overall purchase must be greater than Rs. 10000');
        allClear = false;
      }
    }
    if (
      allClear &&
      this.getOptionalLogic(source) &&
      (this.state.userPincodeError === null ||
        this.state.userPincodeError === '') &&
      this.state.userPincode !== '' &&
      (this.state.userNameError === '' || this.state.userNameError === null) &&
      this.state.userName !== '' &&
      (this.state.userPhoneError === '' ||
        this.state.userPhoneError === null) &&
      this.state.userPhone !== '' &&
      (this.state.userEmailError === '' ||
        this.state.userEmailError === null) &&
      this.state.userEmail !== '' &&
      (this.state.productError === '' || this.state.productError === null)
    ) {
      bulkOrderMutation();
    } else {
      return false;
    }
  };

  getOptionalLogic = source => {
    if (source === 2) {
      return (
        (this.state.addressError === null || this.state.addressError === '') &&
        this.state.address !== ''
      );
    } else {
      return (
        (this.state.bulkQuantityError === null ||
          this.state.bulkQuantityError === '') &&
        this.state.bulkQuantity !== '' &&
        (this.state.expectedPriceError === null ||
          this.state.expectedPriceError === '') &&
        this.state.expectedPrice !== ''
      );
    }
  };
  handleError = ({graphQLErrors, networkError, operation, response}) => {
    if (graphQLErrors) {
      graphQLErrors.map(({message, category, path, debugMessage}) => {
        switch (category) {
          case 'graphql-authorization':
            console.warn(message);
            break;
          case 'internal':
            console.warn(message);
            break;
          default:
            if (Platform.OS === 'ios') {
              return setTimeout(() => Alert.alert(message), 500);
            } else {
              return setTimeout(() => Alert.alert(message), 500);
              // return showErrorMessage(message);
            }
            console.warn(message);
        }
        return null;
      });
    } else if (networkError) {
      console.warn(JSON.stringify(networkError));
    } else if (operation) {
      console.warn(JSON.stringify(operation));
    } else if (response) {
      console.warn(JSON.stringify(response));
    }
  };
  postBulkOrderSubmit = ({data}) => {
    console.log(data);
    const {_this, closeBulkModal} = this.props;
    this.setState({
      userName: '',
      userNameError: '',
      userPhone: '',
      userPhoneError: '',
      userEmail: '',
      userEmailError: '',
      userPincode: '',
      userPincodeError: '',
      expectedPrice: null,
      expectedPriceError: '',
      bulkQuantity: null,
      bulkQuantityError: '',
      clinicName: null,
      address: null,
      addressError: '',
      product_id: '',
      value: '',
      productError: null,
    });
    if (data) {
      if (Platform.OS === 'ios') {
        return setTimeout(
          () =>
            Alert.alert('', 'Request received successfully', [
              {text: 'OK', onPress: () => closeBulkModal()},
            ]),
          500,
        );
      } else {
        closeBulkModal();
        return showSuccessMessage('Request received successfully');
      }
    } else {
      return null;
    }
  };

  onCancel = () => {
    this.props.closeBulkModal();
    this.setState({
      userName: '',
      userNameError: '',
      userPhone: '',
      userPhoneError: '',
      userEmail: '',
      userEmailError: '',
      userPincode: '',
      userPincodeError: '',
      expectedPrice: null,
      expectedPriceError: '',
      bulkQuantity: null,
      bulkQuantityError: '',
      clinicName: null,
      address: null,
      addressError: null,
      product_id: '',
      keyboardShown: false,
      value: '',
      productError: null,
    });
  };

  setOpen = open => {
    Keyboard.dismiss();
    this.setState({
      open,
    });
  };

  setValue = async callback => {
    await this.setState(state => ({
      productError: null,
      value: callback(state.value),
    }));
  };

  showDropDown = () => {
    return (
      <Query
        client={newclient}
        query={GET_GROUP_PRODUCT_QUERY}
        variables={{id: this.props.product.id}}
        fetchPolicy="cache-and-network"
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({data, loading, error}) => {
          if (loading || error) {
            return null;
          }
          if (data.childProductV2) {
            const productProperties = data.childProductV2;
            if (productProperties.items) {
              let items = [];
              groupedProductData = productProperties.items;
              productProperties.items.map(item => {
                let data = {
                  value: item?.id,
                  label: item?.name,
                };
                items.push(data);
              });
              return (
                <>
                  <Text allowFontScaling={false} style={styles.labelText}>
                    Select product{' '}
                    <Text allowFontScaling={false} style={styles.AsteriskIcon}>
                      *
                    </Text>
                  </Text>
                  <DropDownPicker
                    style={[
                      {
                        height: 40,
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        width: wp('80%'),
                      },
                    ]}
                    dropDownContainerStyle={{
                      backgroundColor: '#FFF',
                      borderColor: '#CCCCCC',
                    }}
                    containerStyle={[
                      {
                        width: wp('80%'),
                        alignSelf: 'center',
                      },
                    ]}
                    textStyle={{
                      fontSize: wp('3.5%'),
                      color: '#787878',
                    }}
                    listItemContainerStyle={{
                      height: hp('5%'),
                    }}
                    placeholder={'Select a product'}
                    open={this.state.open}
                    value={this.state.value}
                    items={items}
                    setOpen={this.setOpen}
                    setValue={this.setValue}
                  />
                  <Text allowFontScaling={false} style={styles.errortext}>
                    {this.state.productError}
                  </Text>
                </>
              );
            } else {
              return null;
            }
          }
          return null;
        }}
      </Query>
    );
  };

  render() {
    const {_this, closeBulkModal, openBulkModal} = this.props;
    const {
      userName,
      userEmail,
      userPhone,
      userPincode,
      bulkQuantity,
      expectedPrice,
      address,
      clinicName,
      product_id,
      open,
      value,
      items,
    } = this.state;
    const variables = {
      name: userName,
      email: userEmail,
      phone: userPhone,
      postcode: userPincode,
      product_id:
        this.props.product.type_id === 'grouped'
          ? this.state.value
          : this.props.product.id,
      quantity: parseInt(bulkQuantity),
      expected_price: parseFloat(expectedPrice),
      source: _this.state.bulkModalSoure,
    };
    const demoVariable = {
      customer_name: userName,
      email_id: userEmail,
      mobile_number: userPhone,
      pincode: userPincode,
      address: address,
      clinic_name: clinicName,
      product_id:
        this.props.product.type_id === 'grouped'
          ? this.state.value
          : this.props.product.id,
    };
    return (
      <View>
        <View style={styles.footerContainerWrapper}>
          <View style={styles.footerContainer}>
            <Text allowFontScaling={false} style={styles.footerHeading}>
              Want to buy even more quantity?
            </Text>
            <TouchableOpacity
              style={styles.quoteButton}
              onPress={() => openBulkModal(0)}>
              <Text allowFontScaling={false} style={styles.quoteText}>
                GET BULK QUOTE NOW
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => this.props.closeBulkModal()}
          visible={_this.state.bulkModalVisible}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
            }}>
            <View
              style={{
                alignSelf: 'center',
                // height: this.props.product.type_id === 'grouped' ? "92%" : "85%",
                height: '85%',
                width: '88%',
                paddingHorizontal: '4%',
                paddingVertical: '2%',
                backgroundColor: '#fff',
                borderRadius: hp('1%'),
              }}>
              <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                <View
                  style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: 1,
                    paddingBottom: hp('0.5%'),
                    marginBottom: hp('2%'),
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.labelText,
                      {fontWeight: 'bold', fontSize: wp('5%'), color: '#000'},
                    ]}>
                    {_this.state.bulkModalSoure === 0
                      ? 'ONLY FOR OVERALL PURCHASE VALUES ABOVE RS.10,000'
                      : 'Enter Price Quote'}
                  </Text>
                </View>
                <Text allowFontScaling={false} style={styles.labelText}>
                  Name{' '}
                  <Text allowFontScaling={false} style={styles.AsteriskIcon}>
                    *
                  </Text>
                </Text>
                <View style={styles.textfieldWrapper}>
                  <View style={styles.textfieldIconContainer}>
                    <FontIcon name="user" size={20} color={'#cdcdcd'} />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.textfield}
                      autoCapitalize="none"
                      placeholder="Enter your Name"
                      placeholderTextColor={styles.placeholderColor.borderColor}
                      value={this.state.userName}
                      onChangeText={value =>
                        this.handleBulkOrderDataChange('userName', value)
                      }
                    />
                  </View>
                </View>
                <Text allowFontScaling={false} style={styles.errortext}>
                  {this.state.userNameError}
                </Text>
                <Text allowFontScaling={false} style={styles.labelText}>
                  Phone Number{' '}
                  <Text allowFontScaling={false} style={styles.AsteriskIcon}>
                    *
                  </Text>
                </Text>
                <View style={styles.textfieldWrapper}>
                  <View style={styles.textfieldIconContainer}>
                    <FontIcon name="mobile" size={20} color={'#cdcdcd'} />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.textfield}
                      placeholder="Enter your Phone Number"
                      placeholderTextColor={styles.placeholderColor.borderColor}
                      keyboardType={'numeric'}
                      onChangeText={value =>
                        this.handleBulkOrderDataChange('userPhone', value)
                      }
                      value={this.state.userPhone}
                    />
                  </View>
                </View>
                <Text allowFontScaling={false} style={styles.errortext}>
                  {this.state.userPhoneError}
                </Text>
                <Text allowFontScaling={false} style={styles.labelText}>
                  Email{' '}
                  <Text allowFontScaling={false} style={styles.AsteriskIcon}>
                    *
                  </Text>
                </Text>
                <View style={styles.textfieldWrapper}>
                  <View style={styles.textfieldIconContainer}>
                    <AntDesignIcon name="mail" size={20} color={'#cdcdcd'} />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.textfield}
                      placeholder="Enter your Email"
                      placeholderTextColor={styles.placeholderColor.borderColor}
                      autoCapitalize="none"
                      value={this.state.userEmail}
                      onChangeText={value =>
                        this.handleBulkOrderDataChange('userEmail', value)
                      }
                    />
                  </View>
                </View>
                <Text allowFontScaling={false} style={styles.errortext}>
                  {this.state.userEmailError}
                </Text>
                <Text allowFontScaling={false} style={styles.labelText}>
                  Pincode{' '}
                  <Text allowFontScaling={false} style={styles.AsteriskIcon}>
                    *
                  </Text>
                </Text>
                <View style={styles.textfieldWrapper}>
                  <View style={styles.textfieldIconContainer}>
                    <FontIcon name="building-o" size={20} color={'#cdcdcd'} />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.textfield}
                      placeholder="Enter your Pincode"
                      placeholderTextColor={styles.placeholderColor.borderColor}
                      keyboardType={'numeric'}
                      value={this.state.userPincode}
                      onChangeText={value =>
                        this.handleBulkOrderDataChange('userPincode', value)
                      }
                    />
                  </View>
                </View>
                <Text allowFontScaling={false} style={styles.errortext}>
                  {this.state.userPincodeError}
                </Text>

                {_this.state.bulkModalSoure === 2 ? (
                  <>
                    {/* <Text allowFontScaling={false} style={styles.labelText}>
                      Enter Clinic Name (optional)
                    </Text>
                    <View style={styles.textfieldWrapper}>
                      <View style={styles.textfieldIconContainer}>
                        <FontIcon
                          name="building-o"
                          size={20}
                          color={'#cdcdcd'}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <TextInput
                          style={styles.textfield}
                          placeholder="Clinic name"
                          placeholderTextColor={
                            styles.placeholderColor.borderColor
                          }
                          value={this.state.clinicName}
                          onChangeText={value =>
                            this.handleBulkOrderDataChange('clinicName', value)
                          }
                        />
                      </View>
                    </View> 
                    <Text allowFontScaling={false} style={styles.errortext}>
                      {this.state.clinicNameError}
                    </Text>*/}
                    <Text allowFontScaling={false} style={styles.labelText}>
                      Enter Address{' '}
                      <Text
                        allowFontScaling={false}
                        style={styles.AsteriskIcon}>
                        *
                      </Text>
                    </Text>
                    <View style={styles.textfieldWrapper}>
                      <View style={styles.textfieldIconContainer}>
                        <FontIcon name="building" size={20} color={'#cdcdcd'} />
                      </View>
                      <View style={{flex: 1}}>
                        <TextInput
                          style={styles.textfield}
                          placeholder="Enter your address"
                          placeholderTextColor={
                            styles.placeholderColor.borderColor
                          }
                          value={this.state.address}
                          onChangeText={value =>
                            this.handleBulkOrderDataChange('address', value)
                          }
                        />
                      </View>
                    </View>
                    <Text allowFontScaling={false} style={styles.errortext}>
                      {this.state.addressError}
                    </Text>
                  </>
                ) : (
                  <>
                    {this.props.product.type_id === 'grouped' &&
                      this.showDropDown()}
                    <Text allowFontScaling={false} style={styles.labelText}>
                      Enter Address{' '}
                      <Text
                        allowFontScaling={false}
                        style={styles.AsteriskIcon}>
                        *
                      </Text>
                    </Text>
                    <View style={styles.textfieldWrapper}>
                      <View style={styles.textfieldIconContainer}>
                        <FontIcon name="building" size={20} color={'#cdcdcd'} />
                      </View>
                      <View style={{flex: 1}}>
                        <TextInput
                          style={styles.textfield}
                          placeholder="Enter your address"
                          placeholderTextColor={
                            styles.placeholderColor.borderColor
                          }
                          value={this.state.address}
                          onChangeText={value =>
                            this.handleBulkOrderDataChange('address', value)
                          }
                        />
                      </View>
                    </View>
                    <Text allowFontScaling={false} style={styles.errortext}>
                      {this.state.addressError}
                    </Text>
                    <Text allowFontScaling={false} style={styles.labelText}>
                      {_this.state.bulkModalSoure
                        ? 'Price'
                        : 'Expected price per piece'}{' '}
                      <Text
                        allowFontScaling={false}
                        style={styles.AsteriskIcon}>
                        *
                      </Text>
                    </Text>
                    <View style={styles.textfieldWrapper}>
                      <View style={styles.textfieldIconContainer}>
                        <FontIcon name="copy" size={20} color={'#cdcdcd'} />
                      </View>
                      <View style={{flex: 1}}>
                        <TextInput
                          style={styles.textfield}
                          placeholder={
                            _this.state.bulkModalSoure
                              ? 'Price'
                              : 'Expected price per piece'
                          }
                          placeholderTextColor={
                            styles.placeholderColor.borderColor
                          }
                          keyboardType={'numeric'}
                          value={this.state.expectedPrice}
                          onChangeText={value =>
                            this.handleBulkOrderDataChange(
                              'expectedPrice',
                              value,
                            )
                          }
                        />
                      </View>
                    </View>
                    <Text allowFontScaling={false} style={styles.errortext}>
                      {this.state.expectedPriceError}
                    </Text>
                    <Text allowFontScaling={false} style={styles.labelText}>
                      Quantity{' '}
                      <Text
                        allowFontScaling={false}
                        style={styles.AsteriskIcon}>
                        *
                      </Text>
                    </Text>
                    <View style={styles.textfieldWrapper}>
                      <View style={styles.textfieldIconContainer}>
                        <FontIcon name="copy" size={20} color={'#cdcdcd'} />
                      </View>
                      <View style={{flex: 1}}>
                        <TextInput
                          style={styles.textfield}
                          placeholder="Enter Quantity"
                          placeholderTextColor={
                            styles.placeholderColor.borderColor
                          }
                          keyboardType={'numeric'}
                          value={this.state.bulkQuantity}
                          onChangeText={value =>
                            this.handleBulkOrderDataChange(
                              'bulkQuantity',
                              value,
                            )
                          }
                        />
                      </View>
                    </View>
                    <Text allowFontScaling={false} style={styles.errortext}>
                      {this.state.bulkQuantityError}
                    </Text>
                  </>
                )}
                <KeyboardAvoidingView
                  behaviour={Platform.OS === 'ios' ? 'padding' : ''}
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    marginBottom:
                      Platform.OS === 'ios' && this.state.keyboardShown
                        ? 250
                        : 0,
                  }}>
                  <>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          borderWidth: 1,
                          borderRadius: hp('1%'),
                          backgroundColor: '#fff',
                        },
                      ]}
                      onPress={() => this.onCancel()}>
                      <Text
                        allowFontScaling={false}
                        style={[styles.text, {color: '#000'}]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <Mutation
                      client={newclient}
                      mutation={
                        _this.state.bulkModalSoure === 2
                          ? DEMO_REQUEST
                          : BULK_ORDER_MUTATION
                      }
                      variables={
                        _this.state.bulkModalSoure === 2
                          ? demoVariable
                          : variables
                      }
                      update={this.postBulkOrderSubmit}
                      onError={error => this.handleError(error)}>
                      {(bulkOrderMutation, {data, loading, error}) => {
                        if (!loading && error) {
                          error = error
                            .toString()
                            .replace('Error: GraphQL error: ', '');
                          // Alert.alert(error);
                        }
                        return (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                              !loading
                                ? this.onBulkOrderSubmit(
                                    bulkOrderMutation,
                                    _this.state.bulkModalSoure,
                                  )
                                : null
                            }>
                            <Text allowFontScaling={false} style={styles.text}>
                              {loading ? 'Submiting...' : 'Submit'}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    </Mutation>
                  </>
                </KeyboardAvoidingView>
              </KeyboardAwareScrollView>
              {/* </ScrollView> */}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}
