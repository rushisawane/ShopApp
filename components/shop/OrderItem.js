import React,{ useState } from 'react';
import { View,Text,StyleSheet,Button } from 'react-native';
import CartItem from '../shop/CartItem'

import Color from '../../contants/Color';

const OrderItem = props => {

    const [showDetails,setShowDetails] = useState(false);
    console.log(props.items);
    return (
        <View style={styles.summaryContainer}>
            <View style={ styles.summary }>
                <Text style={ styles.total }>{props.total.toFixed(2)}</Text>
                <Text style={ styles.date } >{props.date}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button title={showDetails?'Hide Details':'Show Details'} color={ Color.primary } onPress={()=>{
                    setShowDetails(prevState => !prevState)
                }}/>
                {showDetails && <View style={styles.detailItems}>
                    {props.items.map(cartItem=><CartItem key={cartItem.id} quantity={cartItem.quantity} title={cartItem.title} sum={cartItem.sum} showDeleteBtn={false} />)}</View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    summaryContainer:{
        margin:15,
        borderRadius:10,
        backgroundColor:'white',
        elevation:5,
        padding:10,
    },
    summary:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5
    },
    total:{
        fontFamily:'open-sans-bold',
        fontSize:16
    },
    date:{
        fontFamily:'open-sans',
        fontSize:16,
        color:'#888'
    },
    buttonContainer:{
        alignItems:'center'
    },
    detailItems:{
        width:'100%'
    }
})

export default OrderItem;