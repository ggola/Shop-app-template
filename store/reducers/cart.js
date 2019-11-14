// Actions
import { ADD_TO_CART, REMOVE_FROM_CART, CLEAN_CART } from '../actions/cart';
import { DELETE_PRODUCT } from '../actions/products';
// Cart Item Model
import CartItem from '../../models/cartItem';

const initialState = {
    items: {},  // Store object to sum up multiple items in 1 object and related quantity
    totalAmount: 0
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const product = action.product;
            const productImage = product.imageUrl;
            const productPrice = product.price;
            const productTitle = product.title;

            let item;
            // Check if product is already in items
            if (state.items[product.id]) {
                // Item already exists: update
                item = new CartItem(
                    state.items[product.id].quantity + 1,
                    productImage,
                    productPrice,
                    productTitle,
                    state.items[product.id].sum + productPrice
                );
            } else {
                // Add new item
                item = new CartItem(
                    1, 
                    productImage,
                    productPrice, 
                    productTitle, 
                    productPrice);
            }
            return {
                ...state,
                items: {...state.items, [product.id]:item},
                totalAmount: state.totalAmount + productPrice
            }
        case REMOVE_FROM_CART:
            const productId = action.productId;
            const selectedItem = state.items[productId];
            let updatedItems = {...state.items};
            if (selectedItem.quantity === 1) {
                delete updatedItems[productId];
            } else {
                // Create updated item
                const item = new CartItem(
                    selectedItem.quantity - 1,
                    selectedItem.productImage,
                    selectedItem.productPrice,
                    selectedItem.productTitle,
                    selectedItem.sum - selectedItem.productPrice
                );
                updatedItems = {...state.items, [productId]:item};
            }
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - selectedItem.productPrice
            }
        case CLEAN_CART:
            return {
                ...initialState
            }
        case DELETE_PRODUCT:
            if (!state.items[action.id]) { 
                return state;
            }
            const removedItem=state.items[action.id];
            const items={...state.items};
            delete items[action.id];
            return {
                ...state,
                items: items,
                totalAmount: state.totalAmount - removedItem.sum
            }
        default:
            return state;
    };
};

export default cartReducer;