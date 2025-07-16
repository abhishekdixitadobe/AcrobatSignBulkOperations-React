import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authReducer'; 
import { ToastQueue } from '@react-spectrum/toast';

const IntegrationKeyCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();  

  useEffect(() => {
    fetchToken();
  }, [navigate]);

  const fetchToken = async () => {
    try {
      const response = await fetch('/api/integration-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      
      if (data.userData) {
        ToastQueue.positive("Logged In Successfully!!", { timeout: 5000 });
        dispatch(login({ token: data.authData, user: data.userData }));
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

export default IntegrationKeyCallback;
