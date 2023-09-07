import { AppState } from './state';

export const selectWeather = (state: AppState) => state.weather;
export const selectSunCalcData = (state: AppState) => state.sunCalcData;
export const selectSpotifyPlaylists = (state: AppState) => state.spotifyPlaylists;
export const selectSpotifyAccessToken = (state: AppState) => state.spotifyToken;