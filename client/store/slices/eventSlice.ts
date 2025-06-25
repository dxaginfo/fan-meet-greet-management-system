import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  benefits: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  totalCapacity: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  artist: {
    id: string;
    name: string;
    image?: string;
  };
  packages: Package[];
  imageUrl?: string;
}

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  filteredEvents: Event[];
  filters: {
    searchTerm: string;
    city: string;
    dateRange: {
      startDate: string | null;
      endDate: string | null;
    };
    artistId: string | null;
    priceRange: {
      min: number | null;
      max: number | null;
    };
  };
}

// Define async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      // This would be a real API call in a production app
      // const response = await axios.get('/api/events');
      // return response.data;
      
      // Mock data for development
      return [
        {
          id: '1',
          title: 'Rock Band Meet & Greet',
          description: 'Meet the members of the hottest rock band and get exclusive autographs.',
          eventDate: '2026-01-15',
          startTime: '18:00',
          endTime: '20:00',
          venueName: 'Metro Concert Hall',
          address: '123 Music Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
          totalCapacity: 100,
          status: 'scheduled',
          artist: {
            id: '101',
            name: 'The Rockers',
            image: '/images/artists/rockers.jpg'
          },
          packages: [
            {
              id: 'pkg1',
              name: 'Standard',
              description: 'Meet the band and get an autograph',
              price: 99.99,
              quantityAvailable: 50,
              benefits: ['Meet & Greet', 'Autographed Photo']
            },
            {
              id: 'pkg2',
              name: 'VIP',
              description: 'Extended session with the band plus exclusive merchandise',
              price: 199.99,
              quantityAvailable: 20,
              benefits: ['Extended Meet & Greet', 'Autographed Photo', 'Exclusive T-shirt', 'Front of the line access']
            }
          ],
          imageUrl: '/images/events/rock-event.jpg'
        },
        {
          id: '2',
          title: 'Pop Star Exclusive Session',
          description: 'Spend time with the chart-topping pop sensation and get personalized photos.',
          eventDate: '2026-02-20',
          startTime: '17:00',
          endTime: '19:30',
          venueName: 'Starlight Arena',
          address: '456 Celebrity Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          totalCapacity: 150,
          status: 'scheduled',
          artist: {
            id: '102',
            name: 'Melody Queen',
            image: '/images/artists/melody.jpg'
          },
          packages: [
            {
              id: 'pkg3',
              name: 'Basic',
              description: 'Quick meet and photo opportunity',
              price: 129.99,
              quantityAvailable: 100,
              benefits: ['Quick Meet & Greet', 'Photo Opportunity']
            },
            {
              id: 'pkg4',
              name: 'Deluxe',
              description: 'Extended session with Q&A and exclusive merchandise',
              price: 249.99,
              quantityAvailable: 30,
              benefits: ['Extended Meet & Greet', 'Q&A Session', 'Photo Opportunity', 'Signed Album']
            }
          ],
          imageUrl: '/images/events/pop-event.jpg'
        },
        {
          id: '3',
          title: 'Jazz Night Fan Experience',
          description: 'Intimate jazz session with legendary performers followed by a meet and greet.',
          eventDate: '2026-03-05',
          startTime: '20:00',
          endTime: '22:00',
          venueName: 'Blue Note Jazz Club',
          address: '789 Smooth St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
          totalCapacity: 75,
          status: 'scheduled',
          artist: {
            id: '103',
            name: 'Jazz Legends',
            image: '/images/artists/jazz.jpg'
          },
          packages: [
            {
              id: 'pkg5',
              name: 'Standard Jazz',
              description: 'Meet the jazz legends after their performance',
              price: 89.99,
              quantityAvailable: 50,
              benefits: ['Post-show Meet & Greet', 'Autographed Program']
            },
            {
              id: 'pkg6',
              name: 'Premium Jazz',
              description: 'Pre-show rehearsal access plus post-show meet and greet',
              price: 179.99,
              quantityAvailable: 15,
              benefits: ['Rehearsal Access', 'Post-show Meet & Greet', 'Autographed Vinyl', 'Commemorative Jazz Club Glass']
            }
          ],
          imageUrl: '/images/events/jazz-event.jpg'
        }
      ] as Event[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to fetch events. Please try again.');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId: string, { rejectWithValue }) => {
    try {
      // This would be a real API call in a production app
      // const response = await axios.get(`/api/events/${eventId}`);
      // return response.data;
      
      // Mock data for development
      const events = [
        {
          id: '1',
          title: 'Rock Band Meet & Greet',
          description: 'Meet the members of the hottest rock band and get exclusive autographs.',
          eventDate: '2026-01-15',
          startTime: '18:00',
          endTime: '20:00',
          venueName: 'Metro Concert Hall',
          address: '123 Music Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
          totalCapacity: 100,
          status: 'scheduled',
          artist: {
            id: '101',
            name: 'The Rockers',
            image: '/images/artists/rockers.jpg'
          },
          packages: [
            {
              id: 'pkg1',
              name: 'Standard',
              description: 'Meet the band and get an autograph',
              price: 99.99,
              quantityAvailable: 50,
              benefits: ['Meet & Greet', 'Autographed Photo']
            },
            {
              id: 'pkg2',
              name: 'VIP',
              description: 'Extended session with the band plus exclusive merchandise',
              price: 199.99,
              quantityAvailable: 20,
              benefits: ['Extended Meet & Greet', 'Autographed Photo', 'Exclusive T-shirt', 'Front of the line access']
            }
          ],
          imageUrl: '/images/events/rock-event.jpg'
        },
        {
          id: '2',
          title: 'Pop Star Exclusive Session',
          description: 'Spend time with the chart-topping pop sensation and get personalized photos.',
          eventDate: '2026-02-20',
          startTime: '17:00',
          endTime: '19:30',
          venueName: 'Starlight Arena',
          address: '456 Celebrity Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          totalCapacity: 150,
          status: 'scheduled',
          artist: {
            id: '102',
            name: 'Melody Queen',
            image: '/images/artists/melody.jpg'
          },
          packages: [
            {
              id: 'pkg3',
              name: 'Basic',
              description: 'Quick meet and photo opportunity',
              price: 129.99,
              quantityAvailable: 100,
              benefits: ['Quick Meet & Greet', 'Photo Opportunity']
            },
            {
              id: 'pkg4',
              name: 'Deluxe',
              description: 'Extended session with Q&A and exclusive merchandise',
              price: 249.99,
              quantityAvailable: 30,
              benefits: ['Extended Meet & Greet', 'Q&A Session', 'Photo Opportunity', 'Signed Album']
            }
          ],
          imageUrl: '/images/events/pop-event.jpg'
        },
        {
          id: '3',
          title: 'Jazz Night Fan Experience',
          description: 'Intimate jazz session with legendary performers followed by a meet and greet.',
          eventDate: '2026-03-05',
          startTime: '20:00',
          endTime: '22:00',
          venueName: 'Blue Note Jazz Club',
          address: '789 Smooth St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
          totalCapacity: 75,
          status: 'scheduled',
          artist: {
            id: '103',
            name: 'Jazz Legends',
            image: '/images/artists/jazz.jpg'
          },
          packages: [
            {
              id: 'pkg5',
              name: 'Standard Jazz',
              description: 'Meet the jazz legends after their performance',
              price: 89.99,
              quantityAvailable: 50,
              benefits: ['Post-show Meet & Greet', 'Autographed Program']
            },
            {
              id: 'pkg6',
              name: 'Premium Jazz',
              description: 'Pre-show rehearsal access plus post-show meet and greet',
              price: 179.99,
              quantityAvailable: 15,
              benefits: ['Rehearsal Access', 'Post-show Meet & Greet', 'Autographed Vinyl', 'Commemorative Jazz Club Glass']
            }
          ],
          imageUrl: '/images/events/jazz-event.jpg'
        }
      ] as Event[];
      
      const event = events.find(e => e.id === eventId);
      if (!event) {
        return rejectWithValue('Event not found');
      }
      
      return event;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to fetch event details. Please try again.');
    }
  }
);

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
  filteredEvents: [],
  filters: {
    searchTerm: '',
    city: '',
    dateRange: {
      startDate: null,
      endDate: null,
    },
    artistId: null,
    priceRange: {
      min: null,
      max: null,
    },
  },
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ key: string; value: any }>) {
      const { key, value } = action.payload;
      // @ts-ignore
      state.filters[key] = value;
      state.filteredEvents = applyFilters(state.events, state.filters);
    },
    clearFilters(state) {
      state.filters = initialState.filters;
      state.filteredEvents = state.events;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.filteredEvents = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Event By Id
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Helper function to apply filters
const applyFilters = (events: Event[], filters: EventsState['filters']) => {
  return events.filter((event) => {
    // Search term filter
    const searchMatch = !filters.searchTerm || 
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.artist.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // City filter
    const cityMatch = !filters.city || event.city.toLowerCase() === filters.city.toLowerCase();
    
    // Date range filter
    let dateMatch = true;
    if (filters.dateRange.startDate) {
      dateMatch = dateMatch && new Date(event.eventDate) >= new Date(filters.dateRange.startDate);
    }
    if (filters.dateRange.endDate) {
      dateMatch = dateMatch && new Date(event.eventDate) <= new Date(filters.dateRange.endDate);
    }
    
    // Artist filter
    const artistMatch = !filters.artistId || event.artist.id === filters.artistId;
    
    // Price range filter
    let priceMatch = true;
    if (event.packages.length > 0) {
      const lowestPrice = Math.min(...event.packages.map(pkg => pkg.price));
      if (filters.priceRange.min !== null) {
        priceMatch = priceMatch && lowestPrice >= filters.priceRange.min;
      }
      if (filters.priceRange.max !== null) {
        priceMatch = priceMatch && lowestPrice <= filters.priceRange.max;
      }
    }
    
    return searchMatch && cityMatch && dateMatch && artistMatch && priceMatch;
  });
};

export const { setFilter, clearFilters } = eventSlice.actions;

export default eventSlice.reducer;