"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Grid, Paper, Snackbar, Alert, Typography } from '@mui/material';

export default function Register() {
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  // Error states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  // Form validation
  const validateInputs = () => {
    let isValid = true;

    // Username validation
    if (!form.username) {
      setUsernameError(true);
      setUsernameErrorMessage("Please enter your username.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // Password validation
    if (!form.password || form.password.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 4 characters.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Email validation
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    return isValid;
  };

  const handleInputChange = (field) => (e) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate the form inputs
    if (!validateInputs()) return;

    try {
      // Make API request for registration
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          email: form.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    } catch (err) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSnackbarClose = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Grid 
      container 
      style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        margin: 0,
        padding: '0px' // Reduced padding
      }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper 
          elevation={3} 
          style={{ 
            padding: '20px', 
            backgroundColor: 'rgba(103, 80, 164, 0.16)', 
            color: '#fff', 
            width: '100%',
            borderRadius: '12px',
            border: '0.2px solid #FFFFFF',
            boxSizing: 'border-box',
            margin: '10px 0' // Reduced margin
          }}
        >
          <Typography variant="h5" gutterBottom align="center" style={{ marginBottom: '15px' }}>
            Create Account
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <Typography variant="subtitle1" gutterBottom style={{ marginBottom: '5px' }}>
              Username          
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="text"
              value={form.username}
              onChange={handleInputChange('username')}
              error={usernameError}
              helperText={usernameErrorMessage}
              sx={{ 
                backgroundColor: '#fff', 
                borderRadius: 1, 
                '& .MuiInputBase-input': {
                  color: '#1E1E1E',
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                  marginLeft: 0
                }
              }}
            />

            {/* Email Field */}
            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '8px', marginBottom: '5px' }}>
              Email          
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="email"
              value={form.email}
              onChange={handleInputChange('email')}
              error={emailError}
              helperText={emailErrorMessage}
              sx={{ 
                backgroundColor: '#fff', 
                borderRadius: 1, 
                '& .MuiInputBase-input': {
                  color: '#1E1E1E',
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                  marginLeft: 0
                }
              }}
            />

            {/* Password Field */}
            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '8px', marginBottom: '5px' }}>
              Password          
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="password"
              value={form.password}
              onChange={handleInputChange('password')}
              error={passwordError}
              helperText={passwordErrorMessage}
              sx={{ 
                backgroundColor: '#fff', 
                borderRadius: 1, 
                '& .MuiInputBase-input': {
                  color: '#1E1E1E',
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                  marginLeft: 0
                }
              }}
            />

            {/* Register Button */}
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              style={{ 
                marginTop: '15px', // Reduced from 20px
                backgroundColor: '#6750A4',
                color: '#fff'
              }} 
              type="submit"
            >
              Register
            </Button>
          </form>

          {/* Sign in link */}
          <Typography variant="body2" align="center" style={{ marginTop: '12px' }}>
            Already have an account?{' '}
            <span 
              style={{ 
                color: '#6750A4', 
                cursor: 'pointer', 
                textDecoration: 'underline',
                fontWeight: 'bold'
              }}
              onClick={() => router.push('/login')}
            >
              Sign in
            </span>
          </Typography>
        </Paper>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={!!error || !!success} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Grid>
  );
}