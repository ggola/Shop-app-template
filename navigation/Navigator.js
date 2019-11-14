import React from 'react';
import { Platform, SafeAreaView, Button, View } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';

// Redux
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

// Constants
import Colors from '../constants/Colors';

// Screens
import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartUpScreen';

// Default Navigation Options
const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ? Colors.text : Colors.primary
};

// Product Stack Navigator
const ShopStackNavigator = createStackNavigator({
    ProductsOverview: ProductOverviewScreen,
    ProductDetails: ProductDetailsScreen,
    Cart: CartScreen
}, {
    defaultNavigationOptions: defaultNavOptions
});

// Orders Stack Navigator
const OrdersStackNavigator = createStackNavigator({
    OrdersOverview: OrdersScreen
}, {
    defaultNavigationOptions: defaultNavOptions
});

// User Stack Navigator
const UserStackNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    defaultNavigationOptions: defaultNavOptions
});

// Auth Stack Navigator
const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

// Shop Drawer Navigator
const ShopNavigator = createDrawerNavigator({
    Shop: {
        screen: ShopStackNavigator,
        navigationOptions: {
            drawerLabel: 'Shop',
            drawerIcon: drawerConfig => <Ionicons 
                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size={23}
                color={drawerConfig.tintColor}/>
        }
    },
    Orders: {
        screen: OrdersStackNavigator,
        navigationOptions: {
            drawerLabel: 'Orders',
            drawerIcon: drawerConfig => <Ionicons 
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size={23}
                color={drawerConfig.tintColor}/>
        }
    },
    ManageProducts: {
        screen: UserStackNavigator,
        navigationOptions: {
            drawerLabel: 'Manage Products',
            drawerIcon: drawerConfig => <Ionicons 
                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size={23}
                color={drawerConfig.tintColor}/>
        }
    }
}, {
    contentOptions: {
        activeTintColor: Colors.buttons,
        labelStyle: {
            fontFamily: 'open-sans-bold',
            fontSize: 15
        }
    },
    // Add custom buttom
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerItems {...props}/>
                    <Button 
                        title='Logout'
                        color={Colors.buttons}
                        onPress={() => {
                            dispatch(authActions.logout());
                            props.navigation.navigate('Auth');
                        }}
                    />
                </SafeAreaView>
            </View>
        ); 
    }
});

// App Main Navigator 
const MainNavigator = createSwitchNavigator({
    Start: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);