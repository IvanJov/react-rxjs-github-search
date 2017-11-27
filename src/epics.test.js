import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { FETCH_USER, FETCH_USER_FAILED, FETCH_USER_SUCCESS } from './constants';
import epics from './epics';
import { fetchUser } from "./actions";
import XMLHttpRequest from 'xhr2';
global.XMLHttpRequest = XMLHttpRequest;

const epicMiddleware  = createEpicMiddleware(epics);
const mockStore = configureMockStore([epicMiddleware]);

describe('fetchUser', () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  })

  afterEach(() => {
    nock.cleanAll();
    epicMiddleware.replaceEpic(epics);
  })

  it('returns user from github', done => {
    const payload = { username: 'user' };
    nock('https://api.github.com')
      .get('/users/user')
      .reply(200, payload);

    const expectedActions = [
      { type: FETCH_USER, payload },
      { type: FETCH_USER_SUCCESS, "payload": {"user": {"username": "user"} } }
    ];

    store.subscribe(() => {
      const actions = store.getActions();
      if (actions.length === expectedActions.length) {
        expect(actions).toEqual(expectedActions);
        done();
      }
    });

    store.dispatch(fetchUser('user'));
  });

  it('handles error', done => {
    const payload = { username: 'user' };
    nock('https://api.github.com')
      .get('/users/user')
      .reply(404);

    const expectedActions = [
      { type: FETCH_USER, payload },
      { type: FETCH_USER_FAILED }
    ];

    store.subscribe(() => {
      const actions = store.getActions();
      if (actions.length === expectedActions.length){
        expect(actions).toEqual(expectedActions);
        done();
      }
    });

    store.dispatch(fetchUser('user'));
  });
});
