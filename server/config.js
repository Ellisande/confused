import _ from 'lodash';
import semver from 'semver';

const flatten = (object, prefix) => {
  const keys = Object.keys(object);
  if(!_.isEmpty(keys) && typeof object !== 'string'){
    return _.flatten(keys.map( key => flatten(_.get(object, key), !prefix ? key : prefix + '.' + key)));
  }
  return prefix || '';
};

class Configuration {
  constructor(configName, properties = {}, initialVersion = '0.0.0', imports = []){
    if(_.isEmpty(configName)){
      throw new Error('A configuration file must have a name defined.');
    }
    this.name = configName;
    this.properties = Object.assign({}, properties);
    this.imports = [...imports];
    this.importKeys = imports.map( configImport => `${configImport.name}@${configImport.version}`);
    this.version = initialVersion;
  }
  addImport(config){
    if(_.includes(this.imports, config)){
      throw new Error('You can\'t import a second config with the same name');
    }
    return new Configuration(this.name, this.properties, this.version, [...this.imports, config]);
  }
  setProperty(path, value){
    const properties = Object.assign({}, this.properties);
    const exists = _.get(properties, path);
    _.set(properties, path, value);
    const newVersion = exists ? semver.inc(this.version, 'patch') : semver.inc(this.version, 'minor');
    return new Configuration(this.name, properties, newVersion, this.imports);
  }
  deleteProperty(path){
    const properties = Object.assign({}, this.properties);
    _.unset(properties, path);
    const newVersion = semver.inc(this.version, 'major');
    return new Configuration(this.name, properties, newVersion, this.imports);
  }
  validate(){
    const flattenedImports = this.imports.reduce( (configMap, configImport) => {
      const key = configImport.name;
      return Object.assign({}, configMap, {[key]: flatten(configImport.properties)});
    }, {});
    const keysToValidate = Object.keys(flattenedImports);
    const validationErrors = keysToValidate.reduce( (errors, primeKey) => {
      const current = flattenedImports[primeKey];
      const omitted = _.omit(flattenedImports, primeKey);
      const mapped = _.flatten(_.toArray(omitted));
      const intersection = _.intersection(current, mapped);
      if(!_.isEmpty(intersection)){
        return Object.assign({}, errors, {[primeKey]: intersection});
      }
      return errors;
    }, {});
    //Filter out any errors that are explici
    return _.isEmpty(validationErrors) ? undefined : validationErrors;
  }
  flatten(){
    const composedProps = this.imports.map( configImport => configImport.properties);
    const composed = Object.assign({}, ...composedProps, this.properties);
    return composed;
  };
}

class InflatableConfiguration extends Configuration {
  constructor(inflater, configName, version, properties = {}, importKeys = []){
    super(configName, properties, version, []);
    //maybe don't need to take in props?
    this.inflatable = true;
    this.inflater = inflater;
    this.importKeys = importKeys;
  }
  inflate(){
    if(!_.isEmpty(this.imports)){
      return Object.assign({}, this);
    }
    const imports = this.importKeys.map( importKey => this.inflater(importKey));
    const notAllInflated = imports.some( configImport => configImport instanceof InflatableConfiguration);
    if(notAllInflated){
      throw new Error('Could not correctly inflate the dependency tree.');
    }
    return new Configuration(this.name, this.properties, this.version, imports);
  }
  setInflater(inflater){
    return new InflatableConfiguration(inflater, this.name, this.version, this.properties, this.importKeys);
  }
}

export {
  Configuration,
  InflatableConfiguration
};
export default Configuration;
