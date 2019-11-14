import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

// Components
import CartItem from '../../components/user/cartItem';

// Constants
import Colors from '../../constants/Colors';

const OrderItem = props => {

    const [showDetails, setShowDetails] = useState(false);

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onLongPress={props.onDeleteOrder}>
            <View style={styles.orderItem}>
                <View style={styles.orderMain}>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountText}>Total: ${props.amount}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{props.date}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        title={showDetails ? 'Hide Details' : 'Show Details'}
                        color={Colors.buttons}
                        onPress={() => {
                            setShowDetails(prevState => !prevState);
                        }}
                    /> 
                </View>
                {showDetails &&
                    <View style={styles.listContainer}>
                        {props.orderItems.map(item => 
                            <CartItem
                                key={item.productId}
                                image={item.productImage}
                                quantity={item.quantity}
                                title={item.productTitle}
                                sum={item.sum}
                                useButton={false}
                                onRemove={() => {}}
                            />    
                        )}
                    </View>
                } 
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 5,
        elevation: 5, 
        margin: 8,
        padding: 5,
        borderRadius: 10
    },
    orderMain:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '3%',
        marginTop: 10,
        marginBottom: 7
    },
    amountContainer: {
        width: '37%',
        alignItems: 'flex-start'
    },
    amountText: {
        fontSize: 16,
        color: Colors.text,
        fontFamily: 'open-sans-bold'
    },
    dateContainer: {
        width: '57%',
        alignItems: 'flex-end'
    },
    dateText: {
        fontSize: 15,
        color: Colors.text,
        fontFamily: 'open-sans'
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center'
    },
    listContainer: {
        width: '100%',
        alignItems: 'center'
    }
});

export default OrderItem;