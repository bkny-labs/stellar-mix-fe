import { AppState } from './state';

export const getWeather = (state: AppState) => state.weather;
export const getSunCalcData = (state: AppState) => state.sunCalcData;
export const getSpotifyPlaylists = (state: AppState) => state.spotifyPlaylists;
export const getSpotifyAccessToken = (state: AppState) => state.spotifyToken;