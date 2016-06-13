const addProperty = (productName, key, value) => {
  return {
    type: 'ADD_PROPERTY',
    productName,
    key,
    value
  };
};

const deleteProperty = (productName, key) => {
  return {
    type: 'DELETE_PROPERTY',
    productName,
    key
  };
};

const updateValue = (productName, key, value) => {
  return {
    type: 'UPDATE_VALUE',
    productName,
    key,
    value
  };
};

const addProduct = (productName, privateProduct, encrypted) => {
  return {
    type: 'ADD_PRODUCT',
    productName,
    private: privateProduct,
    encrypted
  };
};

export {
  addProperty,
  deleteProperty,
  updateValue,
  addProduct
};
