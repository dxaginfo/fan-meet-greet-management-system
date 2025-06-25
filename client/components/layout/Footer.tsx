import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Link from 'next/link';

const FooterRoot = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  marginTop: 'auto',
}));

const FooterLink = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.common.white,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Copyright = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  textAlign: 'center',
}));

const Footer: React.FC = () => {
  return (
    <FooterRoot>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Fan Meet & Greet
            </Typography>
            <Typography variant="body2">
              Creating unforgettable moments between artists and fans since 2025.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <SocialIcon aria-label="Facebook">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon aria-label="Twitter">
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon aria-label="Instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon aria-label="YouTube">
                <YouTubeIcon />
              </SocialIcon>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/">Home</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/events">Events</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/artists">Artists</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/about">About</FooterLink>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/faq">FAQ</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/contact">Contact Us</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/terms">Terms of Service</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/privacy">Privacy Policy</FooterLink>
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              For Artists
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/artist-signup">Join as Artist</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/artist-portal">Artist Portal</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/success-stories">Success Stories</FooterLink>
            </Typography>
            <Typography variant="body2" component="div">
              <FooterLink component={Link} href="/resources">Resources</FooterLink>
            </Typography>
          </Grid>
        </Grid>
        
        <Copyright variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Fan Meet & Greet Management System. All rights reserved.
        </Copyright>
      </Container>
    </FooterRoot>
  );
};

export default Footer;