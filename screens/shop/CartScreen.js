import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, View, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';

// Redux
import { useSelector, useDispatch } from 'react-redux';
// Dispatch actions
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/orders';

// Components
import CartItem from '../../components/user/cartItem';

// Constants
import Colors from '../../constants/Colors';

const CartScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    // Retrieve cartItems and totalAmount from the redux store
    //NOTE: useSelector re-runs every time the redux state changes
    const cartItems = useSelector((state) => {
        const cartItemsArray = [];
        for (const key in state.cart.items) {
            cartItemsArray.push({
                productId: key,
                quantity: state.cart.items[key].quantity,
                productImage: state.cart.items[key].productImage,
                productPrice: state.cart.items[key].productPrice,
                productTitle: state.cart.items[key].productTitle,
                sum: state.cart.items[key].sum
            })
        }
        return cartItemsArray.sort((a, b) => a.productId > b.productId ? 1 : -1);
    })
    let totalAmount = useSelector((state) => state.cart.totalAmount);
    if (cartItems.length === 0) {
        totalAmount = 0;
    }

    // Dispatch actions
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            Alert.alert('There was a problem saving the order', error, [{
                text: 'Try again',
                style: 'default',
                onPress: () => setError(null)
            }]);
        }
    }, [error]);

    const date = new Date();
    // Add to order handler
    const addToOrdersHandler = useCallback(async () => {
        setIsLoading(true);
        try {
            await dispatch(orderActions.addToOrders(
                cartItems,
                totalAmount,
                date.toString()
            ));
            dispatch(cartActions.cleanCart());
            Alert.alert('Order submitted!', null,
                [{
                        text: 'View Orders',
                        style: 'default',
                        onPress: () => props.navigation.navigate('Orders')
                    },
                    {
                        text: 'Back to Shop',
                        style: 'default',
                        onPress: () => props.navigation.goBack()
                    }
                ]);
            //props.navigation.navigate('Orders');
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, cartItems, totalAmount, date, setError, setIsLoading]);



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
        <View style={styles.outerContainer}>
            <View style={styles.amountContainer}>
                <Text style={styles.total}>Total: <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text></Text>
                <Button 
                    title='Order Now'
                    disabled={cartItems.length === 0 ? true : false}
                    color={Colors.buttons}
                    onPress={() => addToOrdersHandler()}
                />
            </View>
            <FlatList 
                contentContainerStyle={styles.list}
                data={cartItems}
                keyExtractor={(item) => item.productId}
                renderItem={(itemData) => 
                    <CartItem 
                        image={itemData.item.productImage}
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        sum={itemData.item.sum}
                        useButton={true}
                        onRemove={() => dispatch(cartActions.removeFromCart(itemData.item.productId))}
                    />
                }
            />
        </View>
    );
};

// Add navigation options
CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1
    },
    list: {
        flexGrow: 0.8,
        alignItems: 'center'
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 50,
        paddingHorizontal: 20,
        marginVertical: 20
    },
    total: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: Colors.text
    },
    amount: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: Colors.accent
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CartScreen;