// actions/authActions.js
export const loginSuccess = (token, user) => ({
    type: 'LOGIN_SUCCESS',
    payload: { token, user },
  });
  
  export const logout = () => {
    return (dispatch) => {
      // Optionally clear the token from localStorage/sessionStorage if stored
      localStorage.removeItem('token');  // Or sessionStorage.removeItem('token');
      
      // Dispatch the LOGOUT action
      dispatch({ type: 'LOGOUT' });
    };
  };
  