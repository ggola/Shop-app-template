import React from 'react';
import { Text, View, Button, Image, ScrollView, StyleSheet, Platform } from 'react-native';

// Redux
import { useSelector, useDispatch } from 'react-redux';
// Dispatch actions
import * as cartActions from '../../store/actions/cart';

// Header Buttons
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Components
import HeaderButton from '../../components/UI/HeaderButton';

// Constants
import Colors from '../../constants/Colors';

const ProductDetailsScreen = props => {

    // Extract item from redux store
    const itemId = props.navigation.getParam('itemId');
    const selectedProduct = useSelector((state) => state.products.availableProducts.find(item => item.id === itemId));

    // Dispatch action
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image 
                style={styles.image}
                source={{uri: selectedProduct.imageUrl}}
            />
            <View style={styles.buttonContainer}>
                <Button
                    color={Colors.buttons}
                    title='Add to Cart'
                    onPress={() => dispatch(cartActions.addToCart(selectedProduct))}
                />
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{selectedProduct.description}</Text>
            </View>
        </ScrollView>
    );
};

// Set header dynamically
ProductDetailsScreen.navigationOptions = (navigationData) => {
    // Get param
    const currentItemTitle = navigationData.navigation.getParam('itemTitle');

    return {
        headerTitle: currentItemTitle,
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
        )
    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    image: {
        width: '100%',
        height: 300
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 10,
        alignItems: 'center'
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginVertical: 10,
        textAlign: 'center',
        fontFamily: 'open-sans'
    },
    descriptionContainer: {
        backgroundColor: Colors.background,
        borderRadius: 10,
        marginTop: 15,
        marginHorizontal: 20
    },
    description: {
        fontSize: 15,
        color: Colors.text,
        marginVertical: 10,
        paddingHorizontal: 15,
        fontFamily: 'open-sans'
    }
});

export default ProductDetailsScreen;