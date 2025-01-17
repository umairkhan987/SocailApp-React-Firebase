import {
    SET_SCREAMS, LOADING_DATA, LOADING_UI, SET_ERRORS, CLEAR_ERRORS, SUBMIT_COMMENT,
    LIKE_SCREAM, UNLIKE_SCREAM, DELETE_SCREAM, POST_SCREAM, SET_SCREAM, STOP_LOADING_UI
} from "../types";
import axios from "axios";

// get all the screams
export const getScreams = () => dispatch => {
    dispatch({ type: LOADING_DATA });

    axios.get("/screams")
        .then((res) => {
            dispatch({
                type: SET_SCREAMS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_SCREAMS,
                payload: []
            })
        });
}

// post a scream
export const postScream = (newScream) => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
    dispatch({ type: LOADING_UI });
    axios.post("/scream", newScream)
        .then(res => {
            dispatch({
                type: POST_SCREAM,
                payload: res.data
            })
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            console.log(err.response.data);
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            })
        })
}
// get signle scream
export const getScream = (screamId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.get(`/scream/${screamId}`)
        .then((res) => {
            dispatch({
                type: SET_SCREAM,
                payload: res.data,
            })
            dispatch({ type: STOP_LOADING_UI })
        })
        .catch(err => console.log(err));
}

// like a scream
export const likeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_SCREAM,
                payload: res.data,
            })
        })
        .catch(err => console.log(err));
}
// unLike a scream
export const unLikeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_SCREAM,
                payload: res.data,
            })
        })
        .catch(err => console.log(err));
}

// delete a scream
export const deleteScream = (screamId) => (dispatch) => {
    axios.delete(`/scream/${screamId}`)
        .then(() => {
            dispatch({
                type: DELETE_SCREAM,
                payload: screamId
            })
        })
        .catch(err => console.log(err))
}

// submit a comment
export const submitComment = (screamId, commentData) => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
    axios.post(`/scream/${screamId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data,
            })
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            })
        })
}

// get other user data
export const getOtherUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: SET_SCREAMS,
                payload: res.data.screams,
            })
        })
        .catch(() => {
            dispatch({
                type: SET_SCREAMS,
                payload: null,
            })
        })
}