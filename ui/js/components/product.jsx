import React, {Component} from 'react';
import {connect} from 'react-redux';
import Property from './property';
import flat from 'flat';
import _ from 'lodash';
import {addProperty} from '../../../shared/actions';

class Product extends Component {
  constructor(props){
    super(props);
    this.state = {filter: /.*/, showJson: false};
    this.updateFilter = this.updateFilter.bind(this);
    this.changePropertyValue = this.changePropertyValue.bind(this);
    this.changePropertyKey = this.changePropertyKey.bind(this);
    this.addProperty = this.addProperty.bind(this);
    this.showJson = this.showJson.bind(this);
  }
  updateFilter(e){
    const filter = '^' + e.target.value.split().join('.*') + '.*';
    const regex = new RegExp(filter);
    const newState = Object.assign({}, this.state, {filter: regex});
    this.setState(newState);
  }
  addProperty(e){
    e.preventDefault();
    const product = this.props.products.find(p => p.name === this.props.params.productName);
    const newProperty = addProperty(product.name, this.state.newPropertyKey, this.state.newPropertyValue);
    this.props.dispatch(newProperty);
    this.setState(Object.assign({}, this.state, {newPropertyKey: '', newPropertyValue: ''}));
  }
  changePropertyKey(e){
    const newProperty = {newPropertyKey: e.target.value};
    this.setState(Object.assign({}, this.state, newProperty));
  }
  changePropertyValue(e){
    const newProperty = {newPropertyValue: e.target.value};
    this.setState(Object.assign({}, this.state, newProperty));
  }
  showJson(){
    this.setState(Object.assign({}, this.state, {showJson: !this.state.showJson}));
  }
  render(){
    const product = this.props.products.find(p => p.name === this.props.params.productName);
    const encrypted = product.encrypted ? 'Encrypted' : 'Not Encrypted';
    const flatProperties = flat(product.config);
    const filteredProps = _.pickBy(flatProperties, (propertyValue, propertyKey) => this.state.filter.test(propertyKey));
    const properties = _.map(filteredProps, (propertyValue, propertyKey) => (
      <Property key={propertyKey} propKey={propertyKey} productName={product.name} propValue={!_.isEmpty(propertyValue) ? propertyValue : ''}/>
    ));
    const showJsonStyle = this.state.showJson ? {} : {display: 'none'};
    return (
      <div>
        <div className='header'>
          <div className='product-name'>
            Product: {product.name}
          </div>
          <div className='config-version'>
            Version: {product.version}
          </div>
          <div className='product-private'>
            <label>Private</label><input type='checkbox' checked={product.private} readOnly />
          </div>
          <div className='product-ecrypted'>{encrypted}</div>
        </div>
        <div className='view'>
          <button className='view' onClick={this.showJson}>View as Json</button>
          <pre className='json-view' style={showJsonStyle}>
            {JSON.stringify(product.config, null, 2)}
          </pre>
        </div>
        <form className='add-property' onSubmit={this.addProperty}>
          <input type='text' name='property-key' value={this.state.newPropertyKey} onChange={this.changePropertyKey} placeholder='key' />
          <input type='text' name='property-value' value={this.state.newPropertyValue} onChange={this.changePropertyValue} placeholder='value' />
          <button type='submit'>Add</button>
        </form>
        <div className='search'>
          <label>Search Properties</label>
          <input type='search' onChange={this.updateFilter} placeholder='logging.logLevel'/>
        </div>
        <div className='property-list'>
          <div className='property'>
            <div className='prop-key'>Key</div>
            <div className='prop-value'>Value</div>
          </div>
          {properties}
        </div>
      </div>);
  }
}

export default connect(i=>i)(Product);
