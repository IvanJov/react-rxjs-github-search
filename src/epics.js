import 'rxjs';
import { combineEpics, ofType } from 'redux-observable';
import { FETCH_USER } from './constants';
import { fetchUserSuccess, fetchUserFailed } from './actions';
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, mergeMap, catchError, retry } from 'rxjs/operators';

/*
export const fetchUser = actions$ =>
  actions$
    .ofType(FETCH_USER)
    .mergeMap(action =>
      ajax.getJSON(`https://api.github.com/users/${action.payload.username}`)
        .map(user => fetchUserSuccess(user))
        .takeUntil(actions$.ofType(FETCH_USER))
        .retry(2)
        .catch(error => Observable.of(fetchUserFailed()))
    );
*/

const fetchUser = action$ =>
    action$.pipe(
        ofType(FETCH_USER),
        mergeMap(action =>
            ajax(`https://api.github.com/users/${action.payload.username}`).pipe(
                map(user => fetchUserSuccess(user)),
                retry(2),
                catchError(error => of(fetchUserFailed()))
            )
        )
    );

export default combineEpics(
  fetchUser
);