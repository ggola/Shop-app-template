// Actions
import { ADD_TO_ORDERS, GET_ORDERS, DELETE_ORDER } from '../actions/orders';

const initialState = {
    orders: []
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORDERS: 
            return {
                orders: action.orders
            }
        case ADD_TO_ORDERS:          
            return {
                orders: state.orders.concat(action.order)
            }
        case DELETE_ORDER:
            return {
                orders: state.orders.filter(order => order.id !== action.orderId)
            }
        default:
            return state;
    }
};

export default orderReducer;