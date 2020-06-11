import React,{ useState,useReducer,useEffect,useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TextInput,View,KeyboardAvoidingView,ScrollView, StyleSheet,Text,Button,ActivityIndicator,Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import Color from '../../contants/Color';
import * as authActions from '../../store/action/Auth';

const FORM_INPUT_CHANGE = 'FORM_INPUT_CHANGE';

const formReducer = (state,action) => {

    if(action.type===FORM_INPUT_CHANGE) {
        const updatedInputValues = {
            ...state.inputValues,
            [action.input]:action.value
            
        }
        const updatedInputValidities = {
            ...state.inputValidities,
            [action.input]:action.isValid
            
        }
        
        updatedTouchedInput = {
            ...state.touchedInput,
            [action.input]:action.touched
        } 
       
        let updatedFormIsValid = true;
        for(const key in updatedInputValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
        }

        return {
            inputValues:updatedInputValues,
            inputValidities:updatedInputValidities,
            touchedInput:updatedTouchedInput,
            formIsValid:updatedFormIsValid
        }
    }

    return state;
}

const AuthScreen = props => {

    const [isSignUp,setIsSignUp] = useState(false)
    const [error,setError] = useState();
    const [isLoading,setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const [formState,formDispatch] = useReducer(formReducer,{
        inputValues:{
            email:'',
            password:''
        },
        inputValidities:{
            email:false,
            password:false
        },
        touchedInput:{
            email:false,
            password:false
        },
        formIsValid:false
    })

    useEffect(()=>{
        if(error) {
            Alert.alert('An Error occured!',error,[{text:'Okay'}]);
        }
    },[error])

    authHandler = useCallback(async () => {
        if(!formState.formIsValid) {
            Alert.alert('Invalid input','Please check the form error',[{text:'Okay'}]);
            !formState.inputValidities.email?formDispatch({type:FORM_INPUT_CHANGE, touched:true,input:'email'}):null
            !formState.inputValidities.password?formDispatch({type:FORM_INPUT_CHANGE, touched:true,input:'password'}):null
            return
        }
        setError(null);
        setIsLoading(true);
        try {
            if(isSignUp) {
                await dispatch(authActions.signUp(formState.inputValues.email,formState.inputValues.password));
            } else {
                await dispatch(authActions.login(formState.inputValues.email,formState.inputValues.password));
            }
            props.navigation.navigate('Shop');
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    },[dispatch,formState]);


    const inputHandler = (identifier,text) => {
    
        if(text.trim().length===0) {
            formDispatch({
                type:FORM_INPUT_CHANGE,
                input:identifier,
                value:text,
                isValid:false,
                touched:true
            })
        } else {
            formDispatch({
                type:FORM_INPUT_CHANGE,
                input:identifier,
                value:text,
                isValid:true,
                touched:false            
            })
        }
    }
    return(
            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
               <LinearGradient colors={['#ffedff','#ffe3ff']} style={styles.gradient}>
                <View style={styles.Card}>
                    <ScrollView>
                        <View>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput 
                                style={styles.inputFields}
                                keyboardType='email-address'
                                value={formState.inputValues.email}
                                onFocus = { ()=>formDispatch({type:FORM_INPUT_CHANGE, touched:true,input:'email'}) }
                                onChangeText={inputHandler.bind(this,'email') } 
                            />
                            {!formState.inputValues.email && formState.touchedInput.email ? <Text>Please enter valid email</Text>:null}
                            </View>
                            <View>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput 
                                style = {styles.inputFields}
                                secureTextEntry 
                                keyboardType='default' 
                                maxLength={7}
                                value={formState.inputValues.password}
                                onChangeText={inputHandler.bind(this,'password')}
                                onFocus = {()=> formDispatch({type:FORM_INPUT_CHANGE,touched:true,input:'password'}) }
                            />
                            {!formState.inputValues.password && formState.touchedInput.password ? <Text>Please enter valid password</Text>:null}
                </View>
                        <View style={styles.btnContainer}>
                        {isLoading ? (<ActivityIndicator size='small' color={Color.primary}/>):
                            (<Button title={isSignUp?'Sign Up':'Login'} onPress={ authHandler } color={Color.primary}/>)}
                            <Button title={`Switch to ${isSignUp?'Login':'Sign UP'}`} onPress={  ()=>{
                                 setIsSignUp(prevState=>!prevState);
                            }
                            } color='#33dd'/>
                        </View>
                    </ScrollView>
                </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        )
}

AuthScreen.navigationOptions = navData => {
    return{
        headerTitle:'Authentication'
    }   
}

const styles = StyleSheet.create({
    screen:{
        flex:1
    },
    gradient:{
        flex:1,
        height:'100%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    Card:{
        flex:1,
        width:'80%',
        height:'29%',
        maxHeight:270,
        backgroundColor:'white',
        elevation:5,
        borderRadius:10,
        padding:'4%'
    },
    inputFields:{
        borderBottomWidth:1,
        borderBottomColor:'#888',
        marginVertical:'1%'
    },
    inputLabel:{
        //marginVertical:'1%',
        paddingHorizontal:'1%',
        fontFamily:'open-sans-bold',
        fontSize:16
    },
    btnContainer:{
        marginVertical:'4%',
        justifyContent:'space-between'
    },
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default AuthScreen;