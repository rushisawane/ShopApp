import CartItem from '../../model/cart-item';
import { ADD_TO_CART } from '../action/cart';
import { DELETE_FROM_CART } from '../action/cart';
import { ADD_ORDER } from '../action/order';
import { DELETE_PRODUCT } from '../action/product';

const initialState = {
    item:{},
    totalAmount:0
}

export default (state = initialState,action) => {
    switch(action.type) {
        case ADD_TO_CART:
            const selectedProd = action.product;
            const prodPrice = selectedProd.price;
            const prodTitle = selectedProd.title;

            let neworupdateCartProduct;

            if(state.item[selectedProd.id]) {
                //update item
                neworupdateCartProduct = new CartItem(state.item[selectedProd.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.item[selectedProd.id].sum + prodPrice
                    );
                return {
                    ...state,
                    item:{...state.item,[selectedProd.id]:neworupdateCartProduct},
                    totalAmount: state.totalAmount + prodPrice
                }
            } else {
                //add item
                neworupdateCartProduct = new CartItem(1,prodPrice,prodTitle,prodPrice);
                return {
                    ...state,
                    item:{...state.item,[selectedProd.id]:neworupdateCartProduct},
                    totalAmount: state.totalAmount + prodPrice
                }
            }

            case DELETE_FROM_CART:
                
                const selectedItem = state.item[action.pid];
                const selectedQty = selectedItem.quantity;

                let updatedItems;

                if(selectedQty > 1) {
                    //update quantity and sum
                    const updatedItem = new CartItem(
                        selectedItem.quantity - 1,
                        selectedItem.prodprice,
                        selectedItem.prodtitle,
                        selectedItem.sum - selectedItem.prodprice
                    );
                    
                     updatedItems = {...state.item,[action.pid]:updatedItem}   
                    

                } else {
                    //remove item
                    updatedItems = { ...state.item };
                    delete updatedItems[action.pid];   
                }

                return {
                    ...state,
                    item: updatedItems,
                    totalAmount: state.totalAmount - selectedItem.prodprice
                }

                case DELETE_PRODUCT:
                    if(!state.item[action.id]) {
                        return state;
                    }

                    const updatedItems2 = {...state.item}
                    const itemTotal = state.item[action.id].sum
                    delete updatedItems2[action.id]
                    return {
                        ...state,
                        item:updatedItems2,
                        totalAmount:state.totalAmount - itemTotal
                    }

                case ADD_ORDER:
                    return initialState;       
    }
    return state;
};

//export default cartReducer;