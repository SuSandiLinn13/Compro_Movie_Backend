// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import {
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Snackbar,
//   Alert,
//   Typography,
//   Link,
//   IconButton, InputAdornment
// } from "@mui/material";

// export default function AuthPage() {
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [showPassword, setShowPassword] = useState(false);
//   const handleTogglePassword = () => setShowPassword((prev) => !prev);

//   const router = useRouter();

//   const handleSnackbarClose = () => {
//     setOpenSnackbar(false);
//   };

//   const handleLoginSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await fetch("http://localhost:8008/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//     email: loginEmail,
//     password: loginPassword,
//   }),
// });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || "Login failed");
//     }

//     const result = await response.json();
//     setSnackbarMessage("Login successful!");
//     setSnackbarSeverity("success");
//     setOpenSnackbar(true);

//     // Redirect
//     setTimeout(() => {
//       router.push("/home");
//     }, 1000);
//   } catch (error) {
//     setSnackbarMessage(error.message);
//     setSnackbarSeverity("error");
//     setOpenSnackbar(true);
//   }
// };


//   const handleRegisterClick = () => {
//     router.push("/register");
//   };

//   return (
//     <Grid
//       container
//       spacing={2}
//       style={{
//         height: "100vh",
//         justifyContent: "center",
//         alignItems: "center",
//         overflow: "hidden",
//       }}
//     >
//       <Grid item xs={12} sm={4} md={3}>
//         <Paper
//           elevation={3}
//           style={{
//             padding: "20px",
//             backgroundColor: "rgba(83, 26, 241, 0.16)",
//             color: "#fff",
//             maxWidth: "400px",
//             width: "100%",
//             borderRadius: "12px",
//             border: "0.2px solid #FFFFFF",
//             boxSizing: "border-box",
//           }}
//         >
//           <form onSubmit={handleLoginSubmit}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               margin="dense"
//               size="small"
//               label="Email"
//               type="email"
//               value={loginEmail}
//               onChange={(e) => setLoginEmail(e.target.value)}
//               sx={{
//                 backgroundColor: "#fff",
//                 borderRadius: 1,
//                 "& .MuiInputBase-input": {
//                   color: "#1E1E1E",
//                 },
//               }}
//             />
//             <TextField
//   fullWidth
//   variant="outlined"
//   margin="dense"
//   size="small"
//   label="Password"
//   type={showPassword ? "text" : "password"}
//   value={loginPassword}
//   onChange={(e) => setLoginPassword(e.target.value)}
//   sx={{
//     backgroundColor: "#fff",
//     borderRadius: 1,
//     "& .MuiInputBase-input": {
//       color: "#1E1E1E",
//     },
//   }}
//   InputProps={{
//     endAdornment: (
//       <InputAdornment position="end">
//         <IconButton
//           onClick={handleTogglePassword}
//           edge="end"
//           aria-label="toggle password visibility"
//         >
//           {showPassword ? <VisibilityOff /> : <Visibility />}
//         </IconButton>
//       </InputAdornment>
//     ),
//   }}
// />


//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               style={{ marginTop: "12px" }}
//               type="submit"
//             >
//               Log In
//             </Button>

//             <Button
//               variant="contained"
//               color="secondary"
//               fullWidth
//               style={{ marginTop: "12px" }}
//               type="button"
//               onClick={handleRegisterClick}
//             >
//               Register
//             </Button>

//             <Typography align="left" style={{ marginTop: "50px" }}>
//               <Link
//                 href="#"
//                 underline="hover"
//                 sx={{
//                   color: "#fff",
//                   fontWeight: "bold",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => alert("Forgot password clicked!")}
//               >
//                 Forget Password?
//               </Link>
//             </Typography>
//           </form>
//         </Paper>
//       </Grid>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={4000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// }



"use client";

import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Snackbar, Alert, Typography, Link, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8008/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.detail || "Login failed");

    // ✅ Save real access token
    localStorage.setItem("token", data.access_token); 
    localStorage.setItem("username", data.user?.username || data.username);

    setSnackbarMessage("Login successful!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    router.push("/home"); // redirect to home page
  } catch (error) {
    setSnackbarMessage(error.message);
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  }
};


  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <Grid container spacing={2} 
    style={{ height: "100vh", justifyContent: "center", 
    alignItems: "center", overflow: "hidden" , backgroundColor: "#1e1e1e"}}>
      <Grid item xs={12} sm={4} md={3}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            backgroundColor: "rgba(83, 26, 241, 0.16)",
            color: "#fff",
            maxWidth: "400px",
            width: "100%",
            borderRadius: "12px",
            border: "0.2px solid #FFFFFF",
            boxSizing: "border-box",
          }}
        >
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              label="Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                "& .MuiInputBase-input": { color: "#1E1E1E" },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              size="small"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                "& .MuiInputBase-input": { color: "#1E1E1E" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end" aria-label="toggle password visibility">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" fullWidth style={{ marginTop: "12px" }} type="submit">
              Log In
            </Button>
            <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "12px" }} type="button" onClick={handleRegisterClick}>
              Register
            </Button>
            <Typography align="left" style={{ marginTop: "50px" }}>
              <Link
                href="#"
                underline="hover"
                sx={{ color: "#fff", fontWeight: "bold", cursor: "pointer" }}
                onClick={() => alert("Forgot password clicked!")}
              >
                Forget Password?
              </Link>
            </Typography>
          </form>
        </Paper>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
