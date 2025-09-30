import * as React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, Avatar } from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';
import Link from "next/link";

// Styled search bar
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: 16,
  width: '100%',
  maxWidth: 300,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  paddingLeft: `calc(1em + ${theme.spacing(3)})`,
}));

const HeadNavigationBar = () => {
  const navLinks = ["Home", "Movies", "Series", "Genres", "TopIMDB", "Contact"];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#6750A4', padding: '0 24px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Left side: profile + search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            alt="User"
            src="/user-icon.png" // replace with actual user image
            sx={{ width: 40, height: 40, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
          />

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>

        {/* Right side: clickable links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {navLinks.map((link) => (
            <Link key={link} href={`/${link.toLowerCase()}`} style={{ textDecoration: 'none' }}>
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
                {link}
              </Typography>
            </Link>
          ))}
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default HeadNavigationBar;