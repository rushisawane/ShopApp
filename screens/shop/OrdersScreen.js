import React,{ useEffect,useState,useCallback } from 'react';
import { View,StyleSheet,FlatList,ActivityIndicator,Alert,Text } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { HeaderButtons,Item } from 'react-navigation-header-buttons';

import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/action/order';
import Color from '../../contants/Color';

const OrderScreen = props => {

    const [error,setError] = useState();
    const [showLoader,setShowLoader] = useState();

    const orders = useSelector(state => state.order.orders);
    const dispatch = useDispatch();

     const fetchOrders = useCallback(async() => {
        try {
            await dispatch(orderActions.selectOrder());
        } catch (error) {
            setError(error.message);
        }
    },[dispatch,setError,setShowLoader])
    
    useEffect(()=>{
        setShowLoader(true);
        fetchOrders();
        setShowLoader(false);
    },[dispatch,fetchOrders]);

    useEffect(()=>{
        const willFocusSub = props.navigation.addListener('willFocus',fetchOrders);
        return ()=>{
            willFocusSub.remove();
        }
    },[fetchOrders])

    useEffect(()=>{
        if(error) {
            Alert.alert('Error Occured',error,[{text:'Okay'}]);
        }
    },[error])

    if(showLoader) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Color.primary}/>
            </View>
        )
    }

    if(!showLoader && orders.length === 0) {
        return (
        <View style={styles.centered}>
            <Text style={styles.errtext}>No orders's found! May be start ordering some products?</Text>
        </View>)
    }


    return(
        <FlatList data={orders} keyExtractor={ item => item.id } renderItem={itemData=>(<OrderItem
            total={itemData.item.totalamount}
            date={itemData.item.readableDate}
            items={itemData.item.cartitem}
        />)}/>
            
    )
}

const styles = StyleSheet.create({
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    errtext:{
        fontFamily:'open-sans',
        fontSize:13,
        marginBottom:'2%'
    }
})

OrderScreen.navigationOptions = navData => {
    return {
        headerTitle:'Orders',
        headerLeft:()=>(
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title="Orders" iconName="md-menu" onPress={()=>{
                    navData.navigation.toggleDrawer();
                }}/>
            </HeaderButtons>
            ),
    }
}

export default OrderScreen;