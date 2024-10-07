import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
	drawerWrapper: {
		backgroundColor: '#fff',
		flex: 1,
		elevation: 3
	},
	detailsWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 15
	},
	sliderImage: {
		width: 50,
		height: 50,
		borderRadius: 5,
		marginRight: 10
	},
	userName: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 16
	},
	email: {
		color: '#000',
		fontSize: 13
	},
	drawerList: {
		paddingVertical: 3,
		paddingLeft: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between', paddingHorizontal: 15
	},
	sliderListName: {
		fontSize: 15,
		marginLeft: 20,
		color: '#5c5c5c',
	},
	sliderIcon: {
		color: '#5c5c5c'
	},
	flagImage: {
		width: 20,
		height: 20,
		marginLeft: 10
	},
	version: {
		marginTop: 10,
		textAlign: 'center',
		color: '#212121',
		fontSize: 13
	},
	listarrMappingMainView:{ width: '100%', height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listarrMappingIconView:{ width: 35, height: 35, borderRadius: 2, backgroundColor: '#F1FCFF', justifyContent: 'center', alignItems: 'center' },
  listarrMappingName:{ fontSize: 16, left: 20, color: colors.normalText, },
  userIconMainView:{ flex: 0.15, width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  userIconView:{ width: 70, height: 70, borderWidth: 0.5, borderColor: '#c3c3c3', borderRadius: 70 / 2, marginRight: 8 },
  userIcon:{ width: '100%', height: '100%', borderRadius: 40 },
  userName:{ fontSize: 15, color: '#223263', height: 25, fontWeight: '800' },
  userEmail:{ fontSize: 12, color: '#9098B1', height: 25, },
  listarrView:{ flex: .85, width: '100%', paddingHorizontal: 20, paddingBottom: 10 },
  logoutBtnView:{
    height: 38, width: 105, borderRadius: 3, marginTop: 30,
    backgroundColor: colors.blueColor, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center',marginHorizontal:30
  },
  logoutIcon:{ width: 20, height: 20, marginRight: 10 },
  logoutTxt:{ color: colors.white, fontSize: 15, fontWeight: '800' },
  listarrMappingIconSize:{ fontSize: 20, color: colors.blueColor },
  listarrMappingImgSize:{ width: '60%', height: '60%' },
  listarrMappingView:{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5, alignItems: 'center' },
  menuRightIcon:{ fontSize: 25, color: '#9098B1' },
});
