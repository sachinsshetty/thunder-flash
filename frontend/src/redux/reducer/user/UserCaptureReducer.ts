// Updated Redux slice for userCaptures
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const getApiBaseUrl = (): string => {
  let baseUrl = import.meta.env.VITE_DWANI_API_BASE_URL || 'http://localhost:8000';
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    baseUrl = baseUrl.replace(/^http:/, 'https:');
    if (baseUrl.includes('localhost')) {
      baseUrl = 'https://localhost:8000';
    }
  }
  return baseUrl;
};

const API_URL = getApiBaseUrl();

const camelizeKeys = (obj: any): any => {
  const camelize = (str: string): string => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  
  if (Array.isArray(obj)) {
    return obj.map(camelizeKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: Record<string, any>, key: string) => {
      result[camelize(key)] = camelizeKeys(obj[key]);
      return result;
    }, {} as Record<string, any>);
  }
  return obj;
};

export const fetchUserCaptures = createAsyncThunk<
  Array<{
    id: number;
    userId: string;
    queryText: string;
    image: string;
    latitude: number;
    longitude: number;
    aiResponse: string;
    createdAt: string;
  }>,
  void,
  { rejectValue: string }
>(
  'sanjeeviniApp/fetchUserCaptures',
  async (_, thunkAPI) => {
    try {
      const url = `${API_URL}/v1/user-captures`;
      console.log('Redux fetching from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Redux HTTP ${response.status}: ${response.statusText} - Body: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const camelCasedData = camelizeKeys(data);
      console.log('Redux fetched user captures:', camelCasedData);
      return camelCasedData;
    } catch (error) {
      console.error('Redux error fetching user captures:', error);
      return thunkAPI.rejectWithValue('Failed to fetch user captures.');
    }
  }
);

interface UserCapture {
  id: number;
  userId: string;
  queryText: string;
  image: string;
  latitude: number;
  longitude: number;
  aiResponse: string;
  createdAt: string;
}

interface UserCaptureState {
  userData: UserCapture[];
  loading: boolean;
  error: string | null;
}

const initialState: UserCaptureState = {
  userData: [],
  loading: false,
  error: null,
};

export const userCaptureSlice = createSlice({
  name: 'userCaptures',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCaptures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCaptures.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserCaptures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default userCaptureSlice.reducer;