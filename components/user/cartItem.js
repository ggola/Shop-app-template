import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Constants
import Colors from '../../constants/Colors';

const CartItem = props => {
    return (     
        <View style={styles.product}>
            <View style={styles.productInfo}>
                <View style={styles.imageContainer}>
                    <Image 
                    style={styles.image}
                    source={{uri: props.image}}/>
                </View>
                <View style={{...styles.detailsContainer, width: props.useButton ? '45%' : '60%'}}>
                    <Text style={styles.quantity}>{props.quantity} </Text>
                    <Text style={styles.title} numberOfLines={2}>{props.title}</Text>
                </View>
                <View style={styles.sumContainer}>
                    <Text style={styles.sum}>${props.sum.toFixed(2)}</Text>
                </View>
                {props.useButton &&
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity>
                            <Ionicons 
                                name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                                size={23}
                                color='red'
                                onPress={props.onRemove}
                            />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    product: {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 3,
        elevation: 3, 
        borderRadius: 10,
        backgroundColor: Colors.background,
        height: 54,
        margin: 10,
        paddingHorizontal: 3,
        width: '90%'
    },
    productInfo: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    imageContainer: {
        flexDirection: 'row',
        width: '15%',
        height: '90%',
        overflow: 'hidden'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8
    },
    detailsContainer: {
        flexDirection: 'row',
        width: '45%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    quantity: {
        fontSize: 16,
        color: Colors.text,
        fontFamily: 'open-sans-bold'
    },
    title: {
        fontSize: 16,
        color: Colors.text,
        fontFamily: 'open-sans'
    },
    sumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
        height: '100%'
    },
    sum: {
        fontSize: 16,
        color: Colors.text,
        fontFamily: 'open-sans-bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '15%'
    }
});

export default CartItem;