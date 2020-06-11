import PRODUCTS from '../../data/dummy-data';
import { DELETE_PRODUCT, SELECT_PRODUCT } from '../action/product';
import { ADD_PRODUCT } from '../action/product';
import { UPDATE_PRODUCT } from '../action/product';
import Product from '../../model/product';

initialState = {
    availableProducts:[],
    userProducts:[]
}

export default (state=initialState,actions) => {
    switch(actions.type) {
        case SELECT_PRODUCT:
            return {
                availableProducts:actions.products,
                userProducts:actions.userProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts:state.userProducts.filter(prod => prod.id!==actions.id),
                availableProducts:state.availableProducts.filter(prod => prod.id!==actions.id)
            }
        case ADD_PRODUCT:
        console.log('new product');
            const newProduct = new Product(
                actions.prodData.id,
                actions.prodData.ownerId,
                actions.prodData.title,
                actions.prodData.imageUrl,
                actions.prodData.desc,
                actions.prodData.price
            );

            return {
                ...state,
                userProducts:state.userProducts.concat(newProduct),
                availableProducts:state.availableProducts.concat(newProduct)
            }
        case UPDATE_PRODUCT:
            const updatedIndex = state.userProducts.findIndex(prod => prod.id === actions.pid);
            const updatedProduct = new Product(
                actions.pid,
                state.userProducts[updatedIndex].ownerId,
                actions.prodData.title,
                actions.prodData.imageUrl,
                actions.prodData.desc,
                state.userProducts[updatedIndex].price
            );

            const updatedUserProducts = [...state.userProducts]
            updatedUserProducts[updatedIndex] = updatedProduct;

            const availIndex = state.availableProducts.findIndex(prod=>prod.id === actions.pid);
            const updatedAvailableProducts = [...state.availableProducts]
            updatedAvailableProducts[availIndex] = updatedProduct

            return {
                ...state,
                userProducts:updatedUserProducts,
                availableProducts:updatedAvailableProducts
            }
    }
    return state;
}