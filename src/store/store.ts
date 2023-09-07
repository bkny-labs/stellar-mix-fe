import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { weatherReducer, sunCalcReducer, spotifyPlaylistsReducer, spotifyTokenReducer, isLoggedInReducer, userSettingsReducer, filtersReducer } from './reducers';

const rootReducer = combineReducers({
  weather: weatherReducer,
  sunCalcData: sunCalcReducer,
  spotifyPlaylists: spotifyPlaylistsReducer,
  spotifyToken: spotifyTokenReducer,
  isLoggedIn: isLoggedInReducer,
  userSettings: userSettingsReducer,
  filters: filtersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
