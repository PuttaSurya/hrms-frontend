import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthRequestService } from '../services/auth-request.service.ts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ mobile: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { mobile: '', password: '' };

    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = { mobile, password };
      const response = await AuthRequestService.login(payload);
      
      if (response.status === 200 && response.token) {
        localStorage.clear();
        
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.id);
        localStorage.setItem("fullName", response.fullName);
        localStorage.setItem("mobile", response.mobile);

        const storedToken = localStorage.getItem("token");
        console.log("Token stored successfully:", !!storedToken);

        toast.success(`Welcome back, ${response.fullName}!`);

        if (localStorage.getItem("token")) {
            window.location.href = "/leave-management";    
        } else {
          throw new Error("Failed to store authentication token");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1.5rem'
        }}>Login to your account</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="mobile" style={labelStyle}>Mobile Number</label>
            <input
              id="mobile"
              type="text"
              placeholder="Enter your 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={inputStyle}
            />
            {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={buttonStyle}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none' }}>
            Don't have an account? Register
          </Link>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '0.5rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '4px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem',
   marginBottom: '0.5rem'
};

const buttonStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#001F54',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '0.5rem',
  marginBottom: '0.5rem'
};

const errorStyle = {
  color: 'red',
  fontSize: '0.75rem',
  marginTop: '0.25rem'
};

export default Login;