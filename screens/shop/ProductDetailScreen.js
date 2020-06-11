import React from 'react';
import { View,Text,StyleSheet,ScrollView,Image,Button } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { HeaderButtons,Item } from 'react-navigation-header-buttons'

import Color from '../../contants/Color';
import * as cartActions from '../../store/action/cart';
import CustomHeaderButton from '../../components/UI/HeaderButton';

const ProductDetailScreen = props => {
    const productid = props.navigation.getParam('prodid');
    const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productid))
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={ styles.image } source={{ uri:selectedProduct.imageUrl }}/>
            <View style={styles.actions}>
                <Button color={ Color.primary} title="Add to Cart" onPress={()=>{
                    dispatch(cartActions.addToCart(selectedProduct));
                }}/>
            </View>
            <Text style={ styles.price }>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={ styles.desc } >{selectedProduct.description}</Text>
        </ScrollView>
    )
}

ProductDetailScreen.navigationOptions = (navData) => {
    return {
        headerTitle:navData.navigation.getParam('prodtitle'),
        headerRight: ()=>(
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title="Cart" iconName="ios-cart" onPress={()=>{
                    navData.navigation.navigate('cart');
                }}/>
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    image:{
        width:'100%',
        height:300,
    },
    actions:{
        marginVertical:10,
        alignItems:'center'
    },
    price:{
        fontSize:20,
        color:'#888',
        textAlign:'center',
        marginVertical:20,
        fontFamily:'open-sans-bold'
    },
    desc:{
        fontSize:14,
        textAlign:'center',
        marginHorizontal:20,
        fontFamily:'open-sans'
    }
})

export default ProductDetailScreen;