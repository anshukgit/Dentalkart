import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  InteractionManager,
  Modal,
  SafeAreaView,
} from 'react-native';
import RewardsSummary from './modules/rewards_summary';
import Header from '@components/header';
import RewardsInstructions from './modules/rewards_instructions';
import RewardsTransactions from './modules/rewards_transactions';
import RewardsExpiry from './modules/rewards_expiry';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SecondaryColor, PrimaryColor} from '@config/environment';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import HeaderComponent from '@components/HeaderComponent';

class TransactionsScreen extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }
  showRewardsInfo() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({modalVisible: true});
    });
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Rewards`,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    return (
      <SafeAreaView>
        <HeaderComponent
          onPress={() =>
            this.props.navigation.navigate('Tabs', {screen: 'Account'})
          }
          navigation={this.props.navigation}
          label={'My Rewards'}
          style={{height: 40}}
        />
        <ScrollView style={{marginBottom: 50}}>
          <RewardsSummary _this={this} />
          <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setState({modalVisible: false})}>
            <SafeAreaView>
              <HeaderComponent
                navigation={this.props.navigation}
                label={'My Rewards'}
                style={{height: 40}}
                onPress={() => {
                  this.setState({modalVisible: false});
                  this.props.navigation.goBack();
                }}
                onSearchPress={() => {
                  this.setState({modalVisible: false});
                }}
                cartPress={() => {
                  this.setState({modalVisible: false});
                }}
              />
              <RewardsInstructions />
            </SafeAreaView>
          </Modal>
          <RewardsTransactions navigation={this.props.navigation} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

class RewardsExpiryScreen extends Component {
  render() {
    return (
      <View>
        <HeaderComponent
          onPress={() =>
            this.props.navigation.navigate('Tabs', {screen: 'Account'})
          }
          navigation={this.props.navigation}
          label={'My Rewards'}
          style={{height: 40}}
        />
        <ScrollView style={{marginBottom: 50}}>
          <RewardsExpiry navigation={this.props.navigation} />
        </ScrollView>
      </View>
    );
  }
}

const MyRewards = createBottomTabNavigator(
  {
    Transactions: {
      screen: TransactionsScreen,
      navigationOptions: {
        title: 'Transactions',
      },
    },
    'Rewards Expiry': {
      screen: RewardsExpiryScreen,
      navigationOptions: {
        title: 'Rewards Expiry',
      },
    },
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Transactions') {
          iconName = `ios-list-box${focused ? '' : ''}`;
          return <Icon name={iconName} size={25} color={tintColor} />;
        } else if (routeName === 'Rewards Expiry') {
          iconName = `cards${focused ? '' : '-outline'}`;
          return <MIcon name={iconName} size={25} color={tintColor} />;
        }
      },
    }),
    initialRouteName: 'Transactions',
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: PrimaryColor,
      inactiveTintColor: '#28282880',
      upperCaseLabel: false,
      labelStyle: {
        fontSize: 12,
        paddingBottom: 2,
        marginTop: -5,
      },
      style: {
        backgroundColor: '#fff',
      },
    },
  },
);
export default createAppContainer(MyRewards);
