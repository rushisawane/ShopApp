import React,{useState,useEffect} from 'react';
import { FlatList,StyleSheet,Button,Alert,ActivityIndicator,View,Text } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { HeaderButtons,Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Color from '../../contants/Color';
import * as productActions from '../../store/action/product';

const UserProductScreen = props => {
    const [error,setError] = useState(false);
    const [showLoader,setShowLoader] = useState(false);
    const userProduct = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(error) {
            Alert.alert('Error occured!',error,[{text:'Okay'}]);
        }
    },[error])

    const onEditScreenHandler = id => {
        props.navigation.navigate('edit',{ prodid:id })
    }

    const onDeleteHandler = (id) => {
        setShowLoader(true);
        Alert.alert('Are you sure?','Do you really want to delete this item?',[
            {text:'No', style:'default'},
            {text:'Yes',style:'destructive',onPress:async()=>{
                try {
                    await dispatch(productActions.deleteProduct(id))
                } catch (error) {
                    setError(error.message)
                }
                
            } 
        }
        ])
        setShowLoader(false);
    }

    if(showLoader) {
        return(
            <View style={styles.centered}><ActivityIndicator size='large' color={Color.primary}/></View>
        )
    }

    if(!showLoader && userProduct.length === 0) {
        return (
        <View style={styles.centered}>
            <Text style={styles.errtext}>No item's found! May be start adding some</Text>
        </View>)
    }


    return (
        <FlatList data={ userProduct } renderItem={ itemData=> <ProductItem
            imageurl={itemData.item.imageUrl} 
            title={itemData.item.title} 
            price={itemData.item.price}
            onSelectProduct={()=>{ onEditScreenHandler(itemData.item.id) }}>
                <Button title="EDIT" color={ Color.primary } onPress={ ()=>{ onEditScreenHandler(itemData.item.id) } }/>
                <Button title="DELETE" color={ Color.primary } onPress={ ()=>{ onDeleteHandler(itemData.item.id) } }/>
        </ProductItem>}/>
    );
}

UserProductScreen.navigationOptions = navData => {
    return {
        headerTitle:'Your Products',
        headerLeft:()=>(
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title="Admin" iconName="md-menu" onPress={()=>{
                    navData.navigation.toggleDrawer();
                }}/>
            </HeaderButtons>
            ),
        headerRight:()=>(
            <HeaderButtons HeaderButtonComponent={ CustomHeaderButton }>
                <Item title="Edit" iconName="md-create" onPress={()=>{
                    navData.navigation.navigate('edit');
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

export default UserProductScreen