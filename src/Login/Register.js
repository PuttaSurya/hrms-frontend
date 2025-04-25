import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthRequestService } from '../services/auth-request.service.ts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ fullName: '', mobile: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: '', mobile: '', password: '' };

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

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
      const response = await AuthRequestService.register({ fullName, mobile, password });
      console.log('Registration successful', response);
      setIsLoading(false);
      toast.success('Registration successful. You can now login to your account.', {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } catch (error) {
      console.log('Backend error:', error);  
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      setIsLoading(false);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={containerStyle}>
        <div style={formContainerStyle}>
          <h2 style={headingStyle}>Register a new account</h2>
          <form onSubmit={handleSubmit}>
            <div style={fieldContainerStyle}>
              <label htmlFor="fullName" style={labelStyle}>Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
              />
              {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
            </div>
            <div style={fieldContainerStyle}>
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
            <div style={fieldContainerStyle}>
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
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div style={loginLinkContainerStyle}>
            <Link to="/login" style={loginLinkStyle}>
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f3f4f6',
  padding: '1rem'
};

const formContainerStyle = {
  maxWidth: '400px',
  width: '100%',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '1.5rem'
};

const headingStyle = {
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#111827',
  marginBottom: '1rem'
};

const fieldContainerStyle = {
  marginBottom: '0.75rem'
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.25rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151'
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #d1d5db',
  fontSize: '0.875rem'
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
  marginTop: '0.5rem'
};

const errorStyle = {
  color: 'red',
  fontSize: '0.75rem',
  marginTop: '0.25rem'
};

const loginLinkContainerStyle = {
  textAlign: 'center',
  marginTop: '1rem'
};

const loginLinkStyle = {
  color: '#4f46e5',
  textDecoration: 'none',
  fontSize: '0.875rem'
};

export default Register;