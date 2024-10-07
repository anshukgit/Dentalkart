import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComponent from '@components/HeaderComponent';
import {styles} from './styles';
import multiusers from '../../../../assets/multiusers.png';
import box from '../../../../assets/box.png';
import insta from '../../../../assets/ri_instagram-fill.png';
import whatsapp from '../../../../assets/ri_whatsapp-fill.png';
import reward from '../../../../assets/reward.png';
import arrowhead from '../../../../assets/arrowhead.png';
import copy from '../../../../assets/ic_outline-file-copy.png';
// import {Icon} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {postRequest} from '@helpers/network';
import Clipboard from '@react-native-community/clipboard';
import Share, {Social} from 'react-native-share';
const MyReferral = ({navigation}) => {
  const [refersCount, setRefersCount] = useState('');
  const [refersRecord, setRefersRecord] = useState('');

  const getReferralCountes = async () => {
    let res = await postRequest(
      'https://referral-prod.dentalkart.com/rewards/referred-count',
      {
        refer_type: 'USER',
      },
      {
        'x-api-key': 'XUQVEomDnXBI5IaZabnujPkbS1rpPlSseG',
      },
    );
    let result = await res.json();
    console.log('res===of==new--API===count', JSON.stringify(result));
    setRefersCount(result);
  };

  const getReferralRecord = async () => {
    let res = await postRequest(
      // 'https://referral-staging.dentalkart.com/rewards/referral-record',
      // 'https://referral-prod.dentalkart.com/rewards/referral-record',
      'https://referral-prod.dentalkart.com/rewards/referral-record',
      {
        refer_type: 'USER',
      },
      {
        'x-api-key': 'XUQVEomDnXBI5IaZabnujPkbS1rpPlSseG',
      },
    );
    let result = await res.json();
    setRefersRecord(result);
  };

  const copyToClipboard = data => {
    Clipboard.setString(data);
    ToastAndroid.show('Copied !', ToastAndroid.SHORT);
  };

  const referralShare = async (url, socialName) => {
    // console.log('url===url==', url);
    // console.log('socialName===socialName==', socialName);
    try {
      const shareResponse = await Share.shareSingle({
        url: url,
        social: socialName,
      });
      console.log('shareResponse===!shareResponse', shareResponse);
    } catch (error) {
      ToastAndroid.show(
        'This App is not installed in your phone !',
        ToastAndroid.SHORT,
      );
      console.log('catch===referralShare=referralShare', error);
    }
  };

  useEffect(() => {
    getReferralCountes();
    getReferralRecord();
  }, []);
  return (
    <View style={styles.mainContainer}>
      <HeaderComponent
        navigation={navigation}
        label={'My Referral'}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.container}>
          {/* <View style={styles.refers}>
            <View style={styles.userReferView}>
              <Image style={styles.refersImg} source={multiusers} />
              <Text style={styles.countes}>
                {refersCount?.referredCount?.[1]?.count}
                09
              </Text>
              <Text style={styles.refTitles}>Users Referred</Text>
            </View>
            <View style={styles.userReferView}>
              <Image style={styles.refersImg} source={box} />
              <Text style={styles.countes}>
                03
                {refersCount?.referredCount?.[0]?.count}
              </Text>
              <Text style={styles.refTitles}>Products Referred</Text>
            </View>
            <View style={styles.userReferView}>
              <Image style={styles.refersImg} source={reward} />
              <Text style={styles.countes}>
                315
                {refersCount?.rewardsCoinsEarned}
              </Text>
              <Text style={styles.refTitles}>Reward Coins Earned</Text>
            </View>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <View style={styles.boxCont}>
              <Image style={styles.refersImg} source={multiusers} />
              <Text style={styles.countes}>
                {refersCount?.referredCount?.find(e => e.refer_type === 'USER')
                  ?.count || 0}
                {/* 09 */}
              </Text>
              <Text style={styles.refTitles}>Users Referred</Text>
            </View>
            <View style={styles.boxCont}>
              <Image style={styles.refersImg} source={box} />
              <Text style={styles.countes}>
                {refersCount?.referredCount?.find(
                  e => e.refer_type === 'PRODUCT',
                )?.count || 0}
                {/* 03 */}
              </Text>
              <Text style={styles.refTitles}>Products Referred</Text>
            </View>
            <View style={styles.boxCont}>
              <Image style={styles.refersImg} source={reward} />
              <Text style={styles.countes}>
                {refersCount?.rewardsCoinsEarned || 0}
                {/* 315 */}
              </Text>
              <Text style={styles.refTitles}>Reward Coins Earned</Text>
            </View>
          </View>

          <View style={styles.rewardAndEarn}>
            <Text style={styles.rewardAndEarnText}>Refer and Earn Rewards</Text>
            <View style={styles.rewardAndEarnSubTitleView}>
              <View style={styles.subTitles}>
                <Text style={styles.rewardAndEarnSubTitleText}>
                  Introduce a friend to Dentalkart and you’ll be credited 250
                  reward coins in your account.
                </Text>
              </View>

              <View style={styles.subTitles}>
                <Text style={styles.rewardAndEarnSubTitleText}>
                  Share your referral link and introduce your friends to
                  DentalKart
                </Text>
              </View>

              <View style={styles.referCodeView}>
                <View>
                  <Text style={styles.referCodeText}>Referral Code</Text>
                  <Text style={styles.referCode}>
                    {refersRecord?.referral_code}
                    {/* 9p5Exz */}
                  </Text>
                </View>

                <Pressable
                  onPress={() => copyToClipboard(refersRecord?.onelink_url)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.referCodeText}>Referral Link</Text>
                  <Image
                    style={[
                      styles.copyImg,
                      {marginLeft: 6, marginTop: 10, tintColor: '#F3943D'},
                    ]}
                    source={copy}
                  />
                </Pressable>
              </View>

              {/* <Pressable
                onPress={() => copyToClipboard(refersRecord?.onelink_url)}
                style={styles.referLinkView}>
                <Text style={styles.referLink}>
                  {refersRecord?.onelink_url?.substr(0, 40)}
                </Text>
                <Image style={styles.copyImg} source={copy} />
              </Pressable> */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#F3943D',
                  padding: 4,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 4,
                }}>
                <Text>
                  {refersRecord?.onelink_url?.substr(0, 40)}
                  {/* https://www.dentalkart.com/Refer heraeus-gluma-desensitizer */}
                </Text>
              </View>
            </View>

            <View style={styles.orLineView}>
              <View style={styles.orLine}></View>
              <Text style={{marginTop: 15, marginHorizontal: 5}}>Or</Text>
              <View style={styles.orLine}></View>
            </View>
            <Text style={styles.shareView}>Share Via</Text>
            <View style={styles.socialIconsView}>
              <TouchableOpacity
                onPress={() =>
                  referralShare(refersRecord?.onelink_url, Share.Social.TWITTER)
                }>
                <Icon
                  size={27}
                  style={styles.socialIcons}
                  name="twitter"
                  type="Feather"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  referralShare(
                    refersRecord?.onelink_url,
                    Share.Social.LINKEDIN,
                  )
                }>
                <Icon
                  size={27}
                  style={styles.socialIcons}
                  name="linkedin"
                  type="Feather"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  referralShare(
                    refersRecord?.onelink_url,
                    Share.Social.INSTAGRAM,
                  )
                }>
                {/* <Icon
                  size={27}
                  style={styles.socialIcons}
                  name="instagram"
                  type="Feather"
                /> */}
                <Image style={{width: 27, height: 27}} source={insta} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  referralShare(
                    refersRecord?.onelink_url,
                    Share.Social.PINTEREST,
                  )
                }>
                <Icon
                  size={27}
                  style={styles.socialIcons}
                  name="pinterest"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  referralShare(
                    refersRecord?.onelink_url,
                    Share.Social.WHATSAPP,
                  )
                }>
                {/* <Icon
                  size={27}
                  style={styles.socialIcons}
                  name="whatsapp"
                  type="Feather"
                /> */}
                <Image style={{width: 27, height: 27}} source={whatsapp} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  referralShare(
                    refersRecord?.onelink_url,
                    Share.Social.FACEBOOK,
                  )
                }>
                <Icon
                  size={27}
                  style={styles.socialIcons}
                  name="facebook"
                  type="Feather"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.termsAndCondition}>
              <Text style={styles.tncText}>Terms & Conditions</Text>
              <View style={styles.termsAndConditionTexts}>
                <Text style={styles.dots}>•</Text>
                <Text style={{fontSize: 12}}>
                  If you do not receive coins after referring a Friend/Product.
                  Please send us an email with your details and your friends
                  detail.
                </Text>
              </View>
              <View style={styles.termsAndConditionTexts}>
                <Text style={styles.dots}>•</Text>
                <Text style={{fontSize: 12}}>
                  If you do not receive coins after referring a Friend/Product.
                  Please send us an email with your details and your friends
                  detail.
                </Text>
              </View>
              <View style={styles.termsAndConditionTexts}>
                <Text style={styles.dots}>•</Text>
                <Text style={{fontSize: 12}}>
                  This offer is subject to availability until stocks last or
                  during the offer period, whichever is earlier The offer may
                  vary from time to time at the company's discretion.
                </Text>
              </View>
              <View style={styles.termsAndConditionTexts}>
                <Text style={styles.dots}>•</Text>
                <Text style={{fontSize: 12}}>
                  Your name and image may be used in any publicity material
                  related to this offer.
                </Text>
              </View>
              <View style={styles.termsAndConditionTexts}>
                <Text style={styles.dots}>•</Text>
                <Text style={{fontSize: 12}}>
                  The offer is valid only if the purchase is made through the
                  referral link or unique personalized coupon code.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyReferral;
