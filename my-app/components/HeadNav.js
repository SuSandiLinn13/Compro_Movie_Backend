'use client';

import * as React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Link from "next/link";

const HeadNavigationBar = () => {
  // Instead of useEffect, read directly from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : "";

  const isLoggedIn = !!token;

  const navLinks = [
    { name: "Home", href: isLoggedIn ? "/home" : "/" },
    { name: "Movies", href: "/moviesonly" },
    { name: "Series", href: "/seriesonly" },
    { name: "Genres", href: "/genres" },
    { name: "TopIMDB", href: "/topimdb" },
  ];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#6750A4', padding: '0 24px'}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
        
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn ? (
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer' , fontFamily: 'Monospace'}}>
                Hello, {username}
              </Typography>
            </Link>
          ) : (
            <>
              
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" size="small">
                  Log In
                </Button>
              </Link>
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="secondary" size="small">
                  Register
                </Button>
              </Link>
            </>
          )}
        </Box>
        
        {/* Center title */}
        <Typography
          variant="h6"
          sx={{
          color: '#FFFFFF',
          fontSize: 25,
          fontFamily: 'Georgia',
          fontWeight: 500,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none', // makes sure clicks pass through
        }}>
        You Were Here
        </Typography>

        {/* Right side: clickable links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#1E1E1E' }
                }}
              >
                {link.name}
              </Typography>
            </Link>
          ))}
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default HeadNavigationBar;
