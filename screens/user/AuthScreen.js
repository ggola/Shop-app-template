import React, { useReducer, useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Button, ActivityIndicator, Alert } from 'react-native';

// Redux
import { useDispatch } from 'react-redux';
// Dispatch actions
import * as authActions from '../../store/actions/auth';

// Colors gradient
import { LinearGradient } from 'expo-linear-gradient';

// Components
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

// Constants
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        // Update values and validities
        //console.log(action.value);
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        // Manage form validity
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            // UpdatedValidity is an object key:value pair
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        // Return new state with updated values
        return {
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        };
    } else {
        return state;
    }
};

const AuthScreen = props => {

    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();

    // Set the initial combined state
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    })

    // Auth handler
    const authHandler = useCallback(async () => {
        if (formState.formIsValid) {
            setIsLoading(true);
            try {
                await dispatch(isSignup ? 
                    authActions.signup(formState.inputValues.email, formState.inputValues.password) 
                    : authActions.login(formState.inputValues.email, formState.inputValues.password));
                props.navigation.navigate('Shop');
            } catch (err) {
                setError(err.message)
                setIsLoading(false);
            }
        } else {
            Alert.alert('Please check form fields are correctly filled', null, [{
                text: 'Got it',
                style: 'default'
            }]);
        }
    }, [dispatch, setIsLoading, setError, formState]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {        
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert('There was a problem signing you up', error, [{
                text: 'Try again',
                style: 'default',
                onPress: () => setError(null)
            }]);
        }
    }, [error]);

    return (
        <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={50}
            style={styles.screen}>
            <LinearGradient
                colors={[Colors.accent, Colors.background]}
                style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input 
                            id='email'
                            label='E-mail'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalized='none'
                            initiallyValid={true}
                            errorText='Please enter a valid email address'
                            onInputChange={inputChangeHandler}
                            initialValue=""/>  
                        <Input 
                            id='password'
                            label={isSignup ? 'Password (min 8 chars)' : 'Password'}
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={8}
                            autoCapitalized='none'
                            initiallyValid={true}
                            errorText='Please enter a valid password'
                            onInputChange={inputChangeHandler}
                            initialValue=""/> 
                            <View style={styles.buttonContainer}>
                                {isLoading ? 
                                <View style={styles.centered}>
                                    <ActivityIndicator 
                                        size='small'
                                        color={Colors.accent}
                                    />
                                </View>
                                :
                                <View style={styles.button}>
                                    <Button
                                        color={Colors.buttons}
                                        title={isSignup ? 'Sign Up' : 'Login'}
                                        onPress={authHandler}/>
                                </View>
                                }
                            <View style={styles.button}>
                                <Button
                                    disabled={isLoading ? true : false}
                                    color={Colors.primary} 
                                    title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                    onPress={() => {
                                        setIsSignup(prevState => !prevState);
                                    }}/>
                            </View>                          
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100
    },
    button: {
        marginVertical: 5,
        width: '70%'
    }
});

export default AuthScreen;