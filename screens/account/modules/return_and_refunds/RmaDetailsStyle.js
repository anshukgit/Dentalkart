import {StyleSheet} from 'react-native';

const RmaDetails =StyleSheet.create({
    keyboardAvoid:{
        marginBottom:300
    },
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
        overflow:'hidden'
	},
    rightSection:{
        marginLeft:5

    },
    contentContainer:{
        flexDirection:'row',
        paddingLeft:5

    },
    valueHeader:{
        fontWeight:'bold',

    },
    valueText:{
        paddingLeft:2,

    },
    input: {
        paddingRight: 10,
        lineHeight: 23,
        flex: 2,
        textAlignVertical: 'top'
   },
   itemName:{
      fontWeight:'bold',
      paddingLeft:4,
      width:'80%'
   },
   textfield: {
       paddingLeft:5,
       paddingRight:5,
       lineHeight:23,
       borderColor:'gray',
       borderWidth:1,
       margin:5,
       textAlignVertical:'top'
   },
   imageWrapper:{
       width: '20%',
        marginRight:12,
   },
   image: {
       borderWidth: 1 ,
       borderColor: '#efefef',
       width: 80,
       height: 80,
   },
   attachmentText:{
       flexDirection:'row',
       marginBottom:5
   },
   inputTextArea: {
       borderWidth: 1,
       borderColor: '#dddd',
       padding: 10,
       color: '#282828',
       margin: 5,
       textAlignVertical: 'top',
       fontSize: 16,
       height: 150
   },
  customerContainer:{
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
       width: '70%',
       marginLeft:'auto',
       backgroundColor:'#f0f8ff',
       padding:5

   },
   executiveContainer:{
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
       width: '70%',
       backgroundColor:'#fffbf6',
       padding:5

   },
   commentHistoryText:{
     marginLeft:8,
     fontWeight:'bold'
   },
   commentBottomText:{
       flexDirection:'row'
   },
   createdText:{
       fontSize: 10,
       padding: 8,
       color: '#b3abab'
   },
   commentText :{
      fontSize: 12,
       padding: 7

   },
   attachmentsText:{
       color:'blue',
       fontSize:12,
       textAlignVertical:'center',
       textDecorationLine:'underline',
       paddingLeft:2,
   },
   text: {
       color:"white",
       padding:5
   },
   button: {
      backgroundColor: 'orange',
      padding: 4,
      margin:7,
      alignItems:'center',
      height:40,
  },
  attachButtons: {
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
  },
  attachText: {
      color: '#2b79ac',
      marginRight: 20,
      fontSize:12
  },
  attachIconWrapper: {
      backgroundColor: '#fff',
      marginRight: 10
  },
  attachButtonCameraIcon: {
      fontSize: 15,
      color: '#2b79ac'
  },
  attachButtonFolderIcon: {
      fontSize: 15,
      color: '#2b79ac'
  }


});

export default RmaDetails;
