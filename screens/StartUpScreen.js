import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';

import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

import Colors from '../constants/Colors';

const StartupScreen = props => {

    const dispatch = useDispatch();

    useEffect(() => {
        // cannot use async on useEffect. must create an aux function and call it right after
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');   
            // Can't find userdata: surely not logged, no token -> navigate to Auth
            if (!userData) {
                props.navigation.navigate('Auth');
                return;
            }
            // Take the JSON stored in AsyncStorage and turn it into a JS array or object
            const userDataTransformed = JSON.parse(userData);
            const { userId, token, expirationDate } = userDataTransformed;            
            // recreate date from date in ISO format
            const expiryDate = new Date(expirationDate);
            if (expiryDate <= new Date() || !token || !userId) {
                // Token expired (also if we can't find the token or the userId)
                props.navigation.navigate('Auth');
                return;
            } else {
                // Calculate expiration time based on expiryDate to pass to the authenticate action. This is in milliseconds.
                const expirationTime = expiryDate.getTime() - new Date().getTime();
                
                // Save userId and token to redux store and navigate to Shop
                
                dispatch(authActions.authenticate(
                    userId, 
                    token,
                    expirationTime
                ));
                props.navigation.navigate('Shop');
            }
        }
        tryLogin();
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator 
                size='large'
                color={Colors.primary}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;