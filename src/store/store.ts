import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { weatherReducer, sunCalcReducer, spotifyPlaylistsReducer, spotifyTokenReducer, isLoggedInReducer, userSettingsReducer, filtersReducer, moodDataReducer } from './reducers';

const rootReducer = combineReducers({
  weather: weatherReducer,
  sunCalcData: sunCalcReducer,
  spotifyPlaylists: spotifyPlaylistsReducer,
  spotifyToken: spotifyTokenReducer,
  isLoggedIn: isLoggedInReducer,
  userSettings: userSettingsReducer,
  filters: filtersReducer,
  moodData: moodDataReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
