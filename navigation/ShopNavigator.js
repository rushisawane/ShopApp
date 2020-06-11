import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator,DrawerNavigatorItems } from 'react-navigation-drawer';
import { createSwitchNavigator } from 'react-navigation';
import { View,Button,StyleSheet,SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import ProductOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrderScreen from '../screens/shop/OrdersScreen';
import UserProductScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductsScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import Color from '../contants/Color';
import * as authActions from '../store/action/Auth';

const defaultNavOptions = {
    headerStyle:{
        backgroundColor:Color.primary
    },
    headerTitleStyle:{
        fontFamily:'open-sans-bold'
    },
    headerBackTitleStyle:{
        fontFamily:'open-sans'
    },
    headerTintColor:'#ffffff'
}

const ShopNavigatior = createStackNavigator({
    productoverview:ProductOverviewScreen,
    productdetail: ProductDetailScreen,
    cart:CartScreen
},{
    navigationOptions:{
        drawerIcon: drawerConfig => (
            <Icon name="md-cart" size={23} color={drawerConfig.tintColor}/>
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const OrderNavigator = createStackNavigator({
    order:OrderScreen
},{
    navigationOptions:{
        drawerIcon: drawerConfig => (
            <Icon name="md-list" size={23} color={drawerConfig.tintColor}/>
        )
    },
    defaultNavigationOptions:defaultNavOptions
}
)

const AdminNavigator = createStackNavigator({
    admin:UserProductScreen,
    edit:EditProductScreen
},{
    navigationOptions:{
        drawerIcon: drawerConfig => (
            <Icon name="md-create" size={23} color={drawerConfig.tintColor}/>
        )
    },
    defaultNavigationOptions:defaultNavOptions
}
)

const DrawerNavigator = createDrawerNavigator({
    Product:ShopNavigatior,
    Orders:OrderNavigator,
    Admin:AdminNavigator
},{
    contentOptions:{
        activeTintColor:Color.primary
    },
    contentComponent:(props)=>{
        const dispatch = useDispatch();
        return (
            <View style={styles.logout}>
                <SafeAreaView forceInset={{top:'always',horizontal:'never'}}>
                    <DrawerNavigatorItems {...props}/>
                    <Button title='Logout' color={Color.primary} onPress={()=>{
                        dispatch(authActions.logout());
                        //props.navigation.navigate('Auth');
                    }
                    }/>
                </SafeAreaView>
            </View>
        )
    }


})

const AuthStackNav = createStackNavigator({
    Auth:AuthScreen
},{
    defaultNavigationOptions:defaultNavOptions
});

const MainNavigator = createSwitchNavigator({
    StartUp:StartUpScreen,
    Auth:AuthStackNav,
    Shop:DrawerNavigator
})

const styles = StyleSheet.create({
    logout:{
        flex:1,
        paddingTop:20
    }
})

export default createAppContainer(MainNavigator);