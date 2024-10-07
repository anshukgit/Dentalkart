import React, {Component} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  FlatList,
  TouchableHighlight,
  Image,
  ScrollView,
} from 'react-native';
import {Query} from 'react-apollo';
import {GET_REWARDS_TRANSACTIONS_QUERY} from '../../graphql';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './rewards_transactions.style';
import TouchableCustom from '@helpers/touchable_custom';
import Loader from '@components/loader';
import {showErrorMessage} from '../../../../../../helpers/show_messages';

export function handlePress(item, _this) {
  const {navigate, dispatch} = _this.navigation;
  this.requestAnimationFrame(() => {
    if (item) {
      if (item.history_order_increment_id) {
        navigate('OrderDetails', {orderId: item.history_order_increment_id});
      }
    } else {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Home'})],
      });
      dispatch(resetAction);
    }
  });
}

let TransactionList = ({item, _this}) => {
  return (
    <TouchableHighlight
      onPress={() => handlePress(item, _this)}
      underlayColor="#ffffff10">
      <View
        style={[
          styles.rewardInfoContainer,
          {borderLeftColor: item.amount_with_sign > 0 ? '#39b54a' : 'red'},
        ]}>
        <View style={styles.rewardInfoWrapper}>
          <View style={styles.rewardInfo}>
            <Image source={{uri: item.reward_icon}} style={styles.rewardIcon} />
          </View>
          <View style={styles.rewardAmountWrapper}>
            <Text allowFontScaling={false} style={styles.rewardAmountText}>
              {item.amount_text} {item.amount} {item.reward_term}
            </Text>
            <Text allowFontScaling={false} style={styles.rewardAmountText}>
              Status: {item.status}
            </Text>
            <Text allowFontScaling={false} style={styles.rewardType}>
              {item.type_of_transaction}
            </Text>
            <Text
              allowFontScaling={false}
              style={
                styles.rewardTime
              }>{`Order Id:  ${item.history_order_increment_id}`}</Text>
            <View style={styles.rewardTimeWrapper}>
              {item.history_id ? (
                <Text allowFontScaling={false} style={styles.rewardTime}>
                  Txn No. #{item.history_id}{' '}
                </Text>
              ) : null}
              <Text allowFontScaling={false} style={styles.rewardTime}>
                ({item.transaction_time})
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              style={
                styles.rewardTime
              }>{`Expiring on ${item.expired_time}`}</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const NoTransaction = ({navigation}) => (
  <View style={RewardsStyle.noTransactionContainer}>
    <Icon name="coin" size={80} color="#28282820" />
    <Text allowFontScaling={false} style={RewardsStyle.noTransactionText}>
      No transactions yet
    </Text>
    <TouchableCustom onPress={() => navigation.navigate({routeName: 'Home'})}>
      <View style={RewardsStyle.noTransactionButton}>
        <Text
          allowFontScaling={false}
          style={RewardsStyle.noTransactionButtonText}>
          Shop Now
        </Text>
        <Icon name="arrow-right" size={15} color="#fff" />
      </View>
    </TouchableCustom>
  </View>
);

export default class RewardsTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10000,
      pageNo: 0,
    };
  }
  render() {
    const {rowsPerPage, pageNo} = this.state;
    const {_this} = this.props;
    return (
      <Query
        query={GET_REWARDS_TRANSACTIONS_QUERY}
        fetchPolicy="cache-and-network"
        variables={{pageSize: rowsPerPage, currentPage: pageNo + 1}}
        onError={(error) => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({data, loading, error}) => {
          if (error) {
            return (
              <Text allowFontScaling={false}>
                Some error occured. Try again in sometime.
              </Text>
            );
          }
          if (data && data.getRewardsTransctions) {
            return (
              <ScrollView>
                <View style={styles.transactionHeadingWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={styles.transactionHeading}>
                    Transaction History
                  </Text>
                </View>
                <View>
                  {data.getRewardsTransctions.transactions ? (
                    <FlatList
                      data={data.getRewardsTransctions.transactions}
                      renderItem={({item, index}) => (
                        <TransactionList item={item} _this={this.props} />
                      )}
                      keyExtractor={(item, index) => item.history_id}
                      initialNumToRender={5}
                      ListEmptyComponent={() => (
                        <NoTransaction navigation={this.props.navigation} />
                      )}
                    />
                  ) : null}
                </View>
              </ScrollView>
            );
          } else {
            return <Loader loading={loading} transparent={true} />;
          }
        }}
      </Query>
    );
  }
}
