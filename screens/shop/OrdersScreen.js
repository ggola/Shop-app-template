import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, View, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import * as orderActions from '../../store/actions/orders';

// Header Buttons
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Components
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/orderItem';

// Constants
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
   
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch();

    // Retrieve active orders from redux store
    const activeOrders = useSelector((state) => state.orders.orders);

    useEffect(() => {
        if (!isLoading && error) {
            Alert.alert('There was a problem fetching the orders', error, [{
                text: 'Try again',
                style: 'default',
                onPress: () => loadData()
            }]);
        }
    }, [isLoading, error]);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(orderActions.getOrders());
        } catch (err) {
            // This is the error rethrown in dispatch action
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    const deleteOrderHandler = (orderId) => {
        Alert.alert('Sure about deleting this order?', null,
            [{
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteOrder(orderId)
                },
                {
                    text: 'Keep',
                    style: 'cancel'
                }
            ]);
    };

    const deleteOrder = useCallback(async (orderId) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(orderActions.deleteOrder(orderId));
        } catch (err) {
            // This is the error rethrown in dispatch action
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        loadData();
    }, [dispatch, loadData]);

    // Set Listener to Navigation events to fetch the latest data when navigating via DRAWER navigation. In drawer navigation screens are kept in memory. In stack navigation they are destroyed and rebuilt so constantly refreshed.
    // This re-fetches the orders when this screen re-enters (can see the activity wheel)
    useEffect(() => {
        // this subscribes the screen as listener for navigation events, in particular when the event type is willFocus, i.e. the screen is about to show, and calls loadData when the screen is about to focus, then the listener is removed once its call to loadData is done. 
        const willFocusSub = props.navigation.addListener('willFocus', loadData)
        // return the clean up of subscription
        return () => {
            willFocusSub.remove();
        }
    }, [loadData]);

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
    
    if (!isLoading && activeOrders.length === 0) {
        return (
            <View style={styles.screenEmpty}>
                <Text style={styles.noOrderText}>There are no active orders</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <FlatList 
                contentContainerStyle={styles.listOrder}
                data={activeOrders}
                keyExtractor={(item) => item.id}
                renderItem={(itemData) => 
                    <OrderItem
                        id={itemData.item.id} 
                        amount={itemData.item.totalAmount.toFixed(2)}
                        date={itemData.item.readableDate}
                        orderItems={itemData.item.items}
                        onDeleteOrder={deleteOrderHandler.bind(this, itemData.item.id)}
                    />
                }
            />
        </View>
    );
};

OrdersScreen.navigationOptions = (navigationData) => {
    return {
        headerTitle: 'Active Orders',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Menu' 
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} 
                    onPress={() => {
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        )
    }
};

const styles = StyleSheet.create({
    screenEmpty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noOrderText: {
        fontSize: 16,
        fontFamily: 'open-sans-bold'
    },
    screen: {
        flex: 1,
        alignItems: 'center'
    },
    listOrder: {
        width: '90%',
        flexGrow: 1,
        paddingTop: 15
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;