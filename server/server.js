import express from 'express';
import Configuration from './config';
import bodyParser from 'body-parser';
import DataStorage from './data/inMemory';
import MetadataStorage from './metadata/inMemory';

const createServer = () => {
  const app = express();
  const dataStorage = new DataStorage();
  const metadataStorage = new MetadataStorage();

  const inflate = (config, version) => {
    const props = dataStorage.getProperties(config);
    const metadata = metadataStorage.getMetadata(config, version);
    if(!metadata){
      throw new Error(`No configs exist with the provided version: ${config}@${version}`)
    }
    
  };

  app.use(express.static('assets'));
  app.use(bodyParser.json());
  app.get('/app/*', (req, res) => res.sendFile(`${process.cwd()}/assets/index.html`));
  // app.get('/config/:name', (req, res) => {
  //   const newConfig = new Configuration(req.params.name);
  //   res.send(newConfig);
  // });
  app.get('/config/create/:name', (req, res) => {
    const newConfig = new Configuration(req.params.name);
    res.send(newConfig);
  });
  app.post('/config/:name', (req, res) => {
    const newConfig = new Configuration(req.params.name);
    res.send(newConfig);
  });
  app.put('/config/:name', (req, res) => {
    const newConfig = new Configuration('newOne', {stuff: 'otherThings'});
    const {propertyName, propertyValue} = req.body;
    console.log('Things that stuff are', propertyName, propertyValue);
    const updatedConfig = newConfig.setProperty(req.body.propertyName, req.body.propertyValue);
    return res.send(updatedConfig);
  });
  return app;
};

export {createServer};
