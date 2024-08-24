// components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'transparent', // No background color
        color: '#150e43', // Text color for contrast
        p: 1.5,
        border: '2px solid transparent',
        boxShadow: `0 0 10px 4px rgba(95, 206, 213, 0.8)`,
      }}
    >
      {/* AppBar content goes here */}
      <Toolbar>
        <Container>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            {/* Logo on the left */}
            <Link href="/" passHref>
              <Box display="flex" alignItems="center">
                <Image src="/twobg.png" alt="Logo" width={120} height={120} /> {/* Adjust the size as needed */}

              </Box>
            </Link>

            {/* Menu on the right */}
            {isMobile ? (
              <Button color="inherit" onClick={() => alert('Menu Clicked')}>
                Menu
              </Button>
            ) : (
              <Box>
                <Button color="inherit" component={Link} href="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} href="/Scrapper">
                  Scrapper
                </Button>
                <Link href="https://rate-my-professor-backend.vercel.app/"  color="inherit">
                  <Typography variant="body2">Try Our Chatbot 2</Typography>
                </Link>
              </Box>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
