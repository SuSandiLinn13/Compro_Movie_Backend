import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, TextField, Button, Snackbar, Alert, Avatar } from "@mui/material";
import HeadNavigationBar from "@/components/HeadNav"; 
import BottomNavigationBar from "@/components/BottomNav"; 
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********"); // masked
  const [profilePic, setProfilePic] = useState("/default-avatar.png"); // default avatar
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const router = useRouter();
  const theme = useTheme();

  // Fetch user data from your API when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/users/me"); // adjust your endpoint
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUsername(data.username);
        setEmail(data.email);
        if (data.profilePic) setProfilePic(data.profilePic);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (newProfilePic) formData.append("profilePic", newProfilePic);

      const res = await fetch("/api/users/update", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setNewProfilePic(null); // reset new picture
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSignOut = async () => {
    try {
      // Call your sign out API or clear tokens if needed
      await fetch("/api/auth/logout", { method: "POST" }); // adjust endpoint if you have one
      // Redirect to main page
      router.push("/");
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Sign out failed!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };


  return (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        gap: "100px", // space between picture and form
        padding: "20px",
      }}
    >
      {/* Profile Picture */}
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          backgroundColor: "rgba(103, 80, 164, 0.16)",
          color: "#fff",
          borderRadius: "12px",
          border: "0.2px solid #FFFFFF",
          textAlign: "center",
        }}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="profile-pic-upload"
          type="file"
          onChange={handleProfilePicChange}
        />
        <label htmlFor="profile-pic-upload">
          <Avatar
            src={profilePic}
            sx={{ width: 230, height: 230, margin: "0 auto", cursor: "pointer" }}
          />
          <Typography variant="caption" display="block" style={{ marginTop: "8px" }}>
            Click to change
          </Typography>
        </label>
      </Paper>

      {/* Right side form */}
      <div
        style={{
        padding: "20px",            
        borderRadius: "12px",        
        display: "flex",
        flexDirection: "column",
        gap: "20px",                 
        minWidth: "300px",
        }}
      >
        {/* Username */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", gap: "8px" }}>
          <Typography style={{ width: "80px", color : theme.palette.text.primary }}>Username:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ backgroundColor: "#fff", borderRadius: 1, '& .MuiInputBase-input': { color: "#1E1E1E" } }}
          />
        </div>

        {/* Email */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", gap: "8px" }}>
          <Typography style={{ width: "80px" , color : theme.palette.text.primary}}>Email:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={email}
            disabled
            sx={{ backgroundColor: "#fff", borderRadius: 1, '& .MuiInputBase-input': { color: "#1E1E1E" } }}
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", gap: "8px" }}>
          <Typography style={{ width: "80px", color : theme.palette.text.primary }}>Password:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={password}
            disabled
            sx={{ backgroundColor: "#fff", borderRadius: 1, '& .MuiInputBase-input': { color: "#1E1E1E" } }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "50px" }}>
          <Button variant="contained" color="primary" fullWidth onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="outlined" color="secondary" fullWidth onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>

    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </>
);


}
