import axios from 'axios';
import {
    SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, MARK_NOTIFICATIONS_READ,
    SET_UNAUTHENTICATED, LOADING_USER
} from '../types';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });

    axios.post("/login", userData)
        .then(res => {
            setAuthorizationToken(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push("/");
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            });
        })
}


export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });

    axios.post("/signup", newUserData)
        .then(res => {
            setAuthorizationToken(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push("/");
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            });
        })
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
}

export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => { console.log(err); })
}

const setAuthorizationToken = (token) => {
    const FBtoken = `Bearer ${token}`;
    localStorage.setItem("FBIdToken", FBtoken);
    axios.defaults.headers.common['Authorization'] = FBtoken;
}

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post("/user/image", formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch(err => console.log(err));
}

export const editUserDetails = (userDetail) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post("/user", userDetail)
        .then(() => {
            dispatch(getUserData())
        })
        .catch(err => console.log(err));
}

export const markNotificationsRead = (notificationsIds) => (dispatch) => {
    axios.post('/notifications', notificationsIds)
        .then(res => {
            dispatch({
                type: MARK_NOTIFICATIONS_READ,
            })
        })
        .catch(err => console.log(err));
}