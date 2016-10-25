import {
  Configuration
} from '../../../server/config';
import {
  expect
} from 'chai';
import _ from 'lodash';

module.exports = function() {
  this.Given(/an application name of {(.*)}/, function(appName) {
    this.existingAppName = appName;
  });

  this.Given(/^a property called {(.*)} with a value of {(.*)}$/, function(propertyName, propertyValue) {
    this.existingProperties = _.merge({}, this.existingProperties, {
      [propertyName]: propertyValue
    });
  });

  this.Given(/an existing configuration file named {(.*)}/, function(newConfigName) {
    const newConfig = new Configuration(newConfigName, this.existingProperties, '0.0.0', this.existingImports);
    this.existingConfiguration = newConfig;
    this.existingConfigurations = Object.assign({}, this.existingConfigurations, {
      [newConfigName]: newConfig
    });
  });

  this.Given(/an imported configuration file of {(.*)}/, function(importedName){
    this.existingImports = this.existingImports || [];
    const newImport = _.get(this.existingConfigurations, importedName);
    this.existingImports = [...this.existingImports, newImport];
  });

  this.Given(/an empty configuration file named {(.*)}/, function(newConfigName) {
    const newConfig = new Configuration(newConfigName);
    this.existingConfiguration = newConfig;
    this.existingConfigurations = Object.assign({}, this.existingConfigurations, {
      [newConfigName]: newConfig
    });
  });

  this.When(/I create a configuration file/, function() {
    this.configuration = new Configuration(this.existingAppName, this.existingProperties);
  });

  // this.When(/I import {(.*)} inside the {(.*)} configuration file/, function(dependencyName, currentConfigName){
  //   const dependency = this.existingConfigurations[dependencyName];
  //   const currentConfig = this.existingConfigurations[currentConfigName];
  //   const newConfig = currentConfig.addImport(dependency);
  // });

  this.When(/I add a property called {(.*)} with a value of {(.*)}/, function(newPropertyName, newPropertyValue){
    this.configuration = this.existingConfiguration.setProperty(newPropertyName, newPropertyValue);
  });

  this.When(/I delete a property called {(.*)}/, function(propertyPath){
    this.configuration = this.existingConfiguration.deleteProperty(propertyPath);
  });

  this.When(/I flatten the config/, function(){
    this.flattenedConfig = this.existingConfiguration.flatten();
  });

  this.When(/I import {(.*)} inside the {(.*)} configuration file/, function(importName, testFile){
    const configToImport = _.get(this.existingConfigurations, importName);
    const testConfig = _.get(this.existingConfigurations, testFile);
    this.configuration = testConfig.addImport(configToImport);
  });

  this.Then(/a configuration file should be created/, function() {
    expect(this.configuration).to.exist;
    expect(this.configuration).to.be.instanceOf(Configuration);
  });

  this.Then(/the configuration file should be named {(.*)}/, function(expectedConfigName) {
    expect(this.configuration.name).to.equal(expectedConfigName);
  });

  this.Then(/the configuration file should have a property called {(.*)} with a value of {(.*)}/, function(propertyName, propertyValue){
    expect(_.get(this.configuration.properties, propertyName)).to.exist;
    expect(_.get(this.configuration.properties, propertyName)).to.equal(propertyValue);
  });

  this.Then(/the configuration file should not have a property called {(.*)}/, function(propertyName){
    expect(_.get(this.configuration.properties, propertyName)).not.to.exist;
  });

  this.Then(/the configuration version should be {(.*)}/, function(expectedVersion){
    expect(_.get(this.configuration, 'version')).equal(expectedVersion);
  });

  this.Then(/the flattened file should have a property called {(.*)} with a value of {(.*)}/, function(expectedPropertyName, expectedPropertyValue){
    expect(_.get(this.flattenedConfig, expectedPropertyName)).to.equal(expectedPropertyValue);
  });

  this.Then(/the configuration should have an import of {(.*)} with a version of {(.*)}/, function(expectedImportName, expectedImportVersion){
    const actualImport = this.configuration.imports.find(configImport => configImport.name === expectedImportName);
    expect(actualImport).to.exist;
    expect(actualImport.version).to.equal(expectedImportVersion);
  });
};
