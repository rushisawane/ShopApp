import React from 'react';
import { View,Text,TouchableOpacity,StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Color from '../../contants/Color';

const CartItem = props => {

    return (
        <View style={styles.cartItem}>
            <View style={styles.cartDesc}>
                <Text style={styles.qty}>{props.quantity}</Text>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.cartDesc}>
                <Text style={styles.mainText}>${props.sum}</Text>
                {props.showDeleteBtn && <TouchableOpacity onPress={ props.onRemove } style={styles.deleteButton}>
                    <Icon name="md-trash" size={23} color={Color.primary}/>
                </TouchableOpacity>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cartItem:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        margin:20,
        paddingHorizontal:10
    },
    cartDesc:{
        flexDirection:'row',
        
    },
    qty:{
        fontFamily:'open-sans-bold',
        color:'#888',
        fontSize:16,
        paddingRight:5
    },
    mainText:{
        fontFamily:'open-sans-bold',
        fontSize:16
    },
    deleteButton:{
        marginLeft:10
    }
})

export default CartItem;