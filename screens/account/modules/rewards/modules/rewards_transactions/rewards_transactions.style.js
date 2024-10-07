import {StyleSheet} from 'react-native';
import {DeviceWidth, PrimaryColor} from '@config/environment';

export default styles = StyleSheet.create({
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
		width: DeviceWidth-10,
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
});
