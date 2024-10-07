import {StyleSheet} from 'react-native';
import {SecondaryColor, DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
    questionWrapper: {
        padding: 10
    },
    questionText: {
        color: SecondaryColor,
        fontSize: 15
    },
    solutionTextView: {
        backgroundColor: "#fff",
        width: DeviceWidth-20,
        paddingHorizontal: 10
    },
    solutionHelpfulWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 30
	},
	solutionHelpfulText: {
		color: '#28282880',
		fontSize: 13
	},
	solutionHelpfulYesWrapper: {
		marginRight: 10
	},
	solutionHelpfulYes: {
		color: '#39b54a',
		fontSize: 15,
		fontWeight: 'bold'
	},
	solutionHelpfulNo: {
		color: '#ff0000',
		fontSize: 15,
		fontWeight: '500'
	},
    contactWrapper: {
        marginBottom: 7
    },
    contactInfo: {
        textAlign: 'center',
        paddingHorizontal: 65,
        color: '#28282880',
        fontSize: 10
    },
    contactInfoButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },
    contactInfoButton: {
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderColor: SecondaryColor,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 15
    },
    contactInfoButtonIcon: {
        color: SecondaryColor,
        fontSize: 17,
        marginRight: 4
    },
    contactInfoButtonText: {
        color: SecondaryColor,
        fontSize: 15
    },
});
