import {
  InflatableConfiguration,
  Configuration
} from '../../../server/config';
import {expect} from 'chai';
import _ from 'lodash';
module.exports = function(){

  this.Given(/an uninflated import named {(.*)}/, function(uninflatedConfigName){
    this.existingImportKeys = this.existingImportKeys || [];
    this.existingImportKeys = [...this.existingImportKeys, uninflatedConfigName];
  });

  this.Given(/an existing inflatable configuration file named {(.*)}/, function(inflatableConfigurationName){
    const version = this.existingVersion || '0.0.0';
    const testInflater = (configKey) => {
      const configName = configKey.replace(/@.*\..*\..*$/, '');
      return this.existingConfigurations[configName];
    };
    const TestInflatableConfiguration = InflatableConfiguration.bind(null, testInflater);
    const newConfig = new TestInflatableConfiguration(inflatableConfigurationName, version, this.existingProperties, this.existingImportKeys);
    this.existingInflatableConfiguration = newConfig;
    this.existingInflatableConfigurations = Object.assign({}, this.existingInflatableConfigurations, {
      [inflatableConfigurationName]: newConfig
    });
  });

  this.When(/I inflate the configuration/, function(){
    try {
      const newUninflatableConfig = this.existingInflatableConfiguration.inflate();
      this.configuration = newUninflatableConfig;
    } catch (error){
      this.error = error;
    }
  });

  this.Then(/the import of {(.*)} should contain a property called {(.*)} with a value of {(.*)}/, function(importName, propertyName, propertyValue){
    const imports = this.configuration.imports;
    const configImport = imports.find( currentImport => currentImport.name === importName);
    expect(configImport).to.exist;
    expect(_.get(configImport, `properties.${propertyName}`)).to.equal(propertyValue);
  });

  this.Then(/the import of {(.*)} should be the {(.*)}.. import/, function(importName, positionString){
    const position = parseInt(positionString, 10);
    this.configuration.imports.forEach( (configImport, index) => {
      if(configImport.name === importName){
        expect(index).to.equal(position - 1);
      }
    });
  });

  this.Then(/the configuration should not be inflatable/, function(){
    expect(this.configuration).to.be.instanceOf(Configuration);
    expect(this.configuration).not.be.instanceOf(InflatableConfiguration);
  });
};
