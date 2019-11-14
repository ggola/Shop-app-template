export const GET_PRODUCTS = 'GET_PRODUCTS';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';

// Models
import Product from '../../models/product';
import ENV from '../../env.js';

// Action creator
export const getProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`${ENV.firebaseURL}/products.json`, {
                method: 'GET'
            });

            // Check response.ok --> true is in the 200s
            if (!response.ok) {
                response.text()
                .then(text => {throw new Error(text)})
                .catch(err => {throw new Error(err)});
            }

            const resData = await response.json();
            const loadedProducts = [];
            for (const key in resData) {
                loadedProducts.push(new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price
                ))
            }
            dispatch({
                type: GET_PRODUCTS,
                products: loadedProducts,
                userId: userId
            });
        } catch (err) {
            // Send to custom analytics
            throw err;
        }
    }
}

export const deleteProduct = (productId) => {

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // Target specific product with backtick ALT + 9 and embedded ${productId}
        const response = await fetch(`${ENV.firebaseURL}/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
        });

        // Check response.ok --> true is in the 200s
        if (!response.ok) {
            response.text()
            .then(text => {throw new Error(text)})
            .catch(err => {throw new Error(err)});
        }

        dispatch({
            type: DELETE_PRODUCT,
            id: productId
        });
    }
};

export const addProduct = (title, imageUrl, description, price) => {
    // To make async calls, return an action (redux thunk)
    // The action object is not returned immediately, but a function is returned. Redux thunk calls dispatch 

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`${ENV.firebaseURL}/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // data to post as JSON format: use stringify to turn a JS object into a JSON object
            body: JSON.stringify({
                ownerId: userId,
                title: title,
                imageUrl: imageUrl,
                description: description,
                price: price
            })
        });

        // Check response.ok --> true is in the 200s
        if (!response.ok) {
            response.text()
            .then(text => {throw new Error(text)})
            .catch(err => {throw new Error(err)});
        }

        const resData = await response.json();
        // resData contains the id of the newly added element in resData.name

        // Update Product with ID from Firebase
        const updatedProduct = new Product(
            resData.name,
            userId,
            title,
            imageUrl,
            description,
            price
        );

        // Now after all the await, the action is dispatched to the reducers
        dispatch({
            type: ADD_PRODUCT,
            product: updatedProduct
        });
     
    };
};

export const editProduct = (id, ownerId, title, imageUrl, description, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // Target specific product with backtick ALT + 9 and embedded ${id}
        const response = await fetch(`${ENV.firebaseURL}/products/${id}.json?auth=${token}`, {
            // PUT: changes the whole data
            // PATCH: changes only the specified fields in the body
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                imageUrl,
                description
            })
        });

        // Check response.ok --> true is in the 200s
        if (!response.ok) {
            response.text()
            .then(text => {throw new Error(text)})
            .catch(err => {throw new Error(err)});
        }

        const updatedProduct = new Product(
            id,
            ownerId,
            title,
            imageUrl,
            description,
            price
        );

        dispatch({
            type: EDIT_PRODUCT,
            product: updatedProduct
        });
     
    }
};