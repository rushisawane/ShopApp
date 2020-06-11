import React,{ useEffect, useState, useCallback } from 'react';
import { FlatList,Button,ActivityIndicator,View,Text,StyleSheet } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { HeaderButtons,Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as cartActions from '../../store/action/cart';
import * as productActions from '../../store/action/product';
import Color from '../../contants/Color';

const ProductOverviewScreen = props => {

    const [showLoader,setShowLoader] = useState(true);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const Product = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setShowLoader(true);
        setIsRefreshing(true);
        try {
            await dispatch(productActions.selectProduct());
        } catch (error) {
            console.log(error);
            setError(error);
        }
        setShowLoader(false);
        setIsRefreshing(false);
     },[dispatch,setShowLoader,setError]) 

    useEffect(()=>{
        const willFocusSub = props.navigation.addListener('willFocus',loadProducts);
        return ()=>{
            willFocusSub.remove();
        }
    },[loadProducts])

    useEffect(()=>{
         loadProducts();
    },[dispatch,loadProducts,setShowLoader]);

    if(error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errtext}>Something went wrong</Text>
                <Button style={styles.errbtn} title='Try Again' color={Color.primary} onPress={loadProducts}/>
            </View>
        )
    }

    if(showLoader) {
        return <View style={styles.centered}>
                    <ActivityIndicator color={Color.primary} size='large'/>
               </View>
    }

    if(!showLoader && Product.length === 0) {
        return (
        <View style={styles.centered}>
            <Text style={styles.errtext}>No item's found! May be start adding some</Text>
        </View>)
    }

    onSelectProductHandler= (id,title) => {
        props.navigation.navigate('productdetail',{
            prodid:id,
            prodtitle:title
        })
    } 

    return(
    <FlatList onRefresh={loadProducts} refreshing={isRefreshing} data={Product} renderItem={ itemData => 
        <ProductItem 
            imageurl={ itemData.item.imageUrl } 
            title={itemData.item.title} 
            price={ itemData.item.price.toFixed(2) } 
            onSelectProduct={()=>{ onSelectProductHandler(itemData.item.id,itemData.item.title) }}>
                <Button title="Show Details" color={ Color.primary } onPress={ ()=>{ onSelectProductHandler(itemData.item.id,itemData.item.title) } }/>
                <Button title="To Cart" color={ Color.primary } onPress={ ()=>{ dispatch(cartActions.addToCart(itemData.item)) } }/>
        </ProductItem>}
    />
    )
}

ProductOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle:'All Products',
        headerLeft:()=>(
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title="Orders" iconName="md-menu" onPress={()=>{
                    navData.navigation.toggleDrawer();
                }}/>
            </HeaderButtons>
            ),
        headerRight:()=>(
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title="Cart" iconName="md-cart" onPress={()=>{
                    navData.navigation.navigate('cart');
                }}/>
            </HeaderButtons>
            )
    }
   
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

export default ProductOverviewScreen;


