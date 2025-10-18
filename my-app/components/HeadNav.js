// 'use client';

// import * as React from "react";
// import { AppBar, Toolbar, Typography, Box, InputBase, Avatar } from "@mui/material";
// import { styled, alpha } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';
// import Link from "next/link";

// // Styled search bar
// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: 8,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
//   marginLeft: 16,
//   width: '100%',
//   maxWidth: 300,
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 1),
//   height: '100%',
//   position: 'absolute',
//   display: 'flex',
//   alignItems: 'center',
//   pointerEvents: 'none',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   width: '100%',
//   paddingLeft: `calc(1em + ${theme.spacing(3)})`,
// }));

// const HeadNavigationBar = () => {
//   const navLinks = ["Home", "Movies", "Series", "Genres", "TopIMDB"];

//   return (
//     <AppBar position="fixed" sx={{ backgroundColor: '#6750A4', padding: '0 24px' }}>
//       <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
//         {/* Left side: profile + search */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Avatar 
//             alt="User"
//             src="/user-icon.png" // replace with actual user image
//             sx={{ width: 40, height: 40, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
//           />

//           <Search>
//             <SearchIconWrapper>
//               <SearchIcon />
//             </SearchIconWrapper>
//             <StyledInputBase
//               placeholder="Search…"
//               inputProps={{ 'aria-label': 'search' }}
//             />
//           </Search>
//         </Box>

//         {/* Right side: clickable links */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
//           {navLinks.map((link) => (
//             <Link
//               key={link}
//               href={`/${link.toLowerCase()}`}
//               style={{ textDecoration: 'none' }}
//               legacyBehavior>
//               <Typography
//                 sx={{
//                   color: '#FFFFFF',
//                   fontWeight: 500,
//                   fontSize: 14,
//                   cursor: 'pointer',
//                   transition: 'color 0.2s',
//                   '&:hover': { color: '#1E1E1E' }
//                 }}
//               >
//                 {link}
//               </Typography>
//             </Link>
//           ))}
//         </Box>

//       </Toolbar>
//     </AppBar>
//   );
// };

// export default HeadNavigationBar;


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
    <AppBar position="fixed" sx={{ backgroundColor: '#6750A4', padding: '0 24px' , fontFamily: 'Georgia, Helvetica, sans-serif' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn ? (
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer' }}>
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
            <Link key={link.name} href={link.href} style={{ textDecoration: 'none' }} legacyBehavior>
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
