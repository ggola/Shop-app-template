import { AUTHENTICATE, LOGOUT } from '../actions/auth';

// Set initial state
const initialState = {
    token: null,
    userId: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE: {
            return {
                userId: action.userId,
                token: action.token
            };
        };
        case LOGOUT: {            
            return initialState;
        };
        default:
            return state;
    };
};

export default authReducer;