import {StyleSheet} from 'react-native';
import {SecondaryColor, DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		marginBottom: 10,
	},
	reviewHeader: {
		padding: 10,
		fontSize: 15,
		color: '#212121'
	},
	dataAnalysisWrapper: {
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#ddd'
	},
	ratingContainer: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	totalRatingWrapper: {
		flexDirection: 'row',
		width: DeviceWidth/2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	rightBorder: {
		borderRightWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRightColor: '#ddd'
	},
	reviewCount: {
		fontSize: 38,
		color: '#212121'
	},
	reviewCountText: {
		fontSize: 12,
		color: '#21212180'
	},
	ratingsDataContainer: {
		paddingLeft: 30
	},
	ratingsWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	ratingText: {
		fontSize: 12
	},
	ratingIcon: {
		paddingRight: 5
	},
	ratingProgress: {
		width: 80
	},
	addReviewButton: {
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 1,
		shadowColor: '#bfbfbf',
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
	    borderRadius: 3,
	    width: DeviceWidth-20,
	    marginLeft: 10,
	    marginBottom: 10,
	    backgroundColor: '#fff'
	},
	addReviewText: {
		padding: 10,
		fontSize: 13
	},
	reviewContainer: {
		padding: 10,
		borderTopWidth: .5,
		borderBottomWidth: .5,
		borderColor: '#efefef'
	},
	reviewHeadingWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 5
	},
	reviewHeading: {
		fontSize: 13,
		fontWeight: 'bold',
		paddingLeft: 10,
		color: '#212121'
	},
	reviewRatingWrapper: {
		flexDirection: 'row',
		backgroundColor: '#1abf46',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
		paddingLeft: 3,
		paddingRight: 3
	},
	reviewRating: {
		color: '#fff',
		marginRight: 2,
		fontSize: 12
	},
	reviewText: {
		fontSize: 13,
		color: '#212121',
		paddingVertical: 5
	},
	reviewCustomer: {
		fontSize: 12,
		color: '#21212180'
	},
	reviewFieldsWrapper: {
		padding: 10
	},
	submitReviewButton: {
		borderColor: SecondaryColor,
		borderWidth: 1,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 3,
		alignItems: 'center',
	},
	submitReviewButtonText: {
		color: SecondaryColor
	}
});
