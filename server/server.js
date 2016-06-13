import express from 'express';
import _ from 'lodash';

const createServer = () => {
  const app = express();

  app.use(express.static('assets'));
  app.get('/*', (req, res) => res.sendFile(`${process.cwd()}/assets/index.html`));
  return app;
};

export {createServer};
