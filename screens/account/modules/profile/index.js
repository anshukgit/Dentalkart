import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  FlatList,
  Pressable,
  Keyboard,
} from 'react-native';
import {Mutation} from 'react-apollo';
import {SecondaryColor, PrimaryColor} from '@config/environment';
import {
  UPDATE_INFO_QUERY,
  SEND_CONFIRMATION_OTP_QUERY,
  VERIFY_CONFIRMATION_OTP_QUERY,
} from './graphql';
import {CUSTOMER_INFO_QUERY} from '@screens/account';
import {GET_ADDRESS_VALIDATION_RULES_QUERY} from '@screens/address/graphql';
import {Icon} from 'native-base';
import {TextField} from 'react-native-material-textfield';
import RadioButton from '@components/radioButton';
import {DentalkartContext} from '@dentalkartContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {validateName, validateEmail} from '@helpers/validator';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {client, customerClient} from '@apolloClient';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import {
  usernameErrMsg,
  passwordErrMsg,
  otpSentMsg,
  emailExistenceErrMsg,
  unconfirmedEmailMsg,
  incorrectCredentialMsg,
  emailExistMsg,
  firstNameErrMsg,
  lastNameErrMsg,
  mobileNumberErrMsg,
} from '@config/messages';
import TextInputComponent from '@components/TextInputComponent';
import CountDown from 'react-native-countdown-component';
import HeaderComponent from '@components/HeaderComponent';
import Modal from 'react-native-modal';
import OtpInputs from 'react-native-otp-inputs';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';
import {SEND_OTP, VERIFY_OTP} from '../authentication/graphql';
import CryptoJS from 'crypto-js';
export default class Profile extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      firstNameError: '',
      lastName: '',
      lastNameError: '',
      email: '',
      emailError: '',
      phoeNumber: '',
      altPhoeNumber: '',
      password: '',
      fulfilled: false,
      isEditModal: false,
      gst: '',
      isVerifiedData: false,
      isLoading: false,
      isEmailVerified: false,
      isPhoneVerified: false,
      shouldShow: false,
      showOtp: false,
      confirmOtpVal: '',
      showOtpView: false,
      editEmail: null,
      editEmailError: '',
      confirmOTPError: '',
      isEditMail: false,
      gstError: null,
      addressValidation: null,
    };
  }

  getAddressValidation = async () => {
    try {
      const {data} = await client.query({
        query: GET_ADDRESS_VALIDATION_RULES_QUERY,
        variables: {countryId: this.context?.country?.country_id || 'IN'},
        fetchPolicy: 'cache-first',
      });
      console.log('data====', data?.getValidationRules);
      this.setState({addressValidation: data?.getValidationRules});
    } catch (error) {
      console.log('catch error in getAddressValidation', error);
    }
  };

  componentDidMount() {
    const {userInfo} = this.context;
    const user = userInfo ? userInfo.getCustomer : {};
    // const active = user.gender.options.filter(item => item.value === user.gender.active);
    console.warn('updated user info : ', user);
    console.log('updated user info : ', user);
    this.setState({
      firstName: user?.firstname,
      lastName: user?.lastname,
      email: user?.email,
      mobilenumber: user?.mobile,
      // gender: user.gender.options,
      // activeGender: active[0],
      phoneNumber: user?.mobile,
      gst: user?.taxvat,
      fulfilled: true,
      showOTPTimer: false,
      isEmailVerified: user?.confirmation?.email_confirm,
      isPhoneVerified: user?.confirmation?.mobile_confirm,
    });
    this.triggerScreenEvent();
    this.getAddressValidation();
  }
  editDetails = name => text => {
    if (!text) {
      this.setState({[`${name}Error`]: 'Field can not be empty.'});
    } else if (!validateName(text)) {
      this.setState({[`${name}Error`]: 'Do not use any special characters.'});
    } else {
      this.setState({[`${name}Error`]: ''});
    }
    this.setState({[name]: text});
  };
  editDetails1 = name => text => {
    if (!text) {
      this.setState({[`${name}Error`]: 'Field can not be empty.'});
    } else {
      this.setState({[`${name}Error`]: ''});
    }
    this.setState({[name]: text});
  };
  async updateInfo(updateInfo) {
    const gstErrorVariable = await this.validateGst(this.state?.gst);
    const {
      firstName,
      lastName,
      firstNameError,
      lastNameError,
      phoneNumber,
      email,
      gst,
      gstError,
    } = this.state;
    if (firstNameError || lastNameError || gstError) {
      showErrorMessage(firstNameError || lastNameError || gstError);
      return false;
    }
    let {setUserInfo, userInfo, handleError} = this.context;
    const variables = {
      firstname: firstName,
      lastname: lastName,
      // email: email,
      // mobilenumber: phoneNumber,
      // gender: activeGender.value,
      taxvat: gst,
    };

    console.log('--------------------------', userInfo);
    console.warn('variables : ', variables);
    AnalyticsEvents('USER_UPDATED', 'user_update', variables);
    updateInfo({variables: variables});
    userInfo.getCustomer.email = email;
    userInfo.getCustomer.mobilenumber = phoneNumber;
    userInfo.getCustomer.firstname = firstName;
    userInfo.getCustomer.lastname = lastName;
    userInfo.getCustomer.taxvat = gst;
    setUserInfo(userInfo);
  }
  // setGender = item => {
  //     const {gender} = this.state;
  //     this.setState({activeGender: gender[item.value]});
  // }
  postUpdateInfo = (cache, {data}) => {
    // let {setUserInfo, userInfo, handleError} = this.context;
    let {userInfo} = this.context;
    console.warn('update post info : ', data.updateCustomerV2);
    // const {id, email, firstname, lastname, mobile, taxvat} =
    //   data.updateCustomerV2;
    userInfo.getCustomer = {
      ...data.updateCustomerV2,
      addresses: userInfo.getCustomer.addresses,
    };
    userInfo.getCustomer.mobile = this.state.phoneNumber;
    // setUserInfo(userInfo);
    showSuccessMessage('Information updated successfully');
    // try {
    //   cache.writeQuery({
    //     query: CUSTOMER_INFO_QUERY,
    //     data: {
    //       getCustomer: {
    //         id: id,
    //         firstname: firstname,
    //         lastname: lastname,
    //         taxvat: taxvat,
    //         email: email,
    //         mobilenumber: this.state.phoneNumber,
    //         dob: null,
    //         __typename: 'CustomerType',
    //       },
    //     },
    //   });
    // } catch (error) {
    //   console.log('TPOOOOOOOOO', error);
    //   const msg = handleError(error);
    //   showErrorMessage(`${msg}. Please try again.`);
    // }
  };
  // renderGender(){
  //     return(
  //         <View style={styles.genderWrapper}>
  //             <Text allowFontScaling={false} style={styles.genderText}>Gender</Text>
  //             <FlatList
  //                 data={this.state.gender}
  //                 renderItem={({item, index}) => {
  //                     if(item.value)
  //                         return(
  //                             <View style={styles.genderWrapper}>
  //                                 <TouchableOpacity onPress={()=> this.setGender(item)}>
  //                                     <RadioButton selected={this.state.activeGender.label === item.label} />
  //                                 </TouchableOpacity>
  //                                 <Text allowFontScaling={false} style={styles.genderTitle}>{item.label}</Text>
  //                             </View>
  //                         )
  //                     else null;
  //                 }}
  //                 extraData={this.state}
  //                 keyExtractor={(item) => item.value}
  //                 horizontal
  //             />
  //         </View>
  //     )
  // }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Edit Profile',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };

  validateGst = input => {
    return new Promise(resolve => {
      // const reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      let str = this.state?.addressValidation?.tax_format;
      let isRequired = this.state?.addressValidation?.tax_required;

      if (isRequired == true && !input) {
        this.setState({gstError: 'GST no. is required.'}, () => {
          return resolve(false);
        });
      } else {
        let index = str.lastIndexOf('/');
        let s = str.substring(0, index) + '' + str.substring(index + 1);
        let regx = new RegExp(s.replace('/', ''));
        this.setState({gst: input});
        if (str && input && !regx.test(input)) {
          this.setState({gstError: 'Please enter a valid GST no.'});
          resolve(false);
        } else {
          this.setState({gstError: null});
          resolve(true);
        }
      }
    });
  };

  otpScreeen = () => {
    this.setState({showOtp: true});
  };
  completeOTPTimer = async () => {
    this.setState({shouldShow: false});
  };
  otpVerify = async () => {
    const {editEmail, confirmOtpVal} = this.state;
    const {setUserInfo, userInfo, handleError} = this.context;
    console.warn('Userinfo val =========== > ', userInfo);
    //setUserInfo(userInfo);
    //{"customer": {"__typename": "Customer", "addresses": [], "confirmation": {"__typename": "Confirmation", "email_confirm": true, "mobile_confirm": false}, "dob": null, "email": "kinjalgajera22@gmail.com", "firstname": "Kids", "id": null, "lastname": "Viyu", "mobilenumber": "", "taxvat": null}}

    console.warn('cofirmopt val length : ', confirmOtpVal.length);
    if (confirmOtpVal.length < 6) {
      this.setState({confirmOTPError: 'Please enter six digit opt'});
    } else {
      this.setState({isLoading: true});
      try {
        const {data} = await customerClient.mutate({
          // mutation: VERIFY_CONFIRMATION_OTP_QUERY,
          // variables: {
          //   entity_type: this.state.isEditMail ? 'email' : 'mobile',
          //   type_value: editEmail,
          //   random_code: confirmOtpVal,
          // },
          mutation: VERIFY_OTP,
          variables: {
            email_or_Mobile: editEmail,
            otp_or_password: confirmOtpVal,
            entityType: this.state.isEditMail ? 'email' : 'mobile',
            actionType: this.state.isEditMail
              ? 'update_email_otp'
              : 'update_mobile_otp',
          },
        });
        // console.warn(
        //   'VERIFY_CONFIRMATION_OTP_QUERY data response================= : ',
        //   editEmail,
        //   data,
        //   data.verifyConfirmationOtp.message,
        // );
        this.setState({isLoading: false});
        //if()
        // console.warn('error message : ', data.verifyConfirmationOtp.message);
        // this.setState({confirmOTPError: data.verifyConfirmationOtp.message});
        if (data.verifyOTP.message) {
          this.setState({isEditModal: false, confirmOTPError: ''});
          this.state.isEditMail
            ? this.setState({email: editEmail})
            : this.setState({phoneNumber: editEmail});
          showSuccessMessage(
            this.state.isEditMail
              ? 'Email updated successfully'
              : 'Mobile No updated successfully',
            'top',
          );
          if (this.state.isEditMail) {
            userInfo.getCustomer.email = editEmail;
            // userInfo.getCustomer.confirmation.email_confirm = true;
            this.setState({
              isEmailVerified: true,
            });
          } else {
            userInfo.getCustomer.mobile = editEmail;
            // userInfo.getCustomer.confirmation.mobile_confirm = true;
            this.setState({
              isPhoneVerified: true,
            });
          }

          setUserInfo(userInfo);
        }
        //m {"data": {"verifyConfirmationOtp": {"__typename": "ConfirmationOtpOutput", "message": "Entered OTP is not correct.", "status": false}}}
        // if (data.sendConfirmationOtp.status) {
        //   this.setState({ showOtpView: true, shouldShow: true });
        // }
      } catch (err) {
        console.log('errofVERIFYOTPPPPPP________', err);
        // console.warn('verify error : ', err);
        // this.setState({confirmOTPError: err});
        // const msg = handleError(err);
        showErrorMessage(
          String(err).replace('[Error: GraphQL error: ').replace(']'),
          'top',
        );
        // showErrorMessage(msg, 'top');
        this.setState({isLoading: false});
      }
    }
  };

  encryption = () => {
    const {editEmail} = this.state;

    const getTwoHalf = input => {
      const midpoint = Math.floor(input.length / 2);
      const firstHalf = input.substr(0, midpoint);
      const secondHalf = input.substr(midpoint);
      return {firstHalf, secondHalf};
    };

    const secret_key = '2b7e151628aed2a6abf7168809cf2f3c';
    let inputType = String(editEmail);
    const {firstHalf, secondHalf} = getTwoHalf(inputType);
    const stringToBeEncrypted = firstHalf + secret_key + secondHalf;
    const key = CryptoJS.enc.Hex.parse(secret_key); // 128-bit key
    const encrypted = CryptoJS.AES.encrypt(stringToBeEncrypted, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encrypted;
  };

  emailVerify = async () => {
    const encrypted = this.encryption();
    const {editEmail, editEmailError, isEditMail} = this.state;
    const {handleError} = this.context;
    if (this.state.editEmail == '') {
      this.setState({isVerifiedData: true});
      this.setState({
        editEmailError: isEditMail ? 'Enter Email.' : 'Enter Mobile No',
      });
    } else if (isEditMail && !validateEmail(this.state.editEmail)) {
      this.setState({isVerifiedData: true});
      this.setState({editEmailError: 'Enter Valid Email Address'});
    } else if (
      !isEditMail &&
      (this.state.editEmail.length < 10 || this.state.editEmail.length > 10)
    ) {
      this.setState({isVerifiedData: true});
      this.setState({
        editEmailError: 'Enter Valid Mobile No with 10 digit only',
      });
    } else {
      // if (isEditMail && validateEmail(editEmail)) {
      this.setState({isVerifiedData: true});
      this.setState({isLoading: true});
      try {
        const {data} = await customerClient.mutate({
          //   mutation: SEND_CONFIRMATION_OTP_QUERY,
          //   variables: {
          //     type_value: editEmail,
          //     entity_type: isEditMail ? 'email' : 'mobile',
          //   },
          mutation: SEND_OTP,
          variables: {
            email_or_Mobile: editEmail,
            entityType: isEditMail ? 'email' : 'mobile',
            actionType: isEditMail ? 'email_update' : 'mobile_update',
          },
          context: {
            headers: {
              ETag: encrypted,
            },
          },
        });
        console.warn(
          'SEND_CONFIRMATION_OTP data response : ',
          editEmail,
          data.sendConfirmationOtp,
        );
        this.setState({isLoading: false});
        if (data.sendOTP.message) {
          this.setState({
            showOtpView: true,
            shouldShow: true,
            editEmailError: '',
          });
        }
        // else {
        //   this.setState({isVerifiedData: true});
        //   this.setState({editEmailError: data.sendConfirmationOtp.message});
        // }
      } catch (err) {
        console.log('errFOrSENDOTPP', err);
        console.warn('verify error : ', err);
        this.setState({isVerifiedData: true});
        this.setState({
          editEmailError: String(err).replace('Error: GraphQL error:', ''),
        });
        // const msg = handleError(err);
        showErrorMessage(
          String(err).replace('[Error: GraphQL error: ').replace(']'),
          'top',
        );
        // showErrorMessage(msg, 'top');
        this.setState({isLoading: false});
      }
    }
  };

  closeModal() {
    this.setState({
      isEditModal: false,
      showOtpView: false,
      editEmailError: false,
      editEmail: null,
    });
  }

  render() {
    const {userInfo} = this.context;
    const {
      firstName,
      lastName,
      email,
      gst,
      firstNameError,
      lastNameError,
      fulfilled,
      phoneNumber,
    } = this.state;
    console.log('state');
    console.log(this.state.firstName);
    return (
      <ScrollView>
        <Spinner
          visible={this.state.isLoading}
          // textContent={''}
          // textStyle={{ color: colors.White }}
          indicatorStyle={{activeOpacity: 1}}
        />
        <View style={{height: 10, wdth: '100%'}}></View>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Profile details'}
          onPress={() => this.props.navigation.goBack()}
        />
        {/* <View style={styles.userInfoContainer}>
          <View style={[styles.shadow, { width: 80, height: 80, borderRadius: 80, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
            <Image
              source={require('../../../../assets/user.png')}
              style={styles.userImage} resizeMode={'contain'}
            />
           
          </View>
        </View> */}
        <View style={{height: 10, wdth: '100%'}}></View>
        <Mutation
          mutation={UPDATE_INFO_QUERY}
          client={customerClient}
          update={this.postUpdateInfo}
          onError={error => {
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {(updateInfo, {data, loading, error}) => {
            return (
              <Fragment>
                {fulfilled && (
                  <Fragment key={'profile fiels'}>
                    <View style={[styles.formWrapper, {marginTop: 10}]}>
                      <View style={styles.textinputMainView}>
                        <View style={styles.textinputSubView}>
                          <Text
                            allowFontScaling={false}
                            style={styles.labelText}>
                            First Name
                          </Text>
                          <TextInputComponent
                            placeholder="" //Frist Name
                            placeholderTextColor={SecondaryColor}
                            value={firstName}
                            onChangeText={this.editDetails('firstName')}
                            autoCapitalize="none"
                            autoFocus={true}
                            style={[styles.TextInput, {borderRadius: 3}]}
                          />
                        </View>
                        <View style={styles.textinputSubView}>
                          <Text
                            allowFontScaling={false}
                            style={styles.labelText}>
                            Last Name
                          </Text>
                          <TextInputComponent
                            placeholder="" //Last Name
                            placeholderTextColor={SecondaryColor}
                            value={lastName}
                            onChangeText={this.editDetails('lastName')}
                            autoCapitalize="none"
                            style={[styles.TextInput, {borderRadius: 3}]}
                          />
                        </View>
                      </View>
                    </View>
                    {/*{this.renderGender()}*/}
                    <View style={styles.formWrapper}>
                      <Text allowFontScaling={false} style={styles.labelText}>
                        Email
                      </Text>
                      <View style={[styles.emailTextInputView]}>
                        {/* <Icon name='email' type='Fontisto' style={styles.emailIcon} /> */}
                        <TextInputComponent
                          placeholder="" //Youremail@mail.com
                          placeholderTextColor={SecondaryColor}
                          value={email}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          editable={false}
                        />
                        <Pressable
                          style={{
                            right: 15,
                            height: '100%',
                            justifyContent: 'center',
                          }}
                          onPress={() =>
                            this.setState({
                              editEmail: email,
                              isEditModal: true,
                              showOtpView: false,
                              isEditMail: true,
                            })
                          }>
                          <Icon
                            name="edit"
                            type="AntDesign"
                            style={styles.emailIcon}
                          />
                        </Pressable>
                      </View>
                      {!this.state.isEmailVerified && (
                        <Text
                          allowFontScaling={false}
                          style={{
                            paddingBottom: 10,
                            fontWeight: '500',
                            fontStyle: 'italic',
                          }}>
                          *Verify your email to get order related update.
                        </Text>
                      )}
                      <View>
                        <Text allowFontScaling={false} style={styles.labelText}>
                          Phone Number
                        </Text>
                        <View style={[styles.emailTextInputView]}>
                          <TextInputComponent
                            placeholder="" //Phone Number
                            placeholderTextColor={SecondaryColor}
                            onChangeText={text =>
                              this.setState({phoneNumber: text})
                            }
                            value={this.state.phoneNumber}
                            keyboardType={'numeric'}
                            maxLength={10}
                            editable={false}
                          />
                          <Pressable
                            style={{right: 15}}
                            onPress={() =>
                              this.setState({
                                editEmail: this.state.phoneNumber,
                                isEditModal: true,
                                showOtpView: false,
                                isEditMail: false,
                              })
                            }>
                            <Icon
                              name="edit"
                              type="AntDesign"
                              style={styles.emailIcon}
                            />
                          </Pressable>
                        </View>
                        {!this.state.isPhoneVerified && (
                          <Text
                            allowFontScaling={false}
                            style={{
                              paddingBottom: 10,
                              fontWeight: '500',
                              fontStyle: 'italic',
                            }}>
                            *Verify your mobile no. to get order related update.
                          </Text>
                        )}
                        {/* <Text allowFontScaling={false} style={styles.labelText}>Alternative Phone Number</Text>
                        <View style={[styles.emailTextInputView, { borderColor: colors.borderColor, }]}>
                       
                          <TextInputComponent placeholder='Alternative Phone Number'
                            placeholderTextColor={SecondaryColor}
                            onChangeText={text => this.setState({ altPhoeNumber: text })}
                            value={this.state.altPhoeNumber}
                            keyboardType={'numeric'}
                            maxLength={10}
                          />
                        </View> */}
                        {/* <Text allowFontScaling={false} style={styles.labelText}>Password</Text>
                        <View style={[styles.emailTextInputView]}>

                          <TextInputComponent placeholder='Password'
                            placeholderTextColor={SecondaryColor}
                            onChangeText={text => this.setState({ password: text })}
                            value={this.state.password}
                            keyboardType={'numeric'}
                            secureTextEntry={true}
                          />
                        </View> */}
                        <Text allowFontScaling={false} style={styles.labelText}>
                          GST Number
                        </Text>
                        {console.log(
                          'this.state.gstErro=============',
                          this.state.gstError,
                        )}
                        <View
                          style={[
                            styles.emailTextInputView,
                            this.state.gstError
                              ? {borderColor: '#ff0000db'}
                              : {},
                          ]}>
                          <TextInputComponent
                            placeholder="" //GST Number
                            placeholderTextColor={SecondaryColor}
                            onChangeText={text => this.validateGst(text)}
                            value={gst}
                            keyboardType="default"
                          />
                        </View>
                        {/*<TouchableOpacity style={styles.updateButton}>
                                                      <Text allowFontScaling={false}>Update</Text>
                                                  </TouchableOpacity>*/}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => this.updateInfo(updateInfo)}>
                      <Text allowFontScaling={false} style={styles.saveText}>
                        {loading ? 'Saving...' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </Fragment>
                )}
              </Fragment>
            );
          }}
        </Mutation>
        {/* <View style={styles.buttonContainer}>
                    <TouchableHighlight underlayColor="#efefef" >
                        <View style={styles.buttonWrapper}>
                            <Text allowFontScaling={false} style={styles.buttonText}>Change Password</Text>
                        </View>
                    </TouchableHighlight>
                </View> */}

        <Modal
          isVisible={this.state.isEditModal}
          animationInTiming={1000}
          animationOutTiming={1000}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onSwipeComplete={() => this.setState({is: false})}
          style={{margin: 0, justifyContent: 'center', alignItems: 'center'}}>
          <Pressable style={styles.emptyView}></Pressable>

          <View
            style={[
              styles.moadlMainView,
              {height: this.state.showOtpView ? 410 : 205},
            ]}>
            <View style={styles.modalHeaderView}>
              <View style={styles.locationTxtView}>
                <Text allowFontScaling={false} style={styles.locationTxt}>
                  {this.state.isEditMail
                    ? 'Email Verification'
                    : 'Mobile Verification'}
                </Text>
              </View>
              <Pressable
                style={styles.closeIconView}
                onPress={() => this.closeModal()}>
                <Icon
                  name={'closecircleo'}
                  type={'AntDesign'}
                  style={styles.closeIcon}
                />
              </Pressable>
            </View>

            <View style={styles.modalemailTextInputView}>
              <View
                style={[
                  styles.emailTextInputView,
                  {
                    width: '100%',
                    marginTop: 15,
                    borderColor:
                      this.state.isVerifiedData && this.state.editEmail == ''
                        ? 'red'
                        : colors.LightCyan,
                  },
                ]}>
                <TextInputComponent
                  placeholder={
                    this.state.isEditMail ? 'Youremail@mail.com' : '9876543210'
                  }
                  placeholderTextColor={SecondaryColor}
                  value={this.state.editEmail}
                  maxLength={this.state.isEditMail ? null : 10}
                  onChangeText={this.editDetails1('editEmail')}
                  keyboardType={
                    this.state.isEditMail ? 'email-address' : 'number-pad'
                  }
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.editemailError}>
                <Text
                  allowFontScaling={false}
                  style={[styles.editEmailTxtError]}>
                  {this.state.editEmailError}
                </Text>
              </View>

              {this.state.showOtpView == false ? (
                <TouchableOpacity
                  style={[styles.saveButton, {}]}
                  onPress={() => this.emailVerify()}>
                  <Text allowFontScaling={false} style={styles.saveText}>
                    Verify
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {this.state.showOtpView ? (
              <View style={{marginTop: -20}}>
                <View style={styles.titleWrapper}>
                  <Text allowFontScaling={false} style={styles.titleText}>
                    Please enter the verification code sent to
                  </Text>
                  <Text allowFontScaling={false} style={styles.titleText}>
                    {this.state.editEmail}
                  </Text>
                </View>
                <View style={styles.otpFormWrapper}>
                  <View style={{alignItems: 'center'}}>
                    <OtpInputs
                      handleChange={otp => this.setState({confirmOtpVal: otp})}
                      numberOfInputs={6}
                      inputContainerStyles={styles.inputContainerStyles}
                      inputStyles={styles.inputStyles}
                      focusStyles={{}}
                      keyboardType={'phone-pad'}
                      containerStyles={{margin: 0}}
                      inputsContainerStyles={{justifyContent: 'center'}}
                    />

                    <View style={{alignItems: 'center'}}>
                      {this.state.shouldShow ? (
                        <View style={styles.resendOtpTimer}>
                          <Text
                            allowFontScaling={false}
                            style={styles.resendOtpTextRem}>
                            Time Remaining :{' '}
                          </Text>
                          <CountDown
                            until={60 * 1 + 59}
                            size={15}
                            onFinish={this.completeOTPTimer}
                            digitStyle={{width: 20}}
                            digitTxtStyle={{
                              color: '#999999',
                              fontWeight: '500',
                              fontSize: 15,
                            }}
                            timeToShow={['M', 'S']}
                            timeLabels={{m: null, s: null}}
                            showSeparator={true}
                            separatorStyle={{
                              fontSize: 15,
                              color: '#999999',
                              width: 5,
                            }}
                          />
                        </View>
                      ) : (
                        <View style={styles.resendOtpWrapper}>
                          <TouchableOpacity
                            style={{alignItems: 'center'}}
                            onPress={() => this.emailVerify()}>
                            <Text
                              allowFontScaling={false}
                              style={styles.resendOtpText}>
                              Resend Otp
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    {this.state.confirmOtpVal.length < 6 ||
                    this.state.confirmOTPError != '' ? (
                      <View style={styles.confirmOTPErrorView}>
                        <Text
                          allowFontScaling={false}
                          style={[styles.editEmailTxtError]}>
                          {this.state.confirmOTPError}
                        </Text>
                      </View>
                    ) : null}
                    <TouchableOpacity
                      style={styles.otpBtn}
                      onPress={() => this.otpVerify()}>
                      <View style={[styles.loginBtn, {}]}>
                        <Text
                          allowFontScaling={false}
                          style={[styles.signInButtonText]}>
                          Confirm Otp
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 10,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 80,
  },
  formWrapper: {
    width: '95%',
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  genderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  genderText: {
    color: '#212121',
    fontSize: 15,
  },
  genderTitle: {
    color: '#000',
    fontSize: 15,
    marginLeft: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#444',
    borderRadius: 10,
  },
  saveButton: {
    marginHorizontal: 20,
    right: 3,
    width: '90%',
    height: 48,
    borderRadius: 3,
    alignItems: 'center',
    marginVertical: 18,
    backgroundColor: colors.blueColor,
    justifyContent: 'center',
  },
  saveText: {
    color: '#fff',
  },
  buttonContainer: {
    elevation: 3,
    marginVertical: 20,
  },
  updateButton: {
    position: 'absolute',
    right: 5,
    top: 15,
  },
  buttonWrapper: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00000050',
    padding: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
    marginLeft: 10,
  },
  emailTextInputView: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderRadius: 3,
    marginBottom: 15,
    top: 5,
    borderColor: colors.LightCyan,
  },
  emailIcon: {fontSize: 17, marginRight: 15, color: '#c4cddd'},
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  textinputMainView: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  textinputSubView: {
    width: '49%',
    height: '100%',
    justifyContent: 'space-around',
  },
  labelText: {fontSize: 15, color: colors.StormGrey},
  TextInput: {
    borderWidth: 1,
    height: 45,
    paddingHorizontal: 18,
    borderColor: colors.LightCyan,
  },
  modalHeaderView: {
    width: '100%',
    height: 50,
    borderBottomWidth: 5,
    justifyContent: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    borderBottomColor: colors.HexColor,
  },
  locationTxtView: {width: '80%', height: '100%', justifyContent: 'center'},
  locationTxt: {fontSize: 18, fontWeight: '700'},
  closeIconView: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  closeIcon: {fontSize: 18},
  otpFormWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  loginBtn: {
    width: '100%',
    height: 48,
    borderRadius: 3,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.blueColor,
    justifyContent: 'center',
    marginTop: -8,
  },
  resendOtpTimer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendOtpText: {
    color: '#999999',
  },
  resendOtpTextRem: {
    color: '#999999',
    fontSize: 15,
  },
  resendOtpWrapper: {
    marginTop: 50,
  },
  emptyView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
  },
  moadlMainView: {width: '95%', backgroundColor: '#fff', borderRadius: 6},
  modalemailTextInputView: {
    width: '100%',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  inputContainerStyles: {
    margin: 3,
    borderBottomWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyles: {
    width: 50,
    height: 50,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#0ea1e0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBtn: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  editemailError: {marginTop: -8, width: '100%'},
  editEmailTxtError: {fontSize: 12, color: 'red'},
  confirmOTPErrorView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  titleWrapper: {
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#b4b3b3',
    fontSize: 12,
  },
});
