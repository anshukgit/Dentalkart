import {StyleSheet, Platform} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';

export default styles = StyleSheet.create({
    BrandWrapper: {
        backgroundColor: '#fff',
        padding: 1,
        borderRadius: 3,
        marginTop: 5,
        marginBottom: 5,
        elevation: 1,
        shadowColor: '#bfbfbf',
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
        marginTop:20,
        padding:7

    },
    brandListTopWrapper:{
        paddingBottom:7
    },
    brandTopText:{
        fontWeight:'bold',
        marginBottom:7
    },
    inputStyle:{
        borderColor:'#f3943d',
        borderRadius:4,
        borderWidth:1.5,
        paddingLeft: 5,
        height:45,
        backgroundColor:'#fff'
    },
    allListWarpper:{
        backgroundColor:'#fff',
        paddingLeft:10,
        paddingTop:10
    },
    KeyWrapper:{
        width:30,
        height:30,
        borderRadius:50/2,
        backgroundColor:'#bbb',
        marginRight: 5
    },
    keyText:{
        textAlign:'center',
        color:'#fff',
        fontWeight:'bold',
        paddingTop:3
    },
    brandContainer:{
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    brandImageWrapper:{
        width:'33.33%',
        margin:'auto',
        marginBottom:7,
        justifyContent: 'center',
        alignItems: 'center',
        padding:7,
        resizeMode: 'contain'
    },
    brandImageBox:{
        width: '100%',
        flex:1,
        shadowColor: '#bfbfbf',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: .5,
        shadowRadius: 2,
        padding:5,
        borderColor:'#f0f0f0',
        elevation: 0.8,
    },
    brandImage:{
        width:60,
        height:40,
        resizeMode: 'cover'
    },
    brandText:{
        fontWeight:'bold',
        marginTop:4,
        textAlign:'center',
    }

})
