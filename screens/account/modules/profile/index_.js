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
} from 'react-native';
import {Mutation} from 'react-apollo';
import {SecondaryColor, PrimaryColor} from '@config/environment';
import {UPDATE_INFO_QUERY} from './graphql';
import {CUSTOMER_INFO_QUERY} from '@screens/account';
import {Icon} from 'native-base';
import {TextField} from 'react-native-material-textfield';
import RadioButton from '@components/radioButton';
import {DentalkartContext} from '@dentalkartContext';
import Header from '@components/header';
import {validateName} from '@helpers/validator';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import TextInputComponent from '@components/TextInputComponent';
import HeaderComponent from '@components/HeaderComponent';
import {Colors} from 'react-native/Libraries/NewAppScreen';
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
      phoeNumber: '',
      altPhoeNumber: '',
      password: '',
      fulfilled: false,
      // gender: [],
      // activeGender: '',
      gst: '',
    };
  }
  componentDidMount() {
    const {userInfo} = this.context;
    const user = userInfo ? userInfo.getCustomer : {};
    // const active = user.gender.options.filter(item => item.value === user.gender.active);
    console.warn('updated user info : ', user);
    this.setState({
      firstName: user?.firstname,
      lastName: user?.lastname,
      email: user?.email,
      mobilenumber: user?.mobilenumber,
      // gender: user.gender.options,
      // activeGender: active[0],
      phoneNumber: user?.mobilenumber,
      gst: user?.taxvat,
      fulfilled: true,
    });
    this.triggerScreenEvent();
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
  updateInfo(updateInfo) {
    const {firstName, lastName, firstNameError, lastNameError, gst} =
      this.state;
    if (firstNameError || lastNameError) {
      showErrorMessage(firstNameError || lastNameError);
      return false;
    }
    const variables = {
      firstname: firstName,
      lastname: lastName,
      // gender: activeGender.value,
      taxvat: gst,
    };
    updateInfo({variables: variables});
  }
  // setGender = item => {
  //     const {gender} = this.state;
  //     this.setState({activeGender: gender[item.value]});
  // }
  postUpdateInfo = (cache, {data}) => {
    let {setUserInfo, userInfo, handleError} = this.context;
    const {id, email, firstname, lastname, mobilenumber, taxvat} =
      data.updateCustomerV2.customer;
    userInfo.getCustomer = data.updateCustomerV2.customer;
    setUserInfo(userInfo);
    showSuccessMessage('Information updated successfully');
    try {
      cache.writeQuery({
        query: CUSTOMER_INFO_QUERY,
        data: {
          customer: {
            id: id,
            firstname: firstname,
            lastname: lastname,
            taxvat: taxvat,
            email: email,
            __typename: 'Customer',
          },
        },
      });
    } catch (error) {
      const msg = handleError(error);
      showErrorMessage(`${msg}. Please try again.`);
    }
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
    } = this.state;
    console.log('state');
    console.log(this.state.firstName);
    return (
      <ScrollView>
        <View style={{height: 10, wdth: '100%'}} />
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
        <View style={{height: 10, wdth: '100%'}} />
        <Mutation
          mutation={UPDATE_INFO_QUERY}
          update={this.postUpdateInfo}
          onError={error => {
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {(updateInfo, {data, loading, error}) => {
            return (
              <Fragment>
                {fulfilled && (
                  <Fragment style={{}}>
                    <View style={[styles.formWrapper, {marginTop: 10}]}>
                      <View style={styles.textinputMainView}>
                        <View style={styles.textinputSubView}>
                          <Text
                            allowFontScaling={false}
                            style={styles.labelText}>
                            First Name
                          </Text>
                          <TextInputComponent
                            placeholder="Frist Name"
                            placeholderTextColor={SecondaryColor}
                            value={firstName}
                            onChangeText={this.editDetails('firstName')}
                            autoCapitalize="none"
                            style={{}}
                            onSubmitEditing={() => {
                              this.emailInput.focus();
                            }}
                            returnKeyType="next"
                            blurOnSubmit={false}
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
                            placeholder="Last Name"
                            placeholderTextColor={SecondaryColor}
                            value={lastName}
                            onChangeText={this.editDetails('lastName')}
                            autoCapitalize="none"
                            style={styles.TextInput}
                            onSubmitEditing={() => {
                              this.emailInput.focus();
                            }}
                            returnKeyType="next"
                            blurOnSubmit={false}
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
                          placeholder="Youremail@mail.com"
                          placeholderTextColor={SecondaryColor}
                          value={email}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          disabled={true}
                        />
                        <Pressable style={{right: 15}}>
                          <Icon
                            name="edit"
                            type="AntDesign"
                            style={styles.emailIcon}
                          />
                        </Pressable>
                      </View>

                      <View>
                        <Text allowFontScaling={false} style={styles.labelText}>
                          Phone Number
                        </Text>
                        <View style={[styles.emailTextInputView]}>
                          <TextInputComponent
                            placeholder="Phone Number"
                            placeholderTextColor={SecondaryColor}
                            onChangeText={text =>
                              this.setState({phoneNumber: text})
                            }
                            value={this.state.phoneNumber}
                            keyboardType={'numeric'}
                            maxLength={10}
                            disabled={true}
                          />
                          <Pressable style={{right: 15}}>
                            <Icon
                              name="edit"
                              type="AntDesign"
                              style={styles.emailIcon}
                            />
                          </Pressable>
                        </View>
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
                        <View style={[styles.emailTextInputView]}>
                          <TextInputComponent
                            placeholder="Phone Number"
                            placeholderTextColor={SecondaryColor}
                            onChangeText={text => this.setState({gst: text})}
                            value={gst}
                            keyboardType={'numeric'}
                            maxLength={15}
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
});
