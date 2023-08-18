import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';

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
    setSpotifyAccessToken: (state, action) => {
      state.spotifyToken = action.payload;
    },
    setSpotifyPlaylists: (state, action) => {
      state.spotifyPlaylists = action.payload;
    },
  },
});

export const { setWeather, setSunCalcData, setSpotifyPlaylists } = appSlice.actions;

export default appSlice.reducer;
