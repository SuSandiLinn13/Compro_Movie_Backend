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
        padding: "8px 24px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontSize: "20px", fontWeight: 500, color: '#FFFFFF' }}
          >
            You Were Here
          </Typography>

          <Link href="/contact" passHref>
            <MuiLink
              component="span"
              underline="none"
              sx={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#1E1E1E' }
              }}
            >
              Contact Us
            </MuiLink>
          </Link>

          <Link href="/help" passHref>
            <MuiLink
              component="span"
              underline="none"
              sx={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': { color: '#1E1E1E' }
              }}
            >
              Help
            </MuiLink>
          </Link>
        </Box>

        {/* Right side (icons) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Link href="https://facebook.com" passHref>
            <MuiLink
              component="span"
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

          <Link href="https://instagram.com" passHref>
            <MuiLink
              component="span"
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

          <Link href="https://twitter.com" passHref>
            <MuiLink
              component="span"
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


// import * as React from "react";
// import { AppBar, Toolbar, Typography, Box, Link as MuiLink } from "@mui/material";
// import Link from "next/link";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import TwitterIcon from "@mui/icons-material/Twitter";

// const BottomNavigationBar = () => {
//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         top: "auto",
//         bottom: 0,
//         backgroundColor: '#6750A4',
//         padding: "8px 24px",
//       }}
//     >
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         {/* Left side */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
//           <Typography
//             variant="h6"
//             sx={{ fontSize: "20px", fontWeight: 500, color: '#FFFFFF' }}
//           >
//             You Were Here
//           </Typography>

//           <Link href="/contact" passHref legacyBehavior>
//             <MuiLink
//               underline="none"
//               sx={{
//                 color: '#FFFFFF',
//                 fontSize: '14px',
//                 fontWeight: 500,
//                 cursor: 'pointer',
//                 transition: 'color 0.2s',
//                 '&:hover': { color: '#1E1E1E' }
//               }}
//             >
//               Contact Us
//             </MuiLink>
//           </Link>

//           <Link href="/help" passHref legacyBehavior>
//             <MuiLink
//               underline="none"
//               sx={{
//                 color: '#FFFFFF',
//                 fontSize: '14px',
//                 fontWeight: 500,
//                 cursor: 'pointer',
//                 transition: 'color 0.2s',
//                 '&:hover': { color: '#1E1E1E' }
//               }}
//             >
//               Help
//             </MuiLink>
//           </Link>
//         </Box>

//         {/* Right side (icons) */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 15 }}>
//           <Link href="https://facebook.com" passHref legacyBehavior>
//             <MuiLink
//               target="_blank"
//               sx={{
//                 color: '#FFFFFF',
//                 cursor: 'pointer',
//                 transition: 'color 0.2s',
//                 '&:hover': { color: '#1E1E1E' }
//               }}
//             >
//               <FacebookIcon sx={{ fontSize: 30 }} />
//             </MuiLink>
//           </Link>

//           <Link href="https://instagram.com" passHref legacyBehavior>
//             <MuiLink
//               target="_blank"
//               sx={{
//                 color: '#FFFFFF',
//                 cursor: 'pointer',
//                 transition: 'color 0.2s',
//                 '&:hover': { color: '#1E1E1E' }
//               }}
//             >
//               <InstagramIcon sx={{ fontSize: 30 }} />
//             </MuiLink>
//           </Link>

//           <Link href="https://twitter.com" passHref legacyBehavior>
//             <MuiLink
//               target="_blank"
//               sx={{
//                 color: '#FFFFFF',
//                 cursor: 'pointer',
//                 transition: 'color 0.2s',
//                 '&:hover': { color: '#1E1E1E' }
//               }}
//             >
//               <TwitterIcon sx={{ fontSize: 30 }} />
//             </MuiLink>
//           </Link>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default BottomNavigationBar;