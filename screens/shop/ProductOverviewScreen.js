import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, FlatList, Platform, ActivityIndicator, StyleSheet, Alert } from 'react-native';

// Redux
import { useSelector, useDispatch } from 'react-redux';
// Dispatch actions
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

// Header Buttons
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Components
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductOverviewScreen = props => {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    // Dispatch action
    const dispatch = useDispatch();

    // Retrieve products from the redux store
    const products = useSelector((state) => state.products.availableProducts);

    useEffect(() => {
        if (!isLoading && error) {
            Alert.alert('There was a problem fetching the products', error, [{
                text: 'Try again',
                style: 'default',
                onPress: () => loadData()
            }]);
        }
    }, [isLoading, error]);

    const loadData = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productActions.getProducts());
        } catch (err) {
            // This is the error rethrown in dispatch action
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        loadData().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadData]);

    // Set Listener to Navigation events to fetch the latest data when navigating via DRAWER navigation. In drawer navigation screens are kept in memory. In stack navigation they are destroyed and rebuilt so constantly refreshed.
    // This re-fetches the products when this screen re-enters (can see the activity wheel)
    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadDataNavListener)
        // return the clean up of subscription
        return () => {
            willFocusSub.remove();
        }
    }, [loadDataNavListener]);
    // Needed to avoid the refreshing auto-pull down when navigating back from the drawer
    const loadDataNavListener = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(productActions.getProducts());
        } catch (err) {
            // This is the error rethrown in dispatch action
            setError(err.message);
        }
        setIsLoading(false)
    }, [dispatch, setIsLoading, setError]);

    

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

    if (!isLoading && !isRefreshing && products.length === 0) {
         return (
            <View style={styles.centered}>
                <Text style={styles.text}>
                No products found... Add some!
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            onRefresh={loadData}
            refreshing={isRefreshing} 
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item.id}
            data={products}
            renderItem={(itemData) => 
                <ProductItem
                    isProductsOverview={true} 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onPressLeftButton={() => {props.navigation.navigate({
                        routeName: 'ProductDetails',
                        params: {
                            itemId: itemData.item.id,
                            itemTitle: itemData.item.title
                        }
                    })}}
                    onPressRightButton={() => dispatch(cartActions.addToCart(itemData.item))}
                />
            }
        />
    );
};

// Add navigation options
ProductOverviewScreen.navigationOptions = (navigationData) => {
    return {
        headerTitle: 'All Products',        
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Cart' 
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} 
                    onPress={() => {
                        navigationData.navigation.navigate({
                            routeName: 'Cart'
                        });
                    }}
                />
            </HeaderButtons>
        ),
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
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        fontFamily: 'open-sans-bold',
        color: Colors.text,
        marginBottom: 10
    },
    list: {
        flexGrow: 1
    }
});

export default ProductOverviewScreen;