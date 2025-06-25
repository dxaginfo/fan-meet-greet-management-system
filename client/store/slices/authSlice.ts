import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'artist' | 'manager' | 'fan' | 'staff';
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role: 'artist' | 'fan';
}

interface LoginResponse {
  user: User;
  token: string;
}

// Define async actions
export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // This would be a real API call in a production app
      // For now, we'll simulate a successful login
      // const response = await axios.post('/api/auth/login', credentials);
      // return response.data;
      
      // Simulated response
      return {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'fan',
          profileImage: '/images/avatars/user1.jpg'
        },
        token: 'simulated.jwt.token'
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const register = createAsyncThunk<LoginResponse, RegisterData>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // This would be a real API call in a production app
      // const response = await axios.post('/api/auth/register', userData);
      // return response.data;
      
      // Simulated response
      return {
        user: {
          id: '2',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
        },
        token: 'simulated.jwt.token'
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

// Check if we have token in localStorage and validate it
const loadUserFromStorage = (): { user: User | null; token: string | null } => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    return { user: null, token: null };
  }
  
  try {
    // In a real app, you would validate the token expiration
    // const decodedToken = jwtDecode(token);
    // Check if token is expired
    // if (decodedToken.exp < Date.now() / 1000) {
    //   localStorage.removeItem('token');
    //   return { user: null, token: null };
    // }
    
    // Simulated user data
    const user = {
      id: '1',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'fan' as const,
    };
    
    return { user, token };
  } catch (error) {
    localStorage.removeItem('token');
    return { user: null, token: null };
  }
};

const { user, token } = loadUserFromStorage();

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;