import {StyleSheet} from 'react-native';
import {SecondaryColor} from '@config/environment';

const detailWrapper = {
    paddingLeft: 10,
    paddingRight: 10
}
const heading = {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#212121'
}

export default styles = StyleSheet.create({
    wrapper: {
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#f2f2f2'
    },
    cardWrapper: {
        backgroundColor: '#ffffff',
		elevation: 1,
        shadowColor: '#bfbfbf',
		shadowOffset: {
	      height: 1,
		  width: 1
	    },
		shadowOpacity: 1,
		shadowRadius: 5,
        marginBottom: 10,
        borderRadius: 3,
        paddingBottom: 5
    },
    cardHeadingWrapper: {
        margin: 5,
        borderColor: '#ddd',
        borderBottomWidth: 1
    },
    cardHeading: {
        fontSize: 15,
        color: '#212121',
        marginBottom: 2
    },
    cardBody: {
        fontSize: 13,
        color: '#212121'
    },
    addressWrapper: {
        ...detailWrapper
    },
    addressHeading: {
        ...heading
    },
    contactWrapper: {
        ...detailWrapper
    },
    contactSupportTitleIcon: {
        marginRight: 10,
        marginLeft: 5
    },
    titleValueWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: SecondaryColor,
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginBottom: 10
    },
    contactSupportValue: {
        fontSize: 16
    }
});
