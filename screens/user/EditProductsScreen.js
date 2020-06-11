import React,{ useState,useCallback,useEffect,useReducer } from 'react';
import { View,Text,StyleSheet,ScrollView,TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import * as productActions from '../../store/action/product';
import { HeaderButtons,Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Color from '../../contants/Color';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'
const formReducer = (state,action) => {
    if(action.type===FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.formInputValues,
            [action.input]:action.value
        };
        const updatedValidities = {
            ...state.formInputValidatities,
            [action.input]:action.isValid
        }
        let updatedformIsValid = true;
        for(const key in updatedValidities) {
            updatedformIsValid = updatedformIsValid && updatedValidities[key];
        }
        return {
            formIsValid:updatedformIsValid,
            formInputValidatities:updatedValidities,
            formInputValues:updatedValues
        };
    }
    return state;
}

const EditProductScreen = props => {
    const [showError,setShowError] = useState(false);
    const [showLoader,setShowLoader] = useState(false);
    const id = props.navigation.getParam('prodid');
    const editProduct = useSelector(state=> state.products.userProducts.find(prod=>prod.id===id));
    const dispatch = useDispatch(); 

    const [formState,dispatchFormState]=useReducer(formReducer,{
        formInputValues:{
            title:editProduct?editProduct.title:'',
            imageUrl:editProduct?editProduct.imageUrl:'',
            price:'',
            description:editProduct?editProduct.description:''
        },
        formInputValidatities:{
            title:editProduct?true:false,
            imageUrl:editProduct?true:false,
            price:editProduct?true:false,
            description:editProduct?true:false
        },
        formIsValid:editProduct?true:false
    })

    useEffect(()=> {
        if(showError) {
            Alert.alert('Error Occured',showError,[{text:'Okay'}]);
        }
    },[showError])

    onSubmitHandler = useCallback(async () => {
        if(!formState.formIsValid) {
            Alert.alert('Wrong Input!','Please Check the errors in the form.',[{text:'Okay'}]);
            return;
        }
        setShowError(null);
        setShowLoader(true);
        try {
            if(editProduct) {
                await dispatch(productActions.updateProduct(
                    id,
                    formState.formInputValues.title,
                    formState.formInputValues.imageUrl,
                    formState.formInputValues.description)
                );
            } else {
                await dispatch(productActions.addProduct(
                    formState.formInputValues.title,
                    formState.formInputValues.imageUrl,
                    formState.formInputValues.description,
                    +formState.formInputValues.price));
            }
            props.navigation.goBack();
        } catch (error) {
            setShowError(error.message);
        }
        setShowLoader(false);
    },[dispatch,id,formState]);

    useEffect(()=>{
        props.navigation.setParams({submit:onSubmitHandler});
    },[onSubmitHandler])

    const onTextChangeHandler = (identifier,text) => {
        if(text.trim().length === 0) {
            dispatchFormState({
                type:FORM_INPUT_UPDATE,
                input:identifier,
                value:text,
                isValid:false
            })
        } else {
            dispatchFormState({
                type:FORM_INPUT_UPDATE,
                input:identifier,
                value:text,
                isValid:true
            })
        }
    }

    if(showLoader) {
        return (
            <View style={styles.centered}><ActivityIndicator size='large' color={Color.primary}/></View>
        )
    }

    return (
       <ScrollView>
           <View style={styles.form}>
                <View style={styles.formcontrol}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput 
                        style={ styles.input } 
                        value={formState.formInputValues.title}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        returnKeyLabel='Next'
                        onChangeText={onTextChangeHandler.bind(this,'title')}
                        onSubmitEditing={()=>{ this.imgurl.focus(); }}
                    />
                    {!formState.formInputValues.title && <Text style={styles.errtxt}>Please enter a valid title</Text>}
                </View>
                <View style={styles.formcontrol}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput 
                        ref={(input) => { imgurl = input; }}
                        style={ styles.input } 
                        value={formState.formInputValues.imageUrl} 
                        onChangeText={ onTextChangeHandler.bind(this,'imageUrl') }
                        returnKeyLabel='Next'
                        onSubmitEditing = {()=>{ editProduct?this.desc.focus():this.price.focus(); }}
                    />
                    {!formState.formInputValues.imageUrl && <Text style={styles.errtxt}>Please enter a valid Image URL</Text>}
                </View>
                {editProduct?null:<View style={styles.formcontrol}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput 
                        ref={(input) => { price = input; }}
                        style={ styles.input } 
                        value={formState.formInputValues.price} 
                        onChangeText={ onTextChangeHandler.bind(this,'price') } 
                        returnKeyLabel='Next'
                        keyboardType='decimal-pad'
                        onSubmitEditing = {()=>{ this.desc.focus(); }}
                    />
                    {!formState.formInputValues.price && <Text style={styles.errtxt}>Please enter a valid price</Text>}
                </View>}
                <View style={styles.formcontrol}>
                    <Text style={styles.label} ref={(input) => { desc = input; }}>Description</Text>
                    <TextInput 
                        ref={(input) => { desc = input; }} 
                        style={ styles.input } 
                        value={formState.formInputValues.description} 
                        onChangeText={ onTextChangeHandler.bind(this,'description') }
                    />
                    {!formState.formInputValues.description && <Text style={styles.errtxt}>Please enter a valid description</Text>}    
                </View>
           </View>
       </ScrollView>
    )
}

EditProductScreen.navigationOptions = navData => {
    const submitHandler = navData.navigation.getParam('submit')
    return {
        headerTitle:navData.navigation.getParam('prodid') ? 'Edit Product' : 'Add Product',
        headerRight:()=><HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Save" iconName="md-checkmark" onPress={ submitHandler }/>
        </HeaderButtons>
    }
}
const styles = StyleSheet.create({
    form:{
        margin:20
    },
    formcontrol:{
        marginVertical:5, 
    },
    label:{
        fontFamily:'open-sans-bold'
    },
    input:{
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
        paddingVertical:5,
        marginHorizontal:2
    },
    errtxt:{
        color:'red'
    },
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default EditProductScreen;