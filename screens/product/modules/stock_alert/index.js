import React, { Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import tokenClass from '@helpers/token';
import Toast from 'react-native-simple-toast';
import {Mutation} from "react-apollo";
import {SUBSCRIBE_FOR_STOCK_ALERT} from '../../graphql';
import styles from './stock_alert_text.style';

class SubscribeForStockAlert extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loginStatus: false,
            productId:props.productId
        }
    }

    ProceedPostSubscribeAlert = (cache, {data}) => {
        Toast.showWithGravity('Subscribed successfully', Toast.LONG, Toast.BOTTOM)
    }

    async componentWillMount() {
      let loginStatus = await tokenClass.loginStatus();
      this.setState({loginStatus});
    }
    render(){
        return(
            <View>
                {this.state.loginStatus ?
                    <Mutation
                        mutation={SUBSCRIBE_FOR_STOCK_ALERT}
                        onError={(error)=> Toast.showWithGravity(`${error.message}`, Toast.LONG, Toast.BOTTOM)}
                        update={this.ProceedPostSubscribeAlert}
                        variables={{productid: this.state.productId}}
                    >
                        {(subscribeforstockalert, {data, loading, error}) =>{
                            if (loading) return <Text allowFontScaling={false} style={{color: "blue", padding:7}}>Subscribing...</Text>
                            return <TouchableOpacity onPress={()=>{subscribeforstockalert()}}><Text allowFontScaling={false} style={styles.alertText}>Click here to get notified when the product is back in stock.</Text></TouchableOpacity>
                        }}
                    </Mutation>:
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Text allowFontScaling={false} style={styles.alertText}>
                             Click here to get notified when the product is back in stock.
                        </Text>
                    </TouchableOpacity>
                 }
            </View>
        )

    }
}

export default SubscribeForStockAlert;
