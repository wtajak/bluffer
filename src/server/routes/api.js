import express from 'express';
import bodyParser from 'body-parser';

import logger from '../logger';

export default (dataStore) => {
  const router = express.Router();

  router.use('*', bodyParser.json({ limit: '5mb' }));

  router.get('/get-mock-response', (req, res) => {
    logger.debug(`Getting mock response ${req.query.selectedProxy} ${req.query.url}`);
    const mockResponse = dataStore.getMock(req.query.selectedProxy, req.query.url);
    if (!mockResponse) {
      return res.sendStatus(404);
    }
    res.json(mockResponse.responseBody);
  });

  router.post('/set-mock', (req, res) => {
    const {
      proxyId,
      url,
      responseBody,
      httpMethod,
      contentType,
    } = req.body;
    logger.debug(`Setting proxy response ${proxyId} ${url}`);

    const mockedResponse = dataStore.mockResponse(proxyId, url, responseBody, httpMethod, contentType);
    res.json(mockedResponse);
  });

  router.post('/delete-mock', (req, res) => {
    const { url, proxyId } = req.body;
    logger.debug(`Deleting proxy response ${proxyId} ${url}`);

    dataStore.deleteMock(proxyId, url);
    res.sendStatus(202);
  });

  router.post('/delete-all-logs', (req, res) => {
    const { proxyId } = req.body;
    logger.debug(`Deleting all logged responses for proxy ${proxyId}`);

    dataStore.deleteAllLogs(proxyId);
    res.sendStatus(202);
  });

  router.post('/delete-all-mocks', (req, res) => {
    const { proxyId } = req.body;
    logger.debug(`Deleting all mocked responses ${proxyId}`);

    dataStore.deleteAllMocks(proxyId);
    res.sendStatus(202);
  });

  return router;
};
