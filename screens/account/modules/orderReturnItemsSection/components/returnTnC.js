import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import HeaderComponent from '@components/HeaderComponent';

const ReturnTnC = props => {
  const orderId = props?.navigation.getParam('orderId');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
      <HeaderComponent
        onPress={() => {
          props.navigation.goBack();
        }}
        label={'Return'}
        style={{height: 40}}
      />
      <View style={{backgroundColor: 'white', marginTop: hp('1%'), flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../../../assets/thumbsUpImage.png')}
            />

            <Text
              style={{
                marginTop: 10,
                color: '#464545',
                fontSize: 15,
                fontWeight: '700',
              }}>
              Request Submitted
            </Text>

            <View
              style={{
                marginTop: 5,
                width: '70%',
              }}>
              <Text style={{textAlign: 'center'}}>
                Your Request has been submitted, It will show in order section
                within 24hrs.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('OrdersList', {
                // orderId: orderId,
                myReturn: 'Returns',
              })
            }
            style={{
              backgroundColor: '#F3943D',
              width: '45%',
              alignSelf: 'center',
              marginTop: 20,
              alignItems: 'center',
              padding: 8,
              borderRadius: 2,
            }}>
            <Text style={{color: 'white'}}>My Returns</Text>
          </TouchableOpacity>

          <View style={{alignSelf: 'center', marginTop: 10}}>
            <Text>Or</Text>
          </View>

          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{alignSelf: 'center', marginTop: 10}}>
            <Text style={{color: 'darkblue'}}>Return More Products</Text>
          </TouchableOpacity>

          <View style={{padding: 10}}>
            <Text
              style={{
                marginTop: 10,
                color: '#464545',
                fontSize: 15,
                fontWeight: '700',
              }}>
              Returns Policy
            </Text>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginTop: 10,
              }}>
              <Text>•</Text>
              <View style={{paddingHorizontal: 4}}></View>
              <Text style={{flexWrap: 'wrap', width: '95%'}}>
                Returns is a scheme provided by us directly under this policy in
                terms of which the option of exchange, replacement and/ or
                refund is offered by the respective sellers to you. All products
                listed under a particular category may not have the same return
                policy.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginTop: 10,
              }}>
              <Text>•</Text>
              <View style={{paddingHorizontal: 4}}></View>
              <Text style={{flexWrap: 'wrap', width: '95%'}}>
                For all products, the policy on the product page shall prevail
                over the general return policy. Do refer the respective item's
                applicable return policy on the product page for any exceptions
                to the table below.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginTop: 10,
              }}>
              <Text>•</Text>
              <View style={{paddingHorizontal: 4}}></View>
              <Text style={{flexWrap: 'wrap', width: '95%'}}>
                The return policy is divided into two parts; Do read all
                sections carefully to understand the conditions and cases under
                which returns will be accepted.
              </Text>
            </View>

            <View
              style={{
                width: '92%',
                alignSelf: 'center',
                borderWidth: 0.7,
                borderColor: 'grey',
                marginVertical: 20,
              }}></View>

            <View style={{paddingHorizontal: 9}}>
              <Text style={{fontSize: 14, color: '#464545', fontWeight: '500'}}>
                Part 1 - Catagory, Return Window and Actions possilbe
              </Text>
              <View style={{paddingVertical: 6}}></View>
              <View style={{borderWidth: 0.7}}>
                <View style={{borderBottomWidth: 0.7, padding: 10}}>
                  <Text
                    style={{color: '#464545', fontSize: 15, fontWeight: '700'}}>
                    All Products
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>10 days</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    Replacement only
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    In order to help you resolve issues with your product, we
                    may troubleshoot your product either through online tools,
                    over the phone, and/or through a call from technical team.
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    If a defect is determined within the Returns Window, a
                    replacement of the same model will be provided at no
                    additional cost.
                  </Text>
                </View>

                <View
                  style={[
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginTop: 10,
                    },
                    {marginBottom: 10},
                  ]}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    Note- If the rectification comes frequently then
                    rectification cost will be applicable as per T&C.
                  </Text>
                </View>
              </View>
            </View>

            <View style={{paddingHorizontal: 9, paddingVertical: 10}}>
              <Text style={{fontSize: 14, color: '#464545', fontWeight: '500'}}>
                Product are not eligible for returns
              </Text>
              <View style={{paddingVertical: 6}}></View>
              <View style={{borderWidth: 0.7}}>
                <View style={{borderBottomWidth: 0.7, padding: 10}}>
                  <Text
                    style={{color: '#464545', fontSize: 15, fontWeight: '700'}}>
                    No Returns Catagories
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    Products not in warranty or exceeds the time for replacement
                    (10 days) are not returned and all we ask for is the product
                    returned back to us must have intact original Packaging,
                    seal, and the accessories.
                  </Text>
                </View>

                <View
                  style={[
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginTop: 10,
                    },
                    {marginBottom: 6},
                  ]}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    The following table contains a list of products that are not
                    eligible for returns as per the company Returns Policy.
                  </Text>
                </View>
              </View>
            </View>

            <View style={{paddingHorizontal: 9}}>
              <View style={{paddingVertical: 6}}></View>
              <View style={{borderWidth: 0.7}}>
                <View style={{borderBottomWidth: 0.7, padding: 10}}>
                  <Text
                    style={{color: '#464545', fontSize: 15, fontWeight: '700'}}>
                    Equipments
                  </Text>
                </View>

                <View
                  style={[
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginTop: 10,
                    },
                    {marginBottom: 6},
                  ]}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    Dental Chairs, Dental Compressors, UV chambers and
                    Autoclaves, X-ray Units, RVG sensor machine, Model Trimmers,
                    OPG and CBCT machines, Apex locators and Endomotors,
                    Ultrasonic Cleaners and Scalers, Micromotors, Implant
                    Motors/Physiodispenser, Bleaching Light and light cure
                    units, Amalgamator.
                  </Text>
                </View>
              </View>
            </View>

            <View style={{paddingHorizontal: 9}}>
              <View style={{paddingVertical: 6}}></View>
              <View style={{borderWidth: 0.7}}>
                <View style={{borderBottomWidth: 0.7, padding: 10}}>
                  <Text
                    style={{color: '#464545', fontSize: 15, fontWeight: '700'}}>
                    Products directly used on Patients
                  </Text>
                </View>

                <View
                  style={[
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginTop: 10,
                    },
                    {marginBottom: 6},
                  ]}>
                  <Text>•</Text>
                  <View style={{paddingHorizontal: 4}}></View>
                  <Text style={{flexWrap: 'wrap', width: '95%'}}>
                    Tooth creme or mousse, MRC/Orthodontic trainers, Water
                    Flossers, Chin Caps, headgear, face mask or other
                    myofunctional appliances.
                  </Text>
                </View>
              </View>
            </View>
            <View style={{paddingVertical: 6}}></View>

            <View style={{marginTop: 10, paddingHorizontal: 9}}>
              <Text style={{fontSize: 14, color: '#464545', fontWeight: '500'}}>
                Part 2 - Returns Pick-Up and Processing
              </Text>
              <View style={{marginTop: 10}}></View>
              <Text>
                In case of returns where you would like item(s) to be picked up
                from a different address, the address can only be changed if
                pick-up service is available at the new address.
              </Text>
              <View style={{marginTop: 10}}></View>
              <Text style={{fontSize: 14, color: '#464545', fontWeight: '500'}}>
                Your product will be checked for the following conditions after
                received to us:
              </Text>
              <View style={{marginTop: 10}}></View>

              <View
                style={{
                  width: '100%',
                  // height: 100,
                  borderWidth: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                  }}>
                  <View
                    style={{
                      padding: 10,
                      width: '23%',
                      borderRightWidth: 0.5,
                    }}>
                    <Text style={{color: 'black'}}>Category</Text>
                  </View>
                  {/* <View style={{borderWidth: 0.5, height: 40}}></View> */}
                  <View style={{padding: 10}}>
                    <Text style={{color: 'black'}}>Conditions</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row', borderBottomWidth: 0.5}}>
                  <View
                    style={{
                      padding: 10,
                      width: '23%',
                      borderRightWidth: 0.5,
                    }}>
                    <Text style={{color: 'black'}}>Complete Product</Text>
                  </View>

                  <View style={{padding: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        width: '80%',
                      }}>
                      <Text>•</Text>
                      <View style={{paddingHorizontal: 4}}></View>
                      <Text style={{fontSize: 11, lineHeight: 16}}>
                        All in-the-box accessories & freebies and combos (if
                        any) should be present.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row', borderBottomWidth: 0.5}}>
                  <View
                    style={{
                      padding: 10,
                      width: '23%',
                      borderRightWidth: 0.5,
                    }}>
                    <Text style={{color: 'black'}}>Unused Product</Text>
                  </View>

                  <View style={{padding: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        width: '80%',
                      }}>
                      <Text>•</Text>
                      <View style={{paddingHorizontal: 4}}></View>
                      <Text style={{fontSize: 11, lineHeight: 16}}>
                        The product should be unused, unwashed, unsoiled,
                        without any stains and with non-tampered quality check
                        seals/ warranty seals (wherever applicable). Before
                        returning any product.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row', borderBottomWidth: 0.5}}>
                  <View
                    style={{
                      padding: 10,
                      width: '23%',
                      borderRightWidth: 0.5,
                    }}>
                    <Text style={{color: 'black'}}>Undagamed Product</Text>
                  </View>

                  <View style={{padding: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        width: '80%',
                      }}>
                      <Text>•</Text>
                      <View style={{paddingHorizontal: 4}}></View>
                      <Text style={{fontSize: 11, lineHeight: 16}}>
                        The product should be undamaged and without any
                        scratches, dents, tears or holes.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{flexDirection: 'row', borderBottomWidth: 0.5}}>
                  <View
                    style={{
                      padding: 10,
                      width: '23%',
                      borderRightWidth: 0.5,
                    }}>
                    <Text style={{color: 'black'}}>Undagamed Packaging</Text>
                  </View>

                  <View style={{padding: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        width: '80%',
                      }}>
                      <Text>•</Text>
                      <View style={{paddingHorizontal: 4}}></View>
                      <Text style={{fontSize: 11, lineHeight: 16}}>
                        Product's original packaging/ box should be undamaged.
                        For any products for which a refund is to be given, the
                        refund will be processed once the returned product has
                        been received by the customer to us.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={{fontSize: 11, fontWeight: '500', marginTop: 20}}>
                For any products for which a refund is to be given, the refund
                will be processed once the returned product has been received by
                the customer to us.
              </Text>
              <Text style={{fontSize: 11, marginTop: 10}}>
                In certain cases where the manufacturer is unable to process a
                replacement for any reason whatsoever, a refunds will be given
                in the same manner the payment was received. If the order was
                prepaid, refund will be done in the bank account and if the
                order was cash on delivery, refund will be in the Dentalkart
                account (coupon form).
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReturnTnC;

const styles = StyleSheet.create({
  itemHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeaderImageContainer: {
    height: wp('15%'),
    width: wp('15%'),
    borderRadius: wp('10%'),
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeaderImage: {
    height: wp('12%'),
    width: wp('12%'),
    borderRadius: wp('10%'),
  },
  itemHeaderText: {
    flex: 1,
    marginHorizontal: wp('5%'),
    fontSize: 14,
    fontWeight: 'bold',
  },
  returnErrorText: {
    flex: 1,
    marginHorizontal: wp('5%'),
    paddingTop: hp('1%'),
    fontSize: 12,
    color: 'red',
  },
  inputContainer: {
    marginTop: hp('2%'),
    borderWidth: 1,
    borderRadius: hp('1%'),
    borderColor: '#cccccc',
    height: hp('6%'),
    paddingHorizontal: wp('3%'),
  },
  dropDownStyle: {
    height: hp('6%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  dropDownContainerStyle: {
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  dropDownItemStyle: {
    alignSelf: 'flex-start',
    padding: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownOpenContainerStyle: {
    backgroundColor: '#FFF',
    borderColor: '#CCCCCC',
    position: 'absolute',
    zIndex: 100,
  },
  dropDownTextStyle: {
    fontWeight: '500',
    fontSize: wp('4%'),
    color: '#25303C',
  },
  dropDownPlaceholderText: {
    fontSize: 15,
    color: 'grey',
  },
});
