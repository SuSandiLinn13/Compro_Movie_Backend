import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Snackbar, Alert, Typography, Link } from '@mui/material';

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password_hash: loginPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid 
      container 
      spacing={2} 
      style={{ height: '100vh', justifyContent: 'center', alignItems: 'center', overflow : 'hidden' }}
    >
      <Grid item xs={12} sm={4} md={3}> {/* Smaller width */}
        <Paper 
          elevation={3} 
          style={{ 
            padding: '20px', 
            backgroundColor: 'rgba(103, 80, 164, 0.16)', 
            color: '#fff', 
            maxWidth: '400px', 
            width: '100%',
            borderRadius: '12px',
            border: '0.2px solid #FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <form onSubmit={handleLoginSubmit}>
            <Typography variant="subtitle1" gutterBottom>
              Email
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              sx={{ backgroundColor: '#fff', borderRadius: 1, 
              '& .MuiInputBase-input': {
              color: '#1E1E1E',       },}}
            />

            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '12px' }}>
              Password
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              sx={{ backgroundColor: '#fff', borderRadius: 1, 
              '& .MuiInputBase-input': {
              color: '#1E1E1E',       },}}
            />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              style={{ marginTop: '12px' }} 
              type="submit"
            >
              Log In
            </Button>

            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth 
              style={{ marginTop: '12px' }} 
              type="submit"
            >
              Register
            </Button>

            <Typography 
              align="left" 
              style={{ marginTop: '50px' }}
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

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
