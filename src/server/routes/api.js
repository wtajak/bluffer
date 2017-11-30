import express from 'express';
import winston from 'winston';
import bodyParser from 'body-parser';

export default (cacheStore) => {
  const router = express.Router();

  router.use('*', bodyParser.json({ limit: '5mb' }));

  router.post('/set-proxy-response', (req, res) => {
    const { url, responseBody } = req.body;
    winston.debug(`Setting proxy response ${url}`);

    const mockedResponse = cacheStore.mockResponse(url, responseBody);
    res.json(mockedResponse);
  });

  router.post('/delete-proxy-response', (req, res) => {
    const { url } = req.body;
    winston.debug(`Deleting proxy response ${url}`);

    cacheStore.deleteResponse(url);
    res.sendStatus(202);
  });

  return router;
};
