import { GET_PRODUCTS, DELETE_PRODUCT, ADD_PRODUCT, EDIT_PRODUCT } from '../actions/products';

// Set initial state
const initialState = {
    availableProducts: [], 
    userProducts: []
};

const productsReducer = (state = initialState, action) => {
    let availableProducts;
    let userProducts;
    switch (action.type) {
        case GET_PRODUCTS:
            return {
                ...state,
                availableProducts: action.products,
                userProducts: action.products.filter(prod => prod.ownerId === action.userId)
            };
        case DELETE_PRODUCT:
            availableProducts = state.availableProducts.filter(prod => prod.id !== action.id)
            userProducts = state.userProducts.filter(prod => prod.id !== action.id)
            return {
                ...state,
                availableProducts: availableProducts,
                userProducts: userProducts
            };
        case ADD_PRODUCT:
            const addedProduct = action.product;  
            return {
                ...state,
                availableProducts: [addedProduct, ...state.availableProducts],
                userProducts: [addedProduct, ...state.userProducts]
            };
        case EDIT_PRODUCT:
            const editedProduct = action.product;
            availableProducts = state.availableProducts.filter(prod => prod.id !== editedProduct.id);
            userProducts = state.userProducts.filter(prod => prod.id !== editedProduct.id);
            return {
                ...state,
                availableProducts: [editedProduct, ...availableProducts],
                userProducts: [editedProduct, ...userProducts]
            };
        default:
            return state;
    };
};

export default productsReducer;