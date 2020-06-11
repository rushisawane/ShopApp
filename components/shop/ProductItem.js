import React from 'react';
import { View,Text,Image,StyleSheet,TouchableOpacity,TouchableNativeFeedback,Platform } from 'react-native';

const ProductItem = props => {
    let TouchCmp = TouchableOpacity;
    if(Platform.OS==='android' && Platform.Version>=21) {
        TouchComp = TouchableNativeFeedback
    }
    return (
        <View style={styles.product}>
            <View style={ styles.ToucableCmp }>
            <TouchCmp onPress={props.onSelectProduct}>
            <View>
            <View style={ styles.imageContainer }>
                <Image style={ styles.image } source={{uri: props.imageurl}}/>
            </View>
            <View style={ styles.detail }>
                <Text style={ styles.title }>{props.title}</Text>
                <Text style={ styles.price }>${props.price}</Text>
            </View>
            <View style={ styles.btnContainer }>
                {props.children}
            </View>
            </View>
            </TouchCmp>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    product:{
        elevation:5,
        borderRadius:10,
        margin:20,
        height:300,
        backgroundColor:'#ffffff'     
    },
    TouchableCmp:{
        borderRadius:10,
        overflow:'hidden'
    },
    imageContainer:{
        height:'60%',
        width:'100%',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        overflow:'hidden'
    },
    image:{
        height:'100%',
        width:'100%'
    },
    detail:{
        alignItems:'center',
        height:'15%',
        padding:10
    },
    title:{
        fontSize:18,
        marginVertical:4,
        fontFamily:'open-sans-bold'
    },
    price:{
        fontFamily:'open-sans',
        fontSize:14,
        color:'#888'
    },
    btnContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:'4%',
        height:'25%'
    }
})

export default ProductItem;