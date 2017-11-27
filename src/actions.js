import { FETCH_USER, FETCH_USER_SUCCESS, FETCH_USER_FAILED } from './constants';

export const fetchUser = username => ({
  type: FETCH_USER,
  payload: { username }
});

export const fetchUserSuccess = user => ({
  type: FETCH_USER_SUCCESS,
  payload: { user }
});

export const fetchUserFailed = () => ({
  type: FETCH_USER_FAILED
});
