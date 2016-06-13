import React, {Component} from 'react';
import {connect} from 'react-redux';
import { browserHistory, Link} from 'react-router';
import {addProduct} from '../../../shared/actions';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {newProduct: ''};
    this.changeNewProduct = this.changeNewProduct.bind(this);
    this.addNewProduct = this.addNewProduct.bind(this);
  }
  changeNewProduct(e){
    this.setState(Object.assign({}, this.state, {newProduct: e.target.value}));
  }
  addNewProduct(e){
    e.preventDefault();
    console.log(this.state.newProduct);
    this.props.dispatch(addProduct(this.state.newProduct, false, false));
  }
  render(){
    const products = this.props.products.map(product => (
      <Link to={`/product/${product.name}`} key={product.name}>
        <div className='product'>
          <div className='product-name'>{product.name}</div>
          <div className='config-version'>{product.version}</div>
          <div className='product-private'>{`${product.private}`}</div>
          <div className='product-encrypted'>{`${product.encrypted}`}</div>
        </div>
      </Link>
    ));
    return (
      <main className='confused'>
        <div>Choose a Prouduct to Work With</div>
        <form onSubmit={this.addNewProduct}>
          <input type='search' placeholder='New Product' value={this.state.newProduct} onChange={this.changeNewProduct}/>
        </form>
        <div className='product-list'>
          <div className='product-header product'>
            <div className=''>Name</div>
            <div className=''>Config Version</div>
            <div className=''>Private</div>
            <div className=''>Encrypted</div>
          </div>
          {products}
        </div>
      </main>);
  }
}

const selector = state => state;

export default connect(selector)(App);
