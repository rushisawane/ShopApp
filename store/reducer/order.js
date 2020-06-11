import { ADD_ORDER, SELECT_ORDER } from '../action/order';
import Order from '../../model/order';
const initialState = {
    orders:[]
}

export default (state=initialState,action) => {

    switch(action.type) {
        case SELECT_ORDER:
            return {
                orders:action.orders
            }
        case ADD_ORDER:
            const itemtoadd = action.cartDetail.items;
            const total = action.cartDetail.total
            const addOrder = new Order(
                action.cartDetail.id,
                itemtoadd,
                total,
                action.cartDetail.date
            );
           return {...state,
                orders:state.orders.concat(addOrder)
        };
    }
    return state;
}