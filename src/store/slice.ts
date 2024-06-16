import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './state';

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setWeather: (state, action: PayloadAction<typeof initialState.weather>) => {
      state.weather = action.payload;
    },
    setSunCalcData: (state, action: PayloadAction<typeof initialState.sunCalcData>) => {
      state.sunCalcData = action.payload;
    },
    setSpotifyAccessToken: (state, action: PayloadAction<typeof initialState.spotifyToken>) => {
      state.spotifyToken = action.payload;
    },
    setSpotifyPlaylists: (state, action: PayloadAction<typeof initialState.spotifyPlaylists>) => {
      state.spotifyPlaylists = action.payload;
    },
    setUserGenres: (state, action: PayloadAction<typeof initialState.userSettings.genres>) => {
      state.userSettings.genres = action.payload;
    },
    setActivityFilter: (state, action: PayloadAction<typeof initialState.filters.activity>) => {
      state.filters.activity = action.payload;
    },
    setLanguageFilter: (state, action: PayloadAction<typeof initialState.filters.language>) => {
      state.filters.language = action.payload;
    },
    setSortFilter: (state, action: PayloadAction<typeof initialState.filters.sort>) => {
      state.filters.sort = action.payload;
    },
    setLimitFilter: (state, action: PayloadAction<typeof initialState.filters.limit>) => {
      state.filters.limit = action.payload;
    },
    setMoodData: (state, action: PayloadAction<typeof initialState.moodData>) => {
      state.moodData = action.payload;
    },
  }});

export const {
  setWeather,
  setSunCalcData,
  setSpotifyPlaylists,
  setSpotifyAccessToken,
  setUserGenres,
  setActivityFilter,
  setLanguageFilter,
  setSortFilter,
  setLimitFilter,
  setMoodData,
} = appSlice.actions;

export default appSlice.reducer;
