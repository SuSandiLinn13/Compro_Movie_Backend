// export default function Register() {
//     return(
//         <h1>Register Page</h1>
//     );
// }
"use client";
import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert } from '@mui/material';


export default function Register() {
 const [loginEmail, setLoginEmail] = useState('');
 const [loginPassword, setLoginPassword] = useState('');
 const [registerName, setRegisterName] = useState('');
 const [registerEmail, setRegisterEmail] = useState('');
 const [registerPassword, setRegisterPassword] = useState('');
 const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
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
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         email: loginEmail,
         password_hash: loginPassword,
       }),
     });


     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.detail || 'Login failed');
     }


     const data = await response.json();
     setSnackbarMessage('Login successful!');
     setSnackbarSeverity('success');
     setOpenSnackbar(true);
     // Handle successful login (e.g., redirect)
   } catch (error) {
     setSnackbarMessage(error.message);
     setSnackbarSeverity('error');
     setOpenSnackbar(true);
   }
 };


 const handleRegisterSubmit = async (e) => {
   e.preventDefault();
   if (registerPassword !== registerConfirmPassword) {
     setSnackbarMessage('Passwords do not match');
     setSnackbarSeverity('error');
     setOpenSnackbar(true);
     return;
   }


   try {
     const response = await fetch('/api/users/create', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         username: registerName,
         email: registerEmail,
         password_hash: registerPassword,
       }),
     });


     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.detail || 'Registration failed');
     }


     const data = await response.json();
     setSnackbarMessage('Registration successful!');
     setSnackbarSeverity('success');
     setOpenSnackbar(true);
     // Handle successful registration (e.g., redirect)
   } catch (error) {
     setSnackbarMessage(error.message);
     setSnackbarSeverity('error');
     setOpenSnackbar(true);
   }
 };


 return (
   <Grid container spacing={2} 
   style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' , overflow : 'hidden'}}>

     {/* Register Section */}
     <Grid item xs={12} sm={4} md={3} > {/* Smaller width */}
       <Paper elevation={3} 
       style={{ 
            padding: '20px', 
            backgroundColor: 'rgba(103, 80, 164, 0.16)', 
            color: '#fff', 
            maxWidth: '400px', 
            width: '100%',
            borderRadius: '12px',
            border: '0.2px solid #FFFFFF',
            boxSizing: 'border-box',
          }}>
        
         <form onSubmit={handleRegisterSubmit}>
          <Typography variant="subtitle1" gutterBottom>
            Username          
          </Typography>
           <TextField
             fullWidth
             variant="outlined"
             margin="dense"
             size="small" 
             type="text"
             value={registerName}
             onChange={(e) => setRegisterName(e.target.value)}
             sx={{ backgroundColor: '#fff', borderRadius: 1, 
              '& .MuiInputBase-input': {
              color: '#1E1E1E',       },}}
           />
           <Typography variant="subtitle1" gutterBottom>
            Email          
          </Typography>
           <TextField
             fullWidth
             variant="outlined"
             margin="dense"
             size="small"
             type="email"
             value={registerEmail}
             onChange={(e) => setRegisterEmail(e.target.value)}
             sx={{ backgroundColor: '#fff', borderRadius: 1, 
              '& .MuiInputBase-input': {
              color: '#1E1E1E',       },}}
           />
           <Typography variant="subtitle1" gutterBottom>
            Password          
           </Typography>
           <TextField
             fullWidth
             variant="outlined"
             margin="dense"
             size="small"
             type="password"
             value={registerPassword}
             onChange={(e) => setRegisterPassword(e.target.value)}
             sx={{ backgroundColor: '#fff', borderRadius: 1, 
              '& .MuiInputBase-input': {
              color: '#1E1E1E',       },}}
           />
           <Typography variant="subtitle1" gutterBottom>
            Confirm Password          
           </Typography>
           <TextField
             fullWidth
             variant="outlined"
             margin="dense"
             size="small"
             type="password"
             value={registerConfirmPassword}
             onChange={(e) => setRegisterConfirmPassword(e.target.value)}
             sx={{ backgroundColor: '#fff', borderRadius: 1, 
              '& .MuiInputBase-input': {
              color: '#1E1E1E',       },}}
           />
           <Button 
           variant="contained" 
           color="primary" 
           fullWidth style={{ marginTop: '12px' }} 
           type="submit"
           onClick={()=>console.log("BUtton Clicked!")}
           >
             Register
           </Button>
         </form>
       </Paper>
     </Grid>


     {/* Snackbar for notifications */}
     <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
       <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
         {snackbarMessage}
       </Alert>
     </Snackbar>
   </Grid>
 );
}