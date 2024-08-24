// components/Footer.js
import React from 'react';
import { Container, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <footer
    style={{
      fontSize: '12px',
      padding: '30px',
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
      border: '2px solid transparent', 
    }}
  >  <Container>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Link href="https://github.com/MuhammadHamza00/rate-professor" underline="none" color="inherit">
            <Typography variant="body2">Gitub</Typography>
          </Link>
        </Stack>
      </Container>
    </footer>
  );
};

export default Footer;
