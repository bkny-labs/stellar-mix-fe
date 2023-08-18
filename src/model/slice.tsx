import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  weather: Record<string, any>;
  sunCalcData: Record<string, any>;
  isLoggedIn: Record<string, any>;
  spotifyPlaylists: Record<string, any>;
}

const initialState: AppState = {
  weather: {},
  sunCalcData: {},
  isLoggedIn: {},
  spotifyPlaylists: {},
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    setSunCalcData: (state, action) => {
      state.sunCalcData = action.payload;
    },
    setspotifyPlaylists: (state, action) => {
      state.spotifyPlaylists = action.payload;
    },
  },
});

export const { setWeather, setSunCalcData, setspotifyPlaylists } = appSlice.actions;

export default appSlice.reducer;
