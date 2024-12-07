import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/index.css';

const AuthButton: React.FC = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleAuth}
      className="auth-button"
    >
      {isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
};

export default AuthButton;