import React,{ useEffect } from 'react';
import { View,ActivityIndicator,StyleSheet,AsyncStorage } from 'react-native';
import { useDispatch } from 'react-redux';

import Color from '../contants/Color';
import * as authActions from '../store/action/Auth'


const StartUpScreen = props => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const checkAuth = async() => {
            const userData = await AsyncStorage.getItem('userData');
            if(!userData) {
                props.navigation.navigate('Auth');
                return;
            }

            const transformedData = JSON.parse(userData);
            const { token,userId,expiry } = transformedData;

            const expiryDate = new Date(expiry);
            
            if(expiryDate <= new Date()||!token || !userId) {
                return;
            }

            const expirationTime = expiryDate.getTime() - new Date().getTime();
            props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(token,userId,expirationTime));

        }

        checkAuth();
    },[dispatch])
    return(
        <View style={styles.centered}>
            <ActivityIndicator color={Color.primary} size='large'/>
        </View>
    )
}

const styles = StyleSheet.create({
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default StartUpScreen;