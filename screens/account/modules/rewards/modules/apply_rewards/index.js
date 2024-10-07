import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Query, Mutation} from 'react-apollo';
import {GET_CART_REWARDS_QUERY, APPLY_REWARD_POINTS} from '../../graphql';
import styles from './apply_rewards.style';
import Loader from '@components/loader';
import {GET_NEW_CART} from '@screens/cart/graphql';
import SyncStorage from '@helpers/async_storage';
import {client, cartClient} from '../../../../../../apollo_client';
import {showErrorMessage, showSuccessMessage} from '@helpers/show_messages';
import {Icon} from 'native-base';
export default class CartRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }
  render() {
    const {_this, postUpdateCart} = this.props;

    return (
      <Query
        query={GET_CART_REWARDS_QUERY}
        client={cartClient}
        fetchPolicy="cache-and-network">
        {({data, loading, error}) => {
          if (error) {
            return showErrorMessage(`${error.message}. Please try again.`);
          }
          console.log('props ApplyRewards ========6565656', this.props);
          if (data && data.applicableRewardPointsV2) {
            const info = data.applicableRewardPointsV2;
            return (
              <ApplyRewards
                _this={_this}
                info={info}
                postUpdateCart={postUpdateCart}
                applied_points={this.props.applied_points}
              />
            );
          } else {
            return <Loader loading={loading} transparent={true} />;
          }
        }}
      </Query>
    );
  }
}
class ApplyRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: parseInt(this.props.info.max_applied_points),
      isChecked: parseInt(this.props.applied_points?.value),
      isReward: true,
      customer_cart_id: 0,
    };
  }

  async componentWillMount() {
    let customer_cart_id = await SyncStorage.get('customer_cart_id');
    this.setState({customer_cart_id});
    console.log('componentWillMount');
    // if (this.state.isChecked) this.onApplyRewardsClick();
  }

  // onApplyRewardsClick() {
  //   const {postUpdateCart} = this.props;
  //   this.setState({
  //     isChecked: !this.state.isChecked,
  //     coins: this.state.isChecked
  //       ? 0
  //       : parseInt(this.props.info.max_applied_points),
  //   });
  // }

  async updateRewardPoint() {
    console.log('calling updateRewardPoint');
    const {coins} = this.state;
    const {postUpdateCart} = this.props;
    try {
      const {data} = await client.mutate({
        mutation: APPLY_REWARD_POINTS,
        variables: {rewardpoints: coins},
        refetchQueries: () => {
          return [
            {
              query: GET_NEW_CART,
              variables: {cart_id: this.state.customer_cart_id},
            },
          ];
        },
        update: () => {
          // setTimeout(() => {
          postUpdateCart();
          // }, 100);
        },
        onCompleted: () => {
          // postUpdateCart();
          // showSuccessMessage(
          //   !this.state.isChecked
          //     ? 'Rewards points removed successfully.'
          //     : 'Rewards points applied successfully.',
          // );
          if (
            parseInt(this.props.info.max_point_to_checkout) ===
            parseInt(this.props.info.applied_points)
          ) {
            // _this.getCustomerData();
          }
        },
      });
    } catch (err) {
      console.log('updateRewardPoint error : ', err);
    }
  }

  componentDidUpdate() {
    // const {postUpdateCart} = this.props;
    // // setTimeout(() => {
    // console.log(
    //   'componentDidUpdate',
    //   parseInt(this.props.info.max_point_to_checkout),
    //   parseInt(this.props.info.applied_points),
    // );
    // if (this.state.isChecked) {
    //   if (
    //     parseInt(this.props.info.max_point_to_checkout) !==
    //     parseInt(this.props.info.applied_points)
    //   ) {
    //     console.log('not equal======');
    //     this.updateRewardPoint();
    //     console.log('equal======');
    //   } else {
    //     postUpdateCart();
    //   }
    // }
    // }, 1000);
  }

  render() {
    const {_this, info, postUpdateCart} = this.props;
    const {coins, isChecked} = this.state;
    console.log('info=============22222', info);
    const customer_cart_id = this.state.customer_cart_id;
    return (
      <View>
        <View style={styles.rewardsContainer}>
          <View style={styles.applyRewardsButtonView}>
            <Mutation
              mutation={APPLY_REWARD_POINTS}
              variables={{
                rewardpoints: isChecked ? info.max_applied_points : 0,
              }}
              refetchQueries={() => {
                return [
                  {
                    query: GET_NEW_CART,
                    variables: {cart_id: customer_cart_id},
                  },
                ];
              }}
              update={() => {
                postUpdateCart();
              }}
              onCompleted={() => {
                showSuccessMessage(
                  !this.state.isChecked
                    ? 'Rewards points removed successfully.'
                    : 'Rewards points applied successfully.',
                );
                // _this.getCustomerData();
              }}>
              {(applyRewards, {data, loading, error}) => {
                console.log('Rewards points===========', JSON.stringify(data));
                if (error) {
                  console.log('error=======', error);
                }
                if (loading) {
                  return <Loader loading={true} transparent={true} />;
                }
                return (
                  <TouchableCustom
                    onPress={() => {
                      this.setState({isChecked: !this.state.isChecked}, () => {
                        if (this.state.isChecked) {
                          this.setState(
                            {
                              coins: parseInt(
                                this.props.info.max_applied_points,
                              ),
                            },
                            () => {
                              applyRewards();
                            },
                          );
                        } else {
                          this.setState({coins: 0}, () => {
                            applyRewards();
                          });
                        }
                      });
                    }}
                    underlayColor="#ffffff10">
                    <View style={styles.checkBoxMainView}>
                      <View
                        style={[
                          styles.checkBoxView,
                          {
                            borderColor: this.state.isChecked
                              ? colors.blueColor
                              : colors.otpBorder,
                          },
                        ]}>
                        {this.state.isChecked ? (
                          <Icon
                            name="check"
                            type="AntDesign"
                            style={{fontSize: 12, color: colors.blueColor}}
                          />
                        ) : null}
                      </View>
                      <Text
                        allowFontScaling={false}
                        style={styles.applyRewardTxt}>
                        Apply reward {info.max_point_message}
                      </Text>
                    </View>
                  </TouchableCustom>
                );
              }}
            </Mutation>
          </View>
          <View style={styles.earnedTxtView}>
            <Text
              allowFontScaling={false}
              style={[styles.rewardsGainedText, {}]}>
              Apply Rewards.(You can apply {info.max_applied_points} point for
              this order).
            </Text>

            {/* <Text allowFontScaling={false} style={styles.rewardsGainedInfo}>
                {info.reward_gain_info}
              </Text> */}
          </View>
        </View>
      </View>
    );
  }
}
