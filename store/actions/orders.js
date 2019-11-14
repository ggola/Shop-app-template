export const ADD_TO_ORDERS = 'ADD_TO_ORDERS';
export const GET_ORDERS = 'GET_ORDERS';
export const DELETE_ORDER = 'DELETE_ORDER';

// Models
import Order from '../../models/order';
import ENV from '../../env.js';

export const getOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`${ENV.firebaseURL}/orders/${userId}.json`, {
                method: 'GET'
            });

            // Check response.ok --> true is in the 200s
            if (!response.ok) {
                response.text()
                .then(text => {throw new Error(text)})
                .catch(err => {throw new Error(err)});
            }

            const resData = await response.json();
            const loadedOrders = [];
            for (const key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    resData[key].date
                ))
            }
            dispatch({
                type: GET_ORDERS,
                orders: loadedOrders
            });
        } catch (err) {
            // Send to custom analytics
            throw err;
        }
    }
}

// Action creator
export const addToOrders = (cartItems, totalAmount, date) => {

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`${ENV.firebaseURL}/orders/${userId}.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartItems: cartItems,
                    totalAmount: totalAmount,
                    date: date
                })
            });

            // Check response.ok --> true is in the 200s
            if (!response.ok) {
                response.text()
                .then(text => {throw new Error(text)})
                .catch(err => {throw new Error(err)});
            }

            const resData = await response.json();

            // Update Product with ID from Firebase
            const updatedOrder = new Order(
                resData.name,
                cartItems,
                totalAmount,
                date
            );

            dispatch({
                type: ADD_TO_ORDERS,
                order: updatedOrder
            });
        } catch (err) {
            throw err;
        }
    };
};

// Action creator
export const deleteOrder = (orderId) => {

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`${ENV.firebaseURL}/orders/${userId}/${orderId}.json?auth=${token}`, {
                method: 'DELETE'
            });

            // Check response.ok --> true is in the 200s
            if (!response.ok) {
                response.text()
                .then(text => {throw new Error(text)})
                .catch(err => {throw new Error(err)});
            }

            dispatch({
                type: DELETE_ORDER,
                orderId: orderId
            });
        } catch (err) {
            throw err;
        }
    };
};