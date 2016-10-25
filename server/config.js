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
    this.name = configName;
    this.properties = Object.assign({}, properties);
    this.imports = [...imports];
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
    const flattenedImports = _.mapValues(this.imports, (configImport, key) => {
      return flatten(configImport, key);
    });
    const mergedImports = _.merge({}, ...flattenedImports);
    const errors = _.mapValues(this.imports, (configImport, key) => {
      // const matchingKey = _.findBy(merged)
    });
    return flattenedImports;
  }
  flatten(){
    const composedProps = this.imports.map( configImport => configImport.properties);
    const composed = Object.assign({}, ...composedProps, this.properties);
    return composed;
  };
}

export {
  Configuration
};
export default Configuration;
