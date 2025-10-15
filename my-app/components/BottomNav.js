import * as React from "react";
import { AppBar, Toolbar, Typography, Box, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const BottomNavigationBar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: "auto",
        bottom: 0,
        backgroundColor: '#6750A4',
        padding: "6px 24px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>

          <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
            Always here with you now and forever
          </Typography> 

          
        </Box>

        {/* Right side (icons) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Link href="https://facebook.com" passHref legacyBehavior>
            <MuiLink
              target="_blank"
              sx={{
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#1E1E1E' }
              }}
            >
              <FacebookIcon sx={{ fontSize: 30 }} />
            </MuiLink>
          </Link>

          <Link href="https://instagram.com" passHref legacyBehavior>
            <MuiLink
              target="_blank"
              sx={{
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#1E1E1E' }
              }}
            >
              <InstagramIcon sx={{ fontSize: 30 }} />
            </MuiLink>
          </Link>

          <Link href="https://twitter.com" passHref legacyBehavior>
            <MuiLink
              target="_blank"
              sx={{
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#1E1E1E' }
              }}
            >
              <TwitterIcon sx={{ fontSize: 30 }} />
            </MuiLink>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BottomNavigationBar;