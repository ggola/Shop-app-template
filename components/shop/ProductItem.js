import React from 'react';
import { Text, View, Image, Button, TouchableOpacity, TouchableNativeFeedback, Platform, StyleSheet } from 'react-native';

// Constants
import Colors from '../../constants/Colors';

let Touchable = TouchableOpacity;
if (Platform.OS === 'android' && Platform.Version >= 21) {
    Touchable = TouchableNativeFeedback
};

const ProductItem = props => {
    return (
        <View style={styles.touchable}>
            <Touchable
                activeOpacity={0.7}
                useForeground
                onPress={props.onPressLeftButton}>
                <View style={styles.product}>
                    <View style={styles.imageContainer}>
                        <Image 
                        style={styles.image}
                        source={{uri: props.image}}/>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.actions}>
                        <Button
                            title={props.isProductsOverview ? 'View Details' : 'Edit'} 
                            color={Colors.buttons}
                            onPress={props.onPressLeftButton}/>
                        <Button
                            title={props.isProductsOverview ? 'Add To Cart' : 'Delete'} 
                            color={Colors.buttons}
                            onPress={props.onPressRightButton}/>
                    </View>
                </View>
            </Touchable>
        </View>
    );
};

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    product: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 5,
        elevation: 5, 
        borderRadius: 10,
        backgroundColor: Colors.background,
        height: 300,
        margin: 20
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        alignItems: 'center',
        height: '15%',
        padding: 7
    },
    title: {
        fontSize: 18,
        marginTop: 4,
        color: Colors.text,
        fontFamily: 'open-sans-bold'
    },
    price: {
        fontSize: 14,
        color: Colors.text,
        marginTop: 4,
        fontFamily: 'open-sans'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
        paddingHorizontal: 20
    }
});

export default ProductItem;