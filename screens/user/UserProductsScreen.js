import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Platform, Alert, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Redux
import { useSelector, useDispatch } from 'react-redux';
// Dispatch actions
import * as productActions from '../../store/actions/products';

// Header Buttons
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Components
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';

// Constants
import Colors from '../../constants/Colors';

const UserProductsScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    // Retrieve products from the redux store
    const products = useSelector((state) => state.products.userProducts);

    // Dispatch action: add to cart
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            Alert.alert('There was a problem deleting the product', error, [{
                text: 'Try again',
                style: 'default',
                onPress: () => setError(null)
            }]);
        }
    }, [error]);

    // Delete action
    const deleteProduct = useCallback(async (productId) => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(productActions.deleteProduct(productId));
        } catch (err) {
            // This is the error rethrown in dispatch action
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    // Delete Product Handler
    const deleteProductHandler = (productId) => {
        Alert.alert('Sure about deleting this product?', null, 
            [
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteProduct(productId)
                },
                {
                    text: 'Keep',
                    style: 'cancel'
                }
            ]);
    } 

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

    if (products.length === 0) {
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
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item.id}
            data={products}
            renderItem={(itemData) => 
                <ProductItem
                    isProductsOverview={false}
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onPressLeftButton={() => {props.navigation.navigate({
                        routeName: 'EditProduct',
                        params: {
                            itemId: itemData.item.id,
                            isAdd: false
                        }
                    })}}
                    onPressRightButton={deleteProductHandler.bind(this, itemData.item.id)}
                />
            }
        />
    );
};

// Add navigation options
UserProductsScreen.navigationOptions = (navigationData) => {
    return {
        headerTitle: 'Your Products',        
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Add' 
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'} 
                    onPress={() => {
                        navigationData.navigation.navigate({
                            routeName: 'EditProduct',
                            params: {
                                isAdd: true
                            }
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
}

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

export default UserProductsScreen;