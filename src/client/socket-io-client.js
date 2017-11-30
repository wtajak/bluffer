import { eventChannel } from 'redux-saga';
import { put, call, cancelled, take } from 'redux-saga/effects';
import io from 'socket.io-client';

import { RESPONSE_LOGGED } from '../common/modules/proxy/constants';
import { DISPLAY_ERROR } from '../common/modules/meta/constants';

const socket = io('', { path: '/api/bluffer-socket' });

function registerSocket() {
  return eventChannel((emitter) => {
    socket.on('request-proxied', (data) => {
      emitter({ loggedResponse: data });
    });
    socket.on('response-from-cache', (data) => {
      emitter(data);
    });
    const unsubscribe = () => {
    };
    return unsubscribe;
  });
}

function* watchSocketEvents() {
  const socketEventHandler = yield call(registerSocket);
  const forever = true;
  try {
    while (forever) {
      const socketEventData = yield take(socketEventHandler);
      // TODO - Make not ugly
      if (socketEventData.loggedResponse) {
        yield put({ type: RESPONSE_LOGGED, payload: socketEventData.loggedResponse });
      }
      // if (socketEventData.response && socketEventData.response.lastServedCached) {
      //   yield put({ type: FLASH_RESPONSE, payload: socketEventData });
      // } else {
      // }
    }
  } catch (err) {
    if (yield cancelled()) {
      socketEventHandler.close();
    } else {
      yield put({ type: DISPLAY_ERROR, payload: `Unable to live stream proxied requests: ${err.message}` });
    }
  }
}

export default function* sagas() {
  yield [watchSocketEvents()];
}
