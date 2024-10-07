import {StyleSheet} from 'react-native';
import {SecondaryColor, DeviceWidth, PrimaryColor} from '@config/environment';
export default styles = StyleSheet.create({
  rewardsContainer: {
    // backgroundColor: '#fff',

    // padding: 5,
    // paddingHorizontal:20,
    marginBottom: 0,
    borderRadius: 3,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    // marginTop:35,
  },
  rewardsToEarnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardIcon: {
    width: 23,
    height: 23,
    marginRight: 5,
  },
  rewardsToEarnText: {
    color: '#282828',
    fontSize: 15,
  },
  rewardsGainedText: {
    paddingVertical: 2,
    fontSize: 12,
    color: colors.LightSlateGrey,
  },
  rewardsGainedPrice: {
    color: 'green',
    fontSize: 15,
  },
  rewardsGainedInfo: {
    color: '#28282880',
    fontSize: 10,
  },
  useRewardsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardsTitleWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
    paddingBottom: 4,
  },
  rewardsTitle: {
    color: '#282828',
    fontSize: 14,
    paddingBottom: 7,
    marginTop: 4,
  },
  sliderWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: DeviceWidth * 0.7,
  },
  rewardsRate: {
    color: '#28282880',
    alignSelf: 'center',
    paddingBottom: 5,
    fontSize: 12,
  },
  rewardsTotalBenefits: {
    color: PrimaryColor,
    fontSize: 15,
    paddingBottom: 8,
    textAlign: 'center',
  },
  applyRewardsButton: {
    margin: 5,
    marginHorizontal: 50,
    borderColor: SecondaryColor,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  applyRewardsButtonText: {
    color: SecondaryColor,
    textAlign: 'center',
  },
  rewardsInUseWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: 25,
    width: 50,
    padding: 4,
    marginHorizontal: 2,
    fontSize: 13,
  },
  checkBoxMainView: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    marginLeft: -6,
  },
  checkBoxView: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedTxtView: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  applyRewardsButtonView: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 3,
  },
  applyRewardTxt: {fontSize: 13, color: '#292929', marginLeft: 10, top: -5},
});
