// "use client";

// import React, { useState } from "react";
// import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert, IconButton, InputAdornment } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// export default function Register() {
//   const [registerName, setRegisterName] = useState('');
//   const [registerEmail, setRegisterEmail] = useState('');
//   const [registerPassword, setRegisterPassword] = useState('');
//   const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   const handleSnackbarClose = () => setOpenSnackbar(false);
//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleMouseDownPassword = (event) => event.preventDefault();

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();

//     if (registerPassword !== registerConfirmPassword) {
//       setSnackbarMessage('Passwords do not match');
//       setSnackbarSeverity('error');
//       setOpenSnackbar(true);
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8008/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: registerName,
//           email: registerEmail,
//           password: registerPassword,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Registration failed');
//       }

//       setSnackbarMessage('Registration successful!');
//       setSnackbarSeverity('success');
//       setOpenSnackbar(true);

//       // Clear form after success
//       setRegisterName('');
//       setRegisterEmail('');
//       setRegisterPassword('');
//       setRegisterConfirmPassword('');
//     } catch (error) {
//       setSnackbarMessage(error.message);
//       setSnackbarSeverity('error');
//       setOpenSnackbar(true);
//     }
//   };

//   return (
//     <Grid container spacing={2} style={{ height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E1E' }}>
//       <Grid item xs={12} sm={4} md={3}>
//         <Paper elevation={3} style={{
//           padding: '20px',
//           backgroundColor: 'rgba(103, 80, 164, 0.16)',
//           color: '#fff',
//           maxWidth: '400px',
//           width: '100%',
//           borderRadius: '12px',
//           border: '0.2px solid #FFFFFF',
//         }}>
//           <form onSubmit={handleRegisterSubmit}>
//             <Typography variant="subtitle1" gutterBottom>Username</Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="dense"
//               size="small"
//               type="text"
//               value={registerName}
//               onChange={(e) => setRegisterName(e.target.value)}
//               sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
//             />

//             <Typography variant="subtitle1" gutterBottom>Email</Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="dense"
//               size="small"
//               type="email"
//               value={registerEmail}
//               onChange={(e) => setRegisterEmail(e.target.value)}
//               sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
//             />

//             <Typography variant="subtitle1" gutterBottom>Password</Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="dense"
//               size="small"
//               type={showPassword ? "text" : "password"}
//               value={registerPassword}
//               onChange={(e) => setRegisterPassword(e.target.value)}
//               sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Typography variant="subtitle1" gutterBottom>Confirm Password</Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="dense"
//               size="small"
//               type="password"
//               value={registerConfirmPassword}
//               onChange={(e) => setRegisterConfirmPassword(e.target.value)}
//               sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
//             />

//             <Button variant="contained" color="primary" fullWidth style={{ marginTop: '12px' }} type="submit">
//               Register
//             </Button>
//           </form>
//         </Paper>
//       </Grid>

//       <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// }
"use client";

import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Register() {
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const router = useRouter(); // Initialize router

  const handleSnackbarClose = () => setOpenSnackbar(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      setSnackbarMessage('Passwords do not match');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:8008/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      setSnackbarMessage('Registration successful! Redirecting to login...');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Clear form after success
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login'); // Change this to your actual login route
      }, 2000); // 2 second delay to show success message

    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid container spacing={2} style={{ height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E1E' }}>
      <Grid item xs={12} sm={4} md={3}>
        <Paper elevation={3} style={{
          padding: '20px',
          backgroundColor: 'rgba(103, 80, 164, 0.16)',
          color: '#fff',
          maxWidth: '400px',
          width: '100%',
          borderRadius: '12px',
          border: '0.2px solid #FFFFFF',
        }}>
          <Typography variant="h5" gutterBottom align="center" style={{ marginBottom: '15px' }}>
            Create Account
          </Typography>
          
          <form onSubmit={handleRegisterSubmit}>
            <Typography variant="subtitle1" gutterBottom>Username</Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="text"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
              sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
            />

            <Typography variant="subtitle1" gutterBottom>Email</Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
            />

            <Typography variant="subtitle1" gutterBottom>Password</Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type={showPassword ? "text" : "password"}
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="subtitle1" gutterBottom>Confirm Password</Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              type="password"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
              sx={{ backgroundColor: '#fff', borderRadius: 1, '& .MuiInputBase-input': { color: '#1E1E1E' } }}
            />

            <Button variant="contained" color="primary" fullWidth style={{ marginTop: '12px' }} type="submit">
              Register
            </Button>
            
            {/* Add a link to login page as well */}
            <Typography align="center" style={{ marginTop: '15px' }}>
              <Button 
                variant="text" 
                sx={{ color: '#fff' }}
                onClick={() => router.push('/login')}
              >
                Already have an account? Sign In
              </Button>
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