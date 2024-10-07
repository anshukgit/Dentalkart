import {StyleSheet} from 'react-native';
import {SecondaryColor, PrimaryColor, DeviceWidth as Width} from '@config/environment';

export default RewardsStyle = StyleSheet.create({
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
        left: (Width-50)/2,
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
	transactionHeadingWrapper: {
		padding: 5,
		paddingLeft: 10,
		marginBottom: 5
	},
	transactionHeading: {
		fontSize: 15,
		color: '#282828',
		textAlign: 'center'
	},
	transactionsContainer: {
		marginHorizontal: 6
	},
	rewardInfoContainer: {
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
		width: Width-10,
		marginLeft: 5,
		borderLeftWidth: 4
	},
	rewardInfoWrapper: {
		paddingVertical: 10,
		flex: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rewardInfo: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	rewardAmountWrapper: {
		flex: 4
	},
	rewardIcon: {
		width: 50,
		height: 50
	},
	rewardAmount: {
		fontSize: 16
	},
	rewardAmountText: {
		color: '#282828',
		fontWeight: 'bold',
		paddingBottom: 3
	},
	rewardType: {
		color: '#28282880',
		paddingBottom: 3,
	},
	rewardTimeWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rewardTime: {
		color: '#28282880',
		fontSize: 10
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
	noTransactionContainer: {
		backgroundColor: '#fff',
		alignItems: 'center',
		padding: 10,
		elevation: 2,
		shadowColor: '#bfbfbf',
		shadowOffset: {
	      height: 0,
		  width: 0
	    },
		shadowOpacity: .5,
		shadowRadius: 2,
	},
	noTransactionText: {
		color: '#28282880',
		textAlign: 'center',
		paddingHorizontal: 50,
		paddingVertical: 10
	},
	noTransactionButton: {
		marginVertical: 15,
		backgroundColor: PrimaryColor,
		paddingVertical: 8,
		paddingHorizontal: 10,
		flexDirection: 'row',
		borderRadius: 5,
		alignItems: 'center'
	},
	noTransactionButtonText: {
		color: '#fff',
		fontSize: 14,
		marginRight: 5
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
		backgroundColor: '#f1f8fe',
		borderRadius: 3,
		height: 120,
		width: Width/2 - 15,
		margin: 5
	},
	expiryCardBottomBox: {
		position: 'absolute',
		bottom: 20,
		width: Width,
		flexDirection: 'row',
		alignItems: 'center',
	},
	expiryCardBottomBallLeft: {
		backgroundColor: '#fff',
		height: 30,
		width: 30,
		borderRadius: 20,
		position: 'absolute',
		left: -17
	},
	expiryCardLayoutBorder: {
		width: Width/2 - 55,
		borderTopWidth: 0.5,
		borderStyle: 'dashed',
		borderTopColor: '#efefef',
		marginLeft: 20,
		marginRight: 7,
	},
	expiryCardBottomBallRight: {
		backgroundColor: '#fff',
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
		paddingLeft: 15,
		width: Width/2 - 20,
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
		width: Width-10,
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
	imagesWrapper: {
		marginBottom: 20
	},
	instructionImageWrapper: {
		marginBottom: 25
	},
	instructionImage: {
		width: Width,
		height: Width,
		resizeMode: 'contain'
	}
});
