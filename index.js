const express = require('express');
const NestFactory = require('@nestjs/core').NestFactory;
const ExpressAdapter = require('@nestjs/platform-express').ExpressAdapter;
const AppModule = require('./app.module').AppModule;

const createServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors({
    origin: '*',
    methods: 'POST',
    preflightContinue: true,
    optionsSuccessStatus: 204,
  });
  return app.init();
};

const app = express();
let nest;

app.use(async (req, res) => {
  if (!nest) {
    nest = express();
    await createServer(nest);
  }
  return nest(req, res);
});

module.exports = app;
