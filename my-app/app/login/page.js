"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Grid, Paper, Snackbar, Alert, Typography, Link, FormControlLabel, Checkbox } from '@mui/material';
import { AuthContext } from "@/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  
  // Safety check
  if (!authContext) {
    throw new Error("AuthPage must be used within an AuthProvider");
  }
  
  const { login } = authContext;

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember_me: false,
  });

  // Error states
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

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

    return isValid;
  };

  const handleInputChange = (field) => (e) => {
    const value = field === 'remember_me' ? e.target.checked : e.target.value;
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Login submit handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    try {
      const response = await fetch('/api/users/signin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          remember_me: form.remember_me,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const token = data.access_token;
      const username = data.username;
      
      login({ token, username });
      router.push("/home");
      
    } catch (err) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("Invalid credentials or an unexpected error occurred.");
      }
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  return (
    <Grid 
      container 
      style={{ 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        margin: 0,
        padding: '20px 0'
      }}
    >
      {/* Reduced width: changed from lg={4} to lg={3} and added maxWidth */}
      <Grid item xs={12} sm={6} md={5} lg={3}>
        <Paper 
          elevation={3} 
          style={{ 
            padding: '20px', 
            backgroundColor: 'rgba(83, 26, 241, 0.16)', 
            color: '#fff', 
            width: '100%',
            maxWidth: '350px', // Added maxWidth to limit form size
            borderRadius: '12px',
            border: '0.2px solid #FFFFFF',
            boxSizing: 'border-box',
            margin: '10px auto' // Center the form
          }}
        >
          <Typography variant="h5" gutterBottom align="center" style={{ marginBottom: '15px' }}>
            Sign In
          </Typography>

          <form onSubmit={handleLoginSubmit}>
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

            {/* Remember Me Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.remember_me}
                  onChange={handleInputChange('remember_me')}
                  sx={{
                    color: '#fff',
                    '&.Mui-checked': {
                      color: '#fff',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  Remember me
                </Typography>
              }
              sx={{ marginTop: '8px', marginBottom: '8px' }}
            />

            {/* Login Button */}
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              style={{ marginTop: '15px' }} 
              type="submit"
            >
              Log In
            </Button>

            {/* Register Button */}
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth 
              style={{ marginTop: '10px' }} 
              onClick={handleRegisterRedirect}
            >
              Register
            </Button>

            <Typography 
              align="left" 
              style={{ marginTop: '30px' }}
            >
              <Link 
                href="#" 
                underline="hover" 
                sx={{ color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => alert('Forgot password clicked!')}
              >
                Forget Password?
              </Link>
            </Typography>
          </form>
        </Paper>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError("")} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Grid>
  );
}