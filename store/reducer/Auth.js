import { AUTHENTICATE, LOGOUT } from "../action/Auth"

initialState = {
    token:null,
    userId:null
}
export default (state =initialState,action) => {

    switch(action.type) {
        case AUTHENTICATE:
            console.log(action.userId);
            return {
                token:action.token,
                userId:action.userId
            }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}