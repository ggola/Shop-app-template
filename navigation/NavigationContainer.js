import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import Navigator from '../navigation/Navigator';

const NavigationContainer = props => {

    // useRef is a react hook that allows accessing JSX components that you're rendering in react by creating a reference: return <Navigator ref={navRef}/>;
    const navRef = useRef();
    const isAuth = useSelector(state => state.auth.token);
    // Use useEffect to react to changes in isAuth
    useEffect(() => {
        if (isAuth == null) {
            // User has logged out: use navRef to dispatch the possible navigation actions inside the JSX component and to choose the action you want, in this case .navigate ( + routeName!!!) 
            navRef.current.dispatch(NavigationActions.navigate({ routeName: 'Auth' }));
        }
    }, [isAuth]);

    return <Navigator ref={navRef}/>;
};

export default NavigationContainer;