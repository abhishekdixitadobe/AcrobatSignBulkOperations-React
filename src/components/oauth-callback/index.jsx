import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authReducer'; 

const Callback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();  

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      console.log('authCode---------', authCode);
      fetchToken(authCode);
    } else {
      navigate('/login'); // Redirect to login if no code is present
    }
  }, [navigate]);

  const fetchToken = async (authCode) => {
    try {
      const response = await fetch('/api/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authCode }),
      });
      const data = await response.json();
      
      if (data.authData.access_token) {
        dispatch(login({ token: data.authData.access_token, user: data.userData }));
        navigate('/'); // Redirect to home page
      } else {
        alert('Failed to log in. Please try again.'); // User feedback
        navigate('/login');
      }
    } catch (error) {
      console.error('Token exchange failed', error);
      alert('Failed to log in. Please try again.'); // User feedback
      navigate('/login');
    }
  };

  return <div>Loading...</div>;
};

export default Callback;
