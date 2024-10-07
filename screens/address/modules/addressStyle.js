import { StyleSheet } from 'react-native';
import { PrimaryColor, SecondaryColor } from '@config/environment';

export const MyAddress = StyleSheet.create({
	cardWrapper: {
		backgroundColor: '#fff',
        padding: 5,
        borderRadius: 3,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 8,
        marginLeft: 8,
        elevation: 2,
		shadowColor: '#bfbfbf',
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
	},
	addNewAddressWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		paddingVertical: 3,
		alignItems: 'center',
		borderRadius: 0,
		paddingHorizontal:22
	},
	addNewAddressText: {
		fontSize: 13,
		color: SecondaryColor,
		padding: 8
	},
	addressCountWrapper: {
		paddingLeft: 22,
		paddingVertical: 10,
		marginVertical: 5,
		backgroundColor: '#efefef80',
		
	},
	addressCountText: {
		fontSize: 11,
	},
	nameWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	userName: {
		fontSize: 17,
		fontWeight: 'bold',
		color: '#212121'
	},
	defaultWrapper: {
		backgroundColor: '#00a324',
		borderRadius: 4,
		paddingVertical: 3,
		paddingHorizontal: 5
	},
	default: {
		fontSize: 11,
		color: '#fff',
		textAlign:'center'
	},
	userAddress:{
		fontSize: 13,
		color: '#212121'
	},
	userOperations:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 10,
		marginBottom: 10,
	},
	userOperationWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userOperationName: {
		marginLeft: 2,
		fontSize: 13,
		color: '#21212180'
	},
	buttonWrapper: {
		justifyContent: 'center',
		backgroundColor: PrimaryColor,
		alignItems: 'center',
		borderRadius: 3
	},
	buttonText: {
		color: '#fff',
		padding: 5,
		fontSize: 16
	},
	shadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height:Platform.OS=='android'?3: 1.5,
        },
        shadowOpacity: 0.35,
        shadowRadius: 2,
        elevation:Platform.OS=='android'? 3:1,
      },
	addressIconsubView: { width: 20, height: 20, borderRadius: 20, backgroundColor: colors.PattensBlue, justifyContent: 'center', alignItems: 'center' },
	locationIcon:{ fontSize: 12, color: '#365F71' },
	addressBoxMainView:{ width: '100%', minHeight: 90, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 10, borderBottomWidth: 5,  borderBottomColor: colors.HexColor },
	locationIconMainView:{ width: '10%',marginTop:5 },
	addressBox:{ width: '90%', },
	firstnamemainView:{ flexDirection: 'row', height: 25, alignItems:'center' },
	firstnameView:{ width: '80%', },
	DefaultView:{ width: '20%', },
	editbtnView:{ width: 30, height: 30, borderRadius: 4, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
	editbtn:{ fontSize: 20, color: '#21212180' },
	editbtnMainView:{ width: '40%',flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end',position:'absolute',right:0,bottom:0 },
	deleteBtn:{ fontSize: 20, color: '#21212180' },
	plusBtn:{ fontSize: 15, color: '#2b79ac' },
});
