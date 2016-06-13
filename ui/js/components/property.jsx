import React, {Component} from 'react';
import store from '../../../shared/store/store';
import {addProperty, deleteProperty, updateValue} from '../../../shared/actions';

class Property extends Component {
  constructor(props){
    super(props);
    this.state = {value: props.propValue};
    this.changeValue = this.changeValue.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
  }
  changeValue(e){
    this.setState(Object.assign({}, this.state, {value: e.target.value}));
  }
  updateValue(e){
    e.preventDefault();
    store.dispatch(updateValue(this.props.productName, this.props.propKey, this.props.propValue));
  }
  deleteProperty(){
    store.dispatch(deleteProperty(this.props.productName, this.props.propKey));
  }
  render(){
    return (
      <form className='property' onSubmit={this.updateValue}>
        <div className='prop-key'>{this.props.propKey}</div>
        <div className='prop-value'>
          <input type='text' value={this.state.value} onChange={this.changeValue}/>
        </div>
        <div className='delete' onClick={this.deleteProperty}>X</div>
      </form>);
  }
}

export default Property;
