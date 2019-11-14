// ******* INSTALLATION ******* //

// npm install --save react-navigation react-navigation-stack react-navigation-tabs react-navigation-drawer react-navigation-header-buttons react-navigation-material-bottom-tabs react-native-paper redux react-redux @expo/vector-icons expo-font redux-thunk expo-linear-gradient

// npm install --save react-navigation react-navigation-stack react-navigation-header-buttons react-native-paper redux react-redux @expo/vector-icons expo-font redux-thunk react-native-gesture-handler react-native-reanimated react-native-screens expo

//NOTE: reducers MUST be always SYNC. actions can be ASYNC (with redux-thunk). Requests must be sent by the action creator only!

// expo install react-native-gesture-handler react-native-reanimated react-native-screens

// ******* DEBUGGING ******* // 
// npm install--save -dev redux-devtools-extension

import React, { useState } from 'react';
import { SafeAreaView } from 'react-navigation';

import * as Font from 'expo-font';
import { AppLoading } from 'expo';

// Redux packages (applyMiddleware for async net calls)
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

// Redux Store
import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth';

// Navigator
import NavigationContainer from './navigation/NavigationContainer';

import { useScreens } from 'react-native-screens';
useScreens();

// Redux: Create combined root reducer
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

// Redux: Create redux store
// add second argument applyMiddleware(ReduxThunk) to enable async net calls
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

// Load new fonts
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {

  // Prolong splash screen to upload fonts
  const [dataLoaded, setDataLoaded] = useState(false);
  if (!dataLoaded) {
    return (
      <AppLoading 
        startAsync={fetchFonts} 
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1}} forceInset={{ top: 'never' }}>
        <NavigationContainer />
      </SafeAreaView>
    </Provider>
  );

}