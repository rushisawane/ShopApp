export const SIGN_UP = 'SIGN_UP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

import { AsyncStorage } from 'react-native';

let timer;

export const authenticate = (token,userId,expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE,token:token,userId:userId})
    }
}

export const login = (email,password) => {
    return async dispatch => {
        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4WjEJ3UKaJjSWfANB5HmZXy92s9zhd_o',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:email,
                    password:password,
                    returnSecureToken:true
                })
            });
            
            if(!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'Something went wrong!'
                if(errorId === 'INVALID_EMAIL') {
                    message = 'This email could not be found!'
                } else if(errorId === 'INVALID_PASSWORD') {
                    message = 'This password is not valid!'
                }
                throw new Error(message);
            }
            
            const resData = await response.json();
            console.log(resData);

        // dispatch({
        //     type:LOGIN,
        //     token:resData.idToken,
        //     userId:resData.localId
        // });
        dispatch(authenticate(resData.idToken,resData.localId,parseInt(resData.expiresIn)*1000));
        const expiry = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveToDevice(resData.idToken,resData.localId,expiry);
            
        } catch (error) {
            throw(error);
        } 
    }
}

export const signUp = (email,password) => {
    return async dispatch => {
        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4WjEJ3UKaJjSWfANB5HmZXy92s9zhd_o',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:email,
                    password:password,
                    returnSecureToken:true
                })
            });

            if(!response.ok) {
                if(!response.ok) {
                    const errorResData = await response.json();
                    console.log(errorResData)
                    const errorId = errorResData.error.message;
                    let message = 'Something went wrong!'
                    if(errorId === 'EMAIL_EXISTS') {
                        message = 'This email address is already in use by another account!'
                    } else if(errorId === 'WEAK_PASSWORD : Password should be at least 6 characters') {
                        message = 'Password should be at least 6 character'
                    }
                    throw new Error(message);
                }
            }

        const resData = await response.json();
        console.log(resData);

        // dispatch({
        //     type:SIGN_UP,
        //     token:resData.idToken,
        //     userId:resData.localId
        // })
        dispatch(authenticate(resData.idToken,resData.localId,parseInt(resData.expiresIn)*1000));
        const expiry = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveToDevice(resData.idToken,resData.localId,expiry);

        } catch (error) {
            throw(error);
        } 
    }
}

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {
        type:LOGOUT
    }
}

const clearLogoutTimer = () => {
    if(timer) {
        clearTimeout(timer);
    }
}

const setLogoutTimer = expiry => {
    return dispatch => {
        timer = setTimeout(()=>{
            dispatch(logout());
        },expiry)
    }
}

const saveToDevice = (token,userId,expiry) => {
        AsyncStorage.setItem('userData',JSON.stringify({
            token:token,
            userId:userId,
            expiry:expiry.toISOString()
        }));
}