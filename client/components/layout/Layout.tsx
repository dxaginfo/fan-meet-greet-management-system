import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Container, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '.5px',
  color: 'inherit',
  textDecoration: 'none',
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, href: '/' },
    { text: 'Events', icon: <EventIcon />, href: '/events' },
    { text: 'Artists', icon: <PeopleIcon />, href: '/artists' },
    { text: 'My Bookings', icon: <BookmarkIcon />, href: '/bookings' },
    { text: 'About', icon: <InfoIcon />, href: '/about' },
  ];

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            href={item.href}
            selected={router.pathname === item.href}
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Logo variant="h6" component={Link} href="/">
            Fan Meet & Greet
          </Logo>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <NavButton
                key={item.text}
                color="inherit"
                component={Link}
                href={item.href}
              >
                {item.text}
              </NavButton>
            ))}
          </Box>
          <NavButton
            color="secondary"
            variant="contained"
            startIcon={<LoginIcon />}
            component={Link}
            href="/login"
          >
            Login
          </NavButton>
        </Toolbar>
      </StyledAppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Main>
        <Toolbar /> {/* This creates space for the fixed AppBar */}
        <ContentWrapper>
          {children}
        </ContentWrapper>
        <Footer />
      </Main>
    </Box>
  );
};

export default Layout;