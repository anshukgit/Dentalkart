import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import MyAddresses from './modules/address';
import HeaderComponent from '@components/HeaderComponent';
import Header from '@components/header';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';

class MyAddressesScreen extends React.Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      deliveryAddress: props.deliveryAddress,
      title: 'My Addresses',
      showModal: false,
      modalHeader: 'Delete Address',
      modalStatement: 'Are you sure you want to delete this address?',
      modalRightActionText: 'YES, DELETE',
      modalLeftActionText: 'CANCEL',
      removeAddressId: '',
      modalRightAction: true,
    };
  }
  deliverHere(item) {
    this.props.navigation.push('Payment', {item});
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `My Address`,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    const {state} = this.props.navigation;
    const isCheckout = state.params ? state.params.checkout : false;
    return (
      <View style={{flex: 1}}>
        {/* <Header
                    heading={this.state.title}
                    navigation={this.props.navigation}
                    back
                /> */}
        <HeaderComponent
          navigation={this.props.navigation}
          label={this.state.title}
          onPress={() => this.props.navigation.goBack()}
          style={{height: 40}}
        />
        <ScrollView style={{backgroundColor: '#fff'}}>
          <MyAddresses
            navigation={this.props.navigation}
            data={this.props.addresses}
            _this={this}
            checkout={isCheckout}
          />
        </ScrollView>
      </View>
    );
  }
}

export default MyAddressesScreen;
