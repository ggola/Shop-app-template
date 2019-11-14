import { AsyncStorage } from 'react-native';
// AsyncStorage get translated to UserDefaults
import ENV from '../../env.js';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

// Action creator
export const authenticate = (userId, token, expiryTime) => {
    // Start logoutTimer and dispatch authenticate (use return dispatch to dispatch multiple actions)
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId: userId,
            token: token
        });
    }
};

// Action creator
export const logout = () => {
    // Clear timer
    clearLogoutTimer();
    // Clear async storage: returns a promise. Use return dispatch => only if you're interested in the result of the promise.
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

// Set timer to handle token expiration
const setLogoutTimer = (expirationTime) => {
    // Use redux thunk to handle the async task of the timer
    return dispatch => {
        // expiration time in msecs
        timer = setTimeout(() => {
            // Do something when timer expiers (token expires)    
            dispatch(logout());
        }, expirationTime);
        // Timeout expires after expirationTime
    }
};

// Action creator
export const signup = (email, password) => {

    return async dispatch => {    
        
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ENV.GoogleKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        const resData = await response.json();
        
        // Check response.ok --> true is in the 200s
        if (!response.ok) {

            const errorID = resData.error.message;    
            let message = 'Something went wrong';
            if (errorID === 'EMAIL_EXISTS') {
                message = 'The email address is already in use by another account.';
            } else if (errorID === 'OPERATION_NOT_ALLOWED') {
                message = 'Password sign-in is disabled.';
            } else if (errorID === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                message = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            }
            throw new Error(message);
        }

        const userToken = {
            date: Math.round(new Date() / 1000),
            idToken: resData.idToken,
            expiresIn: resData.expiresIn,
            kind: resData.kind,
            refreshToken: resData.refreshToken
        }

        try {
            const responseUser = await fetch(`${ENV.firebaseURL}/users.json?auth=${resData.idToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: resData.localId,
                    email: resData.email,
                    tokens: [userToken]
                })
            });

            if (!responseUser.ok) {
                throw new Error('Something went wrong');
            }

            dispatch(authenticate(
                resData.localId, 
                resData.idToken, 
                parseInt(resData.expiresIn) * 1000
            ));

            const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);

            saveDataToStorage(resData.localId, resData.idToken, expirationDate);

        } catch (err) {
            throw err
        }   
    };
};

// Action creator
export const login = (email, password) => {

    return async dispatch => {
      
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ENV.GoogleKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        const resData = await response.json();   

        // Check response.ok --> true is in the 200s
        if (!response.ok) {
            const errorID = resData.error.message;
            
            let message = 'Something went wrong';
            if (errorID === 'EMAIL_NOT_FOUND') {
                message = 'There is no user record corresponding to this email.';
            } else if (errorID === 'INVALID_PASSWORD') {
                message = 'The password is invalid.';
            } else if (errorID === 'USER_DISABLED') {
                message = 'The user account has been disabled.';
            } else if (errorID === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                message = 'Too many unsuccessful login attempts. Please try again later.';
            }
            throw new Error(message);
        }

        const userLoginToken = {
            date: Math.round(new Date() / 1000),
            idToken: resData.idToken,
            expiresIn: resData.expiresIn,
            kind: resData.kind,
            refreshToken: resData.refreshToken
        }

        const userId = resData.localId;

        // Get all users and find current user key
        try {
            const responseUsers = await fetch(`${ENV.firebaseURL}/users/.json`, {
                method: 'GET'
            });

            if (!responseUsers.ok) {
                throw new Error('Something went wrong');
            }

            const resUsersData = await responseUsers.json();

            const users = [];
            for (const key in resUsersData) {
                const userData = {
                    key: key,
                    id: resUsersData[key].id,
                    email: resUsersData[key].email,
                    tokens: resUsersData[key].tokens
                }
                users.push(userData);
            }
            currentUser = users.find(user => user.id === userId);
        
            // Update current user
            try {
                const responseUserUpdate = await fetch(`${ENV.firebaseURL}/users/${currentUser.key}.json?auth=${resData.idToken}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tokens: [...currentUser.tokens, userLoginToken],
                        displayName: resData.displayName,
                        registered: resData.registered

                    })
                });

                if (!responseUserUpdate.ok) {
                    throw new Error('Something went wrong');
                }

                dispatch(authenticate(
                    resData.localId, 
                    resData.idToken,
                    parseInt(resData.expiresIn) * 1000
                ));

                // Find expiration date: get date in msecs from Jan 1, 1970, and add int of the expiresIn string time 1000 to get msecs. Then convert it back to date.
                const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);

                saveDataToStorage(resData.localId, resData.idToken, expirationDate);

            } catch (err) {
                throw err
            }
            
        } catch (err) {
            throw err
        }

    };
};

const saveDataToStorage = (userId, token, expirationDate) => {
    // set key:value pairs. value must be a string. here we stringify a JS object and get a JSON object.
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expirationDate: expirationDate.toISOString()
    }))
}