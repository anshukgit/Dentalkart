import {StyleSheet} from 'react-native';
import {SecondaryColor} from '@config/environment';
export default styles = StyleSheet.create({
    container: {
		alignItems: 'flex-start',
		marginTop: 15
	},
	orderId: {
		padding: 10,
		color: '#212121'
	},
	statusBlock: {
		flexDirection: 'row'
	},
	statusTimeWrapper: {
		width: 90,
	},
	statusTime: {
		marginHorizontal: 10,
		fontSize: 12,
		lineHeight: 12,
		color: '#21212180'
	},
	pipeContainer: {
		alignItems: 'center'
	},
	completed: {
		backgroundColor: 'green',
	},
	canceled: {
		backgroundColor: 'red',
	},
	statusDot: {
		backgroundColor: '#00000020',
		width: 8,
		height: 8,
		borderRadius: 10,
		lineHeight: 0,
	},
	pipe: {
		backgroundColor: '#00000020',
		width: 2,
		height: 40,
		borderRadius: 2
	},
	statusDetail: {
		marginHorizontal: 10,
		fontSize: 14,
		lineHeight: 14,
		color: '#212121'
	},
	moreDetailsWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20
	},
	moreDetailsText: {
		color: SecondaryColor
	},
	statusBlockWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		margin: 10,
	},
	statusIcon: {
		color: SecondaryColor,
		fontSize: 22
	},
	moreDetailsInfoContainer: {
		marginVertical: 15
	},
	moreDetailsInfoWrapper: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		paddingVertical: 5
	},
	moreDetailsDateWrapper: {
		marginRight: 5,
		paddingRight: 5,
		borderRightWidth: 1,
		borderRightColor: '#ddd'
	},
	moreDetailsInfoText: {
		fontSize: 12,
		color: '#212121'
	},
	noDetailsMsg: {
		padding: 10,
		color: '#212121',
		fontSize: 13,
		textAlign: 'center'
	}
});
