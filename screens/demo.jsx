// src/components/OpenAppOrBrowser.js
import React from 'react';
import { Button, Linking, Alert } from 'react-native';
import AppLink from 'react-native-app-link';

const demo = ({ productUrl }) => {
    const appScheme = 'dailymasala';
    const appName = 'dailymasala';


    const openApp = () => {
        AppLink.maybeOpenURL(productUrl, {
            appName,
            appScheme,
        })
            .then(() => {
                // App opened successfully
                console.log('App opened successfully');
            })
            .catch(() => {
                // Open URL in the browser if the app is not installed
                Linking.openURL(productUrl)
                    .catch(err => {
                        Alert.alert('Error', 'Unable to open the link.');
                    });
            });
    };

    return (
        <Button
            title={`Open Product`}
            onPress={openApp}
        />
    );
};

export default demo;
