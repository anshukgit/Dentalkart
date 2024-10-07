import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';
import RewardsStyle from './rewards_expiry.style.js';
import {Query} from 'react-apollo';
import {GET_REWARDS_EXPIRY_TRANSACTIONS_QUERY} from '../../graphql';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '@components/loader';
import {showErrorMessage} from '../../../../../../helpers/show_messages';

const NoTransaction = ({navigation}) => (
  <View style={RewardsStyle.noTransactionContainer}>
    <Icon name="coin" size={80} color="#28282820" />
    <Text allowFontScaling={false} style={RewardsStyle.noTransactionText}>No transactions yet</Text>
    <TouchableCustom onPress={() => navigation.navigate({routeName: 'Home'})}>
      <View style={RewardsStyle.noTransactionButton}>
        <Text allowFontScaling={false} style={RewardsStyle.noTransactionButtonText}>Shop Now</Text>
        <Icon name="arrow-right" size={15} color="#fff" />
      </View>
    </TouchableCustom>
  </View>
);

let ExpiryList = ({item, data, icon}) => {
  return (
    <View style={RewardsStyle.expiryCardLayout}>
      <View style={RewardsStyle.rewardExpiryAmountWrapper}>
        <View style={RewardsStyle.rewardExpiryAmountImageWrapper}>
          <Image source={{uri: icon}} style={RewardsStyle.rewardExpiryIcon} />
          <Text allowFontScaling={false} style={RewardsStyle.rewardExpiryAmount}>{item.amount}</Text>
        </View>
        <Text allowFontScaling={false} style={RewardsStyle.rewardExpiryAmountText}>
          {data.reward_term}
        </Text>
        <Text allowFontScaling={false} style={RewardsStyle.rewardExpiryDateText}>
          Expires on: {item.expired_time}
        </Text>
      </View>
      <View style={RewardsStyle.expiryCardBottomBox}>
        <View style={RewardsStyle.expiryCardBottomBallLeft} />
        <View style={RewardsStyle.expiryCardLayoutBorder} />
        <View style={RewardsStyle.expiryCardBottomBallRight} />
      </View>
      <View style={RewardsStyle.expiryInfoWrapper}>
        <Text allowFontScaling={false} style={RewardsStyle.rewardEarnTime}>
          Txn No. #{item.history_id} ({item.transaction_time})
        </Text>
      </View>
    </View>
  );
};

export default class RewardsExpiry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10000,
      pageNo: 0,
    };
  }
  render() {
    const {rowsPerPage, pageNo} = this.state;
    return (
      <Query
        query={GET_REWARDS_EXPIRY_TRANSACTIONS_QUERY}
        fetchPolicy="cache-and-network"
        variables={{pageSize: rowsPerPage, currentPage: pageNo + 1}}
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({data, loading, error}) => {
          if (error) {
            return <Text allowFontScaling={false}>Some error occured. Try again in sometime.</Text>;
          }
          if (data && data.getRewardsExpiryTransactions) {
            return (
              <View>
                <View style={RewardsStyle.transactionHeadingWrapper}>
                  <Text allowFontScaling={false} style={RewardsStyle.transactionHeading}>
                    Rewards Expiry
                  </Text>
                  <Text allowFontScaling={false} style={RewardsStyle.expiryInfo}>
                    {data.getRewardsExpiryTransactions.info}
                  </Text>
                </View>
                <FlatList
                  data={data.getRewardsExpiryTransactions.transactions}
                  renderItem={({item, index}) => (
                    <ExpiryList
                      item={item}
                      data={data}
                      icon={data.getRewardsExpiryTransactions.reward_icon}
                    />
                  )}
                  keyExtractor={(item, index) => item.history_id}
                  style={RewardsStyle.transactionsContainer}
                  numColumns={2}
                  ListEmptyComponent={() => (
                    <NoTransaction navigation={this.props.navigation} />
                  )}
                />
              </View>
            );
          } else {
            return <Loader loading={loading} transparent={true} />;
          }
        }}
      </Query>
    );
  }
}
