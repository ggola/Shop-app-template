import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Text, TextInput, View, Platform, ScrollView, StyleSheet, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';

// Redux
import { useSelector, useDispatch } from 'react-redux';
// Dispatch actions
import * as productActions from '../../store/actions/products';

// Header Buttons
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Components
import HeaderButton from '../../components/UI/HeaderButton';

// Constants
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'
// Construct the state reducer: this gets called by dispatchFormState
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        // Update values and validities
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

const EditProductScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [showWarning, setShowWarning] = useState(false);
    // Create dispatch
    const dispatch = useDispatch();

    // Check if product is being added or edited
    const isAdd = props.navigation.getParam('isAdd');
    let productId;
    let ownerId;
    let selectedProduct;
    if (!isAdd) {
        // Edit product
        productId = props.navigation.getParam('itemId');
        selectedProduct = useSelector((state) => state.products.userProducts.find(prod => prod.id === productId));
        ownerId = selectedProduct.ownerId;
    };
    
    // Set the initial combined state
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            titleValue: isAdd ? null : selectedProduct.title,
            priceValue: isAdd ? null : selectedProduct.price.toString(),
            descriptionValue: isAdd ? null : selectedProduct.description,
            imageValue: isAdd ? null : selectedProduct.imageUrl
        },
        inputValidities: {
            titleValue: isAdd ? false : true,
            priceValue: isAdd ? false : true,
            descriptionValue: isAdd ? false : true,
            imageValue: isAdd ? false : true
        },
        formIsValid: isAdd ? false : true
    })

    // Use one single input handler to check input validity and dispatch the action to update the state (formReducer)
    const textInputHandler = (inputIdentifier, inputText) => {
        setShowWarning(false);
        // Check for every input that length is > 0
        let isValid = false;
        if (inputText.trim().length > 0) {
            isValid = true;
        }
        // Extra validation for price: only 0-9 and . allowed, format max 6 digits before . and max 2 after dot (######.##). Max price allowed: 999999.99 
        if (inputIdentifier === 'priceValue' && isAdd) {
            const validatedText = inputText.replace(/[^0-9 .]/g, '');
            const validPrice = validatedText.match(/^\d{0,6}(\.\d{0,2}){0,1}/g);
            inputText = validPrice[0];
        }
        // dispatchFormState calls the function formReducer and passes the object action with the following parameters
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputText,
            isValid: isValid,
            input: inputIdentifier
        })
    };

    useEffect(() => {
        if (error) {
            Alert.alert('There was a problem saving the product', error, [{
                text: 'Try again',
                style: 'default',
                onPress: () => setError(null)
            }]);
        }
    }, [error]);

    // Action handler
    const saveProductHandler = useCallback(async () => {
        Keyboard.dismiss();
        setIsLoading(true);    
        // Check formState and eventually dispatch actions
        if (formState.formIsValid) {
            // Dispatch add/edit
            try {
                if (isAdd) {
                    await dispatch(productActions.addProduct(
                        formState.inputValues.titleValue,
                        formState.inputValues.imageValue,
                        formState.inputValues.descriptionValue,
                        parseFloat(formState.inputValues.priceValue)
                    ));
                } else {
                    await dispatch(productActions.editProduct(
                        productId,
                        ownerId,
                        formState.inputValues.titleValue,
                        formState.inputValues.imageValue,
                        formState.inputValues.descriptionValue,
                        parseFloat(formState.inputValues.priceValue)
                    ));
                }
                props.navigation.goBack();
            } catch (err) {
                setError(err.message);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setShowWarning(true);
        }
    }, [dispatch, formState, setError, setIsLoading]);

    // Pass handler pointer to header
    useEffect(() => {
        props.navigation.setParams({
            saveProductHandler: saveProductHandler
        });
    }, [saveProductHandler]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator 
                    size='large'
                    color={Colors.accent}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <KeyboardAvoidingView 
                style={{flex: 1}}
                behavior='padding' 
                keyboardVerticalOffset={50}>
                <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}>
                    <View style={styles.largeView}>
                        <View style={styles.mainView}>
                            <View style={styles.container}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>Title</Text>
                                </View>
                                <TextInput 
                                    style={styles.textInput}
                                    autoCapitalize='sentences'
                                    autoCorrect={false}
                                    returnKeyType='next'
                                    on
                                    onChangeText={textInputHandler.bind(this, 'titleValue')}
                                    value={formState.inputValues.titleValue}
                                />
                            </View>
                            <View style={styles.container}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>Price ($)</Text>
                                </View>
                                <TextInput 
                                    style={{...styles.textInput, color: isAdd ? Colors.text : 'grey'}}
                                    editable={isAdd ? true : false}
                                    blurOnSubmit
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    keyboardType='decimal-pad'
                                    returnKeyType='next'
                                    onChangeText={textInputHandler.bind(this, 'priceValue')}
                                    value={formState.inputValues.priceValue}
                                />
                            </View>
                            <View style={styles.container}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>Description</Text>
                                </View>
                                <TextInput 
                                    style={styles.textInput}
                                    numberOfLines={10}
                                    autoCapitalize='sentences'
                                    autoCorrect={false}
                                    returnKeyType='next'
                                    onChangeText={textInputHandler.bind(this, 'descriptionValue')}
                                    value={formState.inputValues.descriptionValue}
                                />
                            </View>
                            <View style={styles.container}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>Image URL</Text>
                                </View>
                                <TextInput 
                                    style={styles.textInput}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    returnKeyType='done'
                                    onChangeText={textInputHandler.bind(this, 'imageValue')}
                                    value={formState.inputValues.imageValue}
                                />
                            </View>
                        </View>
                        {showWarning && 
                            <View style={styles.warningContainer}>
                                <Text style={styles.warningText}>Please fill all fields</Text>
                            </View>
                        }
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

// Add navigation options
EditProductScreen.navigationOptions = (navigationData) => {
    const isAdd = navigationData.navigation.getParam('isAdd');
    const saveProductHandler = navigationData.navigation.getParam('saveProductHandler');
    return {
        headerTitle: isAdd ? 'Add Product' : 'Edit Product',        
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Save' 
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'} 
                    onPress={() => {
                        saveProductHandler();
                    }}
                />
            </HeaderButtons>
        )
    };
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    mainView: {
        width: '100%',
        marginTop: 15
    },
    largeView: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        margin: 15
    },
    textContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    text: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: Colors.accent
    },
    textInput: {
        fontFamily: 'open-sans',
        fontSize: 15,
        height: 40,
        width: '100%',
        borderBottomColor: '#aaa',
        borderBottomWidth: 1,
        color: Colors.text
    },
    warningContainer: {
        marginVertical: 15,
        backgroundColor: 'red',
        width: '95%',
        height: 33,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    warningText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: 'white'
    },
    centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
    }
});

export default EditProductScreen;