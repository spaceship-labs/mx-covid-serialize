// Taken from: https://github.com/imJPFeliciano/node-express-es6-airbnb/blob/master/src/index.js

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morganBody from 'morgan-body';

import config from './config';
import routes from './routes';

const app = express();
app.server = http.createServer(app);

app.use(cors());

app.use(bodyParser.json({
  limit: config.bodyLimit,
}));

if (process.env.NODE_ENV === 'development') {
  morganBody(app);
}

app.use('/api', routes);

app.server.listen(config.port);

console.log(`Started on 'http://localhost:${app.server.address().port}'`);

export default app;