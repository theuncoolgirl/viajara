import axiosInstance from "../axiosApi";

const SET_ERRORS = 'viajara/session/SET_ERRORS';

const setErrors = errors => ({ type: SET_ERRORS, errors });

export const actions = {
    setErrors
}

const login = (username, password) => {
    return async dispatch => {
        const response = await axiosInstance.post('/token/obtain/',
            { username: username, password: password }
        );
        if (response.status === 401) {
            let errors = await response.json()
            dispatch(setErrors(errors))
        } else {
            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            window.location.href = "/map/"
            return response
        }
    }
}

const logout = () => {
    return async dispatch => {
        try {
            const response = await axiosInstance.post('/blacklist/',
                { "refresh_token": localStorage.getItem("refresh_token") }
            );
            console.log("LOGOUT RESPONSE: ", response)
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            return response;
        } catch (e) {
            console.log(e);
        }
    }
}

const signup = (first_name, last_name, username, email, password) => {
    return async dispatch => {
        console.log("hitting signup thunk");
        const response = await axiosInstance.post('/user/create/',
            {
                first_name: first_name,
                last_name: last_name,
                username: username,
                email: email,
                password: password
            }
        );
        if (response.status === 401 || response.status === 400) {
            let errors = await response.json()
            dispatch(setErrors(errors))
        } else {
            console.log("SIGNUP response: ", response)
            window.location.href = "/login/"
            return response
        }

    }
}

// other error handling - maybe refactor in future
//     } catch (error) {
//         console.log(error.stack);
//         this.setState({
//             errors: error.response.data
//         });
//     }
// }

export const thunks = {
    login,
    logout,
    signup
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET_ERRORS:
            return {
                ...state,
                errors: action.errors
            }
        default:
            return state;
    }
}