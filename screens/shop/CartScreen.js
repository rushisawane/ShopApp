import React,{useState,useEffect} from 'react';
import { View,Text,Button,StyleSheet,FlatList,Alert,ActivityIndicator } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';

import Color from '../../contants/Color';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/action/cart';
import * as orderActions from '../../store/action/order';


const CartScreen = props => {
    const [error,setError] = useState();
    const [showLoader,setShowLoader] = useState(false)
    const total = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        let arrayCartItems=[];
        for(const key in state.cart.item) {
            arrayCartItems.push(
                {
                    id:key,
                    quantity:state.cart.item[key].quantity,
                    title:state.cart.item[key].prodtitle,
                    price:state.cart.item[key].prodprice,
                    sum:state.cart.item[key].sum,
                }
            )
        }
        return arrayCartItems.sort((a,b)=> a.id > b.id ? 1 :-1);
    });

    const dispatch = useDispatch();
     useEffect(()=>{
         if(error) {
            Alert.alert('Error Occured',error,[{text:'Okay'}]);
         }
     },[error]);

     if(showLoader) {
        return(
            <View style={styles.centered}><ActivityIndicator size='large' color={Color.primary}/></View>
        )
     }

    return (
        <View>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Amount:<Text style={styles.amount}>${Math.round(total.toFixed(2) * 100 / 100)}</Text></Text>
                <Button title="Order Now" color={Color.primary} onPress={async()=>{
                    setShowLoader(true);
                    try {
                        await dispatch(orderActions.addOrder(cartItems,total));
                    } catch (error) {
                        setError(error.message);
                    }
                    setShowLoader(false);
                }} disabled={cartItems.length <1 }/>
            </View>
            <FlatList data={cartItems} keyExtractor={item=>item.id} renderItem={(itemData)=> <CartItem quantity={itemData.item.quantity} title={itemData.item.title} sum={itemData.item.sum} onRemove={()=>{
                dispatch(cartActions.deleteFromCart(itemData.item.id));
            }} showDeleteBtn />}/>
        </View>
    )
}

const styles = StyleSheet.create({
    summary:{
        margin:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:10,
        padding:20,
        borderRadius:10,
        backgroundColor:'white',
        elevation:5,
    },
    summaryText:{
        fontFamily:'open-sans-bold',
        fontSize:18
    },
    amount:{
        fontFamily:'open-sans-bold',
        color:'#654568'
    },
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default CartScreen;