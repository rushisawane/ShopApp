import Product from "../../model/product";

export const DELETE_PRODUCT = "DELETE PRODUCT";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SELECT_PRODUCT = "SELECT_PRODUCT";

export const deleteProduct = id => {
    return async (dispatch,getState) => {
      const token = getState().auth.token;
        const response = await fetch(`https://shopapp-43c5a.firebaseio.com/products/${id}.json?auth=${token}`,{
            method:'DELETE'
        })

        if(!response.ok) {
            throw Error('Something went weong.');
        }

        dispatch({
            type: DELETE_PRODUCT,
            id: id
          });
    }
};

export const selectProduct = () => {
  return async (dispatch,getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch("https://shopapp-43c5a.firebaseio.com/products.json");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await response.json();

      const loadedData = [];

      for (const key in resData) {
        loadedData.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].desc,
            resData[key].price
          )
        );
      }

      dispatch({
        type: "SELECT_PRODUCT",
        products: loadedData,
        userProducts: loadedData.filter(prod=>prod.ownerId===userId)
      });
    } catch (error) {
      throw error;
    }
  };
};

export const addProduct = (title, imageUrl, desc, price) => {
  return async (dispatch,getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://shopapp-43c5a.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          imageUrl,
          desc,
          price,
          ownerId:userId
        })
      }
    );

    const resData = await response.json();
    console.log(resData);

    dispatch({
      type: ADD_PRODUCT,
      prodData: {
        id: resData.name,
        title,
        imageUrl,
        desc,
        price,
        ownerId:userId
      }
    });
  };
};

export const updateProduct = (id, title, imageUrl, desc) => {
  console.log(id);
    return async (dispatch,getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://shopapp-43c5a.firebaseio.com/products/${id}.json?auth=${token}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                title,
                imageUrl,
                desc
            })
        })

        const resData = await response.json();
        console.log('update',resData);

        if(!response.ok) {
            throw Error('Something went weong.');
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            prodData: {
              title,
              imageUrl,
              desc
            }
          });
    }
 
};
