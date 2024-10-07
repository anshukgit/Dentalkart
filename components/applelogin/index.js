import React, { Component } from 'react';
import appleAuth, {
    AppleButton,
} from '@invertase/react-native-apple-authentication'
import { StyleSheet, View } from 'react-native';
import {showErrorMessage} from '@helpers/show_messages';

class AppleLogin extends Component {
    onAppleButtonPress = async () => {
        try {
            // make sign in request and return a response object containing authentication data
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [
                    appleAuth.Scope.EMAIL,
                    appleAuth.Scope.FULL_NAME
                ],
            });

            console.log(appleAuthRequestResponse);

            // retrieve identityToken from sign in request
            const {
                identityToken,
            } = appleAuthRequestResponse;

            // identityToken generated
            if (identityToken) {

                // send data to server for verification and sign in
                let userInfo = {
                    idToken: identityToken
                }
                this.props.getUserData(userInfo);
                
            } else {
                // no token, failed sign in
                showErrorMessage('Authentication Failed!');
            }

        } catch (error) {
            console.log(error);
            showErrorMessage(error.message);
        }
    }

    
    render() {
        return (
            <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.DEFAULT}
                style={styles.appleButton}
                onPress={() => this.onAppleButtonPress()}
            />
        );
    }
}

const styles = StyleSheet.create({
    appleButton: {
        width: '40%',
        height: 35,
        borderWidth: 1,
        borderColor: '#efefef',
    }
});

export default AppleLogin;
