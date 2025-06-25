import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Link from 'next/link';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const CardContentStyled = styled(CardContent)({
  flexGrow: 1,
});

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(6),
}));

// Home page component
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState([
    {
      id: 1,
      title: "Rock Band Meet & Greet",
      artist: "The Rockers",
      date: "January 15, 2026",
      image: "/images/event1.jpg"
    },
    {
      id: 2,
      title: "Pop Star Exclusive Session",
      artist: "Melody Queen",
      date: "February 20, 2026",
      image: "/images/event2.jpg"
    },
    {
      id: 3,
      title: "Jazz Night Fan Experience",
      artist: "Jazz Legends",
      date: "March 5, 2026",
      image: "/images/event3.jpg"
    }
  ]);

  useEffect(() => {
    // Here we would typically fetch data from our API
    // For now, we're using the static data defined above
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Fan Meet & Greet Management System</title>
        <meta name="description" content="Connect with your favorite artists through exclusive meet and greet events" />
      </Head>

      <HeroSection>
        <Container maxWidth="lg">
          <Typography component="h1" variant="h2" align="center" gutterBottom>
            Connect With Your Favorite Artists
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Exclusive meet and greet opportunities with the biggest names in music. 
            Create unforgettable moments with personalized fan experiences.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" size="large" component={Link} href="/events">
              Browse Events
            </Button>
            <Button variant="outlined" color="secondary" size="large" sx={{ ml: 2 }} component={Link} href="/artists">
              See Artists
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Events
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {featuredEvents.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContentStyled>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Artist: {event.artist}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {event.date}
                    </Typography>
                  </CardContentStyled>
                  <CardActions>
                    <Button size="small" component={Link} href={`/events/${event.id}`}>
                      View Details
                    </Button>
                    <Button size="small" component={Link} href={`/events/${event.id}/book`}>
                      Book Now
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Premium Experiences
              </Typography>
              <Typography>
                Carefully curated meet & greet events with exclusive access and personalized interactions with your favorite artists.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Secure & Simple
              </Typography>
              <Typography>
                Easy booking process with secure payments and digital tickets. No more waiting in lines or complicated processes.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Unforgettable Memories
              </Typography>
              <Typography>
                Create lasting memories with photo opportunities, autographs, and personal moments with the artists you love.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}