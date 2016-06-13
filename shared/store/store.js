import {
  createStore,
  combineReducers
} from 'redux';
import _ from 'lodash';
import {replace} from './utils';
import semver from 'semver';

const productsReducer = (products = [{
  name: 'Note & Vote',
  version: '1.0.0',
  private: false,
  encrypted: true,
  config: {
    logging: {
      logLevel: 'debug'
    },
    paypal: {
      client: {
        connection: {
          secret: 'absdfa'
        }
      }
    }
  }
}], action) => {
  if(action.type === 'ADD_PRODUCT'){
    return [...products, {name: action.productName, version: '1.0.0', private: false, encrypted: false, config: {}}];
  }
  if(action.type === 'ADD_PROPERTY'){
    const targetProduct = products.find(product => action.productName === product.name);
    const oldConfig = targetProduct.config;
    const newConfig = Object.assign({}, oldConfig);
    _.set(newConfig, action.key, action.value);
    const newProduct = Object.assign({}, targetProduct, {config: newConfig});
    newProduct.version = semver.inc(newProduct.version, 'minor');
    return replace(products, targetProduct, newProduct);
  }
  if(action.type === 'DELETE_PROPERTY'){
    const targetProduct = products.find(product => action.productName === product.name);
    const oldConfig = targetProduct.config;
    const newConfig = Object.assign({}, oldConfig);
    _.unset(newConfig, action.key);
    const newProduct = Object.assign({}, targetProduct, {config: newConfig});
    newProduct.version = semver.inc(newProduct.version, 'major');
    return replace(products, targetProduct, newProduct);
  }
  if(action.type === 'UPDATE_VALUE'){
    const targetProduct = products.find(product => action.productName === product.name);
    const oldConfig = targetProduct.config;
    const newConfig = Object.assign({}, oldConfig);
    _.set(newConfig, action.key, action.value);
    const newProduct = Object.assign({}, targetProduct, {config: newConfig});
    newProduct.version = semver.inc(newProduct.version, 'patch');
    return replace(products, targetProduct, newProduct);
  }
  return products;
};

let reducers = combineReducers({
  products: productsReducer
});

const attachDevTools = () => {
  return window.devToolsExtension ? window.devToolsExtension() : undefined;
};
let store = createStore(reducers, {}, process.title === 'browser' ? attachDevTools() : undefined);

const createNewStore = createStore.bind(this, reducers);
export {createNewStore as createStore};
export default store;
