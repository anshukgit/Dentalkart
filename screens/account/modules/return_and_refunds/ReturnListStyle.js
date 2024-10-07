import {StyleSheet} from 'react-native';

const ReturnStyle = StyleSheet.create({
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
    headerText:{
        fontWeight:'bold',
    },
    infoContainer:{
        marginTop:5
    },
    addressContainer:{
        flexDirection:'row'
    },
    shippingContainer:{
        marginTop:7
    },
    imageWrapper:{
        borderWidth: 1 ,
        width: 80,
        borderColor: '#efefef',
        height:80
    },
    image: {
        width:'100%'
    },
    itemSelectBox:{
        height:40,
        width:'100%',
        marginTop:5,
        elevation:1,
        shadowColor:'#bfbfbf',
        backgroundColor:'#fff',
        borderRadius:2,
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
    },
    textInput:{
        marginTop:7,
        height:40,
        borderWidth:1,
        borderRadius:2,
        borderColor:'#efefef',
        paddingLeft:4 ,
        width:'90%'
    },
    inputTextArea: {
        borderWidth: 1,
        borderColor: '#efefef',
        padding: 10,
        color: '#282828',
        textAlignVertical: 'top',
        fontSize: 16,
        height: 100
    },
    itemBoxContainer:{
        marginBottom:7
    },
    imageBox:{
        flexDirection:'row'
    },
    termContainer:{
        flex:1,
        margin:5,
        textAlignVertical:'center',
       fontSize:10,
       backgroundColor: '#fdf0d5',
       flexDirection:'row'
    },
    termText:{
        textAlignVertical:'center',
        fontSize:12
    },
    itemName:{
        fontWeight:'bold',
        marginLeft:5,
        fontSize:14

    },
    text: {
        color:"white",
        padding:5
    },
    button: {
       alignItems: 'center',
       backgroundColor: 'orange',
       padding: 4,
       margin:7,
       alignItems:'center',
       height:40,
   },
   itemListBottomContent:{
       marginTop:25

   },
   attachButtons: {
       padding: 5,
       flexDirection: 'row',
       alignItems: 'center',
   },
   attachText: {
       color: '#2b79ac',
       marginRight: 20

   },
   attachIconWrapper: {
       backgroundColor: '#fff',
       marginRight: 10
   },
   attachButtonCameraIcon: {
       fontSize: 20,
       color: '#2b79ac'
   },
   attachButtonFolderIcon: {
       fontSize: 20,
       color: '#2b79ac'
   },
   termCheck:{
       fontSize:5
   },
   contentContainer:{
       marginBottom:300
   },
   errorText:{
       color:'red',
       fontSize:12
   }

});
export default ReturnStyle;
