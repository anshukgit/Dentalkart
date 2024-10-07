import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Image,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';
import {Query} from 'react-apollo';
import {GET_ACCOUNT_REWARDS_QUERY} from '../../graphql';
import styles from './rewards_summary.style';
import {showErrorMessage} from '../../../../../../helpers/show_messages';

export default class RewardsSummary extends Component {
  render() {
    const {_this} = this.props;
    return (
      <Query
        query={GET_ACCOUNT_REWARDS_QUERY}
        fetchPolicy="cache-and-network"
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({data, loading, error}) => {
          if(loading || error){
            return null;
          }
          if (data && data.getRewardsAccountInfo) {
            const {
              balance,
              balance_monetary,
              pending_points,
              pending_points_monetary,
              spent_points,
              spent_monetary,
              earn_points,
              earned_points_monetary,
              currency,
              reward_icon,
              reward_term,
              currency_icon,
              exchange_rate_info,
            } = data.getRewardsAccountInfo;
            return (
              <View>
                <View style={styles.rewardsContainer}>
                  <View style={styles.rewardsWrapper}>
                    <View style={styles.rewardPriceWrapper}>
                      <View style={styles.rewardBalanceWrapper}>
                        <Image
                          source={{uri: reward_icon}}
                          style={styles.rewardImage}
                        />
                        <Text allowFontScaling={false} style={styles.rewardPrice}>{balance}</Text>
                      </View>
                      <View style={styles.rewardsTitleWrapper}>
                        <Text allowFontScaling={false} style={styles.rewardTitle}>
                          Total {reward_term}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rewardPriceWrapper}>
                      <View style={styles.rewardBalanceWrapper}>
                        <Image
                          source={{uri: currency_icon}}
                          style={styles.rewardImage}
                        />
                        <Text allowFontScaling={false} style={styles.rewardMoney}>
                          {currency}
                          {balance_monetary}
                        </Text>
                      </View>
                      <View style={styles.rewardsTitleWrapper}>
                        <Text allowFontScaling={false} style={styles.rewardTitle}>Monetary value</Text>
                        <Text allowFontScaling={false} style={styles.monetaryInfo}>
                          {exchange_rate_info}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.short_summary}>
                    <Text allowFontScaling={false} style={styles.short_summary_text}>
                      Total {reward_term} Pending: {pending_points} ({currency}{' '}
                      {pending_points_monetary})
                    </Text>
                    <Text allowFontScaling={false} style={styles.short_summary_text}>
                      Total {reward_term} Spent: {spent_points} ({currency}{' '}
                      {spent_monetary})
                    </Text>
                    <Text allowFontScaling={false} style={styles.short_summary_text}>
                      Total {reward_term} Earned: {earn_points} ({currency}{' '}
                      {earned_points_monetary}){' '}
                    </Text>
                  </View>
                </View>
                <View style={styles.rewardsInfoWrapper}>
                  <View style={styles.rewardsInfoTextWrapper}>
                    <Text allowFontScaling={false} style={styles.rewardsInfoText}>
                      To know more about Dentalkart Rewards and its functions.
                      Click here.
                    </Text>
                  </View>
                  <TouchableCustom onPress={() => _this.showRewardsInfo()}>
                    <View style={styles.rewardsInfoButtonWrapper}>
                      <Text allowFontScaling={false} style={styles.rewardsInfoButtonText}>Rewards</Text>
                    </View>
                  </TouchableCustom>
                </View>
              </View>
            );
          } else {
            return null;
          }
        }}
      </Query>
    );
  }
}
