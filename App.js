import React,{ useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore,combineReducers,applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import ReduxThunk from 'redux-thunk';
import * as Font from 'expo-font'
//import { composeWithDevTools } from 'redux-devtools-extension';

import productReducer from './store/reducer/product';
import cartReducer from './store/reducer/cart';
import orderReducer from './store/reducer/order';
import authReducer from './store/reducer/Auth';
import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  products:productReducer,
  cart:cartReducer,
  order:orderReducer,
  auth:authReducer
});

const store = createStore(rootReducer,applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans':require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold':require('./assets/fonts/OpenSans-Bold.ttf')
  })
}

export default function App() {

  const [fontLoaded,setFontLoaded] = useState(false);

  if(!fontLoaded) {
    return (
      <AppLoading startAsync={ fetchFonts } onFinish={ ()=> {
        setFontLoaded(true)
      }}/>
    )    
  }
  return (
    <Provider store={store}>
      <NavigationContainer/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  
});
