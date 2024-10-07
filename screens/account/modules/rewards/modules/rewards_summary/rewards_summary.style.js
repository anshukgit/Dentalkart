import {StyleSheet} from 'react-native';
import {PrimaryColor, SecondaryColor, DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
    header:{
        height: 50,
        marginTop: 10
    },
    headerTopBlock: {
        height: 25,
    },
    headerBottomBlock: {
        height: 25,
        backgroundColor: '#ffffff'
    },
    headerCircle: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        left: (DeviceWidth-50)/2,
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#ffffff'
    },
	rewardsContainer: {
		backgroundColor: '#fff',
		marginBottom: 5,
		padding: 15,
		paddingTop: 0
	},
	rewardImageIcon: {
		width: 30,
		height: 30,
	},
	pendingRewardsWrapper: {
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'center'
	},
	rewardsWrapper: {
		flex: 2,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 5
	},
	rewardPriceWrapper: {
		flex: 1,
	},
	rewardBalanceWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	rewardImage: {
		width: 22,
		height: 22,
		resizeMode: 'contain',
		marginRight: 5
	},
	rewardsTitleWrapper: {
		marginLeft: 28,
	},
	rewardTitle: {
		fontSize: 13,
		color: '#282828'
	},
	monetaryInfo: {
		color: '#28282880',
		fontSize: 10
	},
	rewardCoins: {
		color: SecondaryColor,
		fontWeight: 'bold',
		fontSize: 13
	},
	rewardPrice: {
		fontSize: 25,
		color: SecondaryColor
	},
	rewardMoney: {
		fontSize: 25,
		color: PrimaryColor
	},
	transactionsContainer: {
		marginHorizontal: 6
	},
	expireDateWrapper: {
		borderTopColor: "#efefef",
		borderTopWidth: 1,
		padding: 5,
	},
	expireDate: {
		alignSelf: 'flex-end',
		color: '#282828',
		backgroundColor: '#f9e50070'
	},
	expiryCardLayout: {
		elevation: 0.5,
		shadowColor: '#bfbfbf',
		shadowOffset: {
	      height: 0,
		  width: 0
	    },
		shadowOpacity: .5,
		shadowRadius: 2,
		backgroundColor: '#fff',
		borderRadius: 3,
		height: 120,
		width: DeviceWidth/2 - 15,
		margin: 5
	},
	expiryCardBottomBox: {
		position: 'absolute',
		bottom: 20,
		width: DeviceWidth,
		flexDirection: 'row',
		alignItems: 'center',
	},
	expiryCardBottomBallLeft: {
		backgroundColor: '#f1f3f6',
		height: 30,
		width: 30,
		borderRadius: 20,
		position: 'absolute',
		left: -17
	},
	expiryCardLayoutBorder: {
		width: DeviceWidth/2 - 55,
		borderTopWidth: 0.5,
		borderStyle: 'dashed',
		borderTopColor: '#efefef',
		marginLeft: 20,
		marginRight: 7,
	},
	expiryCardBottomBallRight: {
		backgroundColor: '#f1f3f6',
		height: 30,
		width: 30,
		borderRadius: 20,
	},
	rewardExpiryAmountWrapper: {
		padding: 5,
		alignItems: 'flex-end',
	},
	rewardExpiryAmountImageWrapper: {
		flexDirection: 'row',
	},
	rewardExpiryIcon: {
		width: 20,
		height: 20
	},
	rewardExpiryAmount: {
		fontSize: 20,
		color: SecondaryColor,
	},
	rewardExpiryAmountText: {
		color: SecondaryColor,
		fontSize: 12
	},
	rewardExpiryDateText:{
		color: PrimaryColor,
		fontSize: 13
	},
	expiryInfoWrapper: {
		position: 'absolute',
		bottom: 5,
		padding: 5,
		width: DeviceWidth/2 - 20,
		alignItems: 'center'
	},
	rewardEarnTime: {
		fontSize: 10,
		color: '#28282880'
	},
	expiryInfo: {
		textAlign: 'center',
		fontSize: 10,
		color: '#28282880',
		padding: 5
	},
	pendingRewardsContainer: {
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
		paddingBottom: 5
	},
	rewardsPendingCard: {
		backgroundColor: '#fff',
		elevation: 0.5,
		shadowColor: '#bfbfbf',
		shadowOffset: {
	      height: 0,
		  width: 0
	    },
		shadowOpacity: .5,
		shadowRadius: 2,
		marginBottom: 5,
		width: DeviceWidth-10,
		padding: 10,
		borderRadius: 4
	},
	rewardsPendingHeadingWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rewardPendingAmountText: {
		color: '#28282880',
		fontSize: 15
	},
	rewardPendingAmount: {
		color: PrimaryColor,
		fontSize: 15,
		fontWeight: 'bold'
	},
	rewardPendingTimeWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 5
	},
	rewardPendingInfoText: {
		color: '#28282880',
		fontSize: 13
	},
	rewardsInfoWrapper: {
		elevation: 1,
		shadowColor: '#bfbfbf',
		shadowOffset: {
	      height: 0,
		  width: 0
	    },
		shadowOpacity: .5,
		shadowRadius: 2,
		backgroundColor: '#fff',
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5,
		padding: 10
	},
	rewardsInfoTextWrapper: {
		flex: 2
	},
	rewardsInfoText: {
		color: '#28282880',
		fontSize: 13,
		paddingHorizontal: 5
	},
	rewardsInfoButtonWrapper: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: PrimaryColor,
		elevation: 1,
		shadowColor: '#bfbfbf',
		shadowOffset: {
	      height: 0,
		  width: 0
	    },
		shadowOpacity: .5,
		shadowRadius: 2,
		backgroundColor: '#fff',
		borderRadius: 3
	},
	rewardsInfoButtonText: {
		color: PrimaryColor,
		fontSize: 13
	},
    short_summary: {
        marginTop: 10
    },
    short_summary_text: {
        fontSize: 10,
        color: '#28282880',
        marginBottom: 5
    }
})
