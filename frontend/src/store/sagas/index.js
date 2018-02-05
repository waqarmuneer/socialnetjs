import {takeEvery} from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import * as userSagas from './user';
import * as postSagas from './post';

export function* watchAuth()
{
    yield takeEvery(actionTypes.AUTH_USER , userSagas.authUserSaga);
    yield takeEvery(actionTypes.REGISTER_USER , userSagas.registerUserSaga);
    yield takeEvery(actionTypes.USER_LOGOUT , userSagas.logoutUserSaga);
}
export function* watchPost()
{
    yield takeEvery(actionTypes.POST_STATUS , postSagas.postStatusSaga);    
}