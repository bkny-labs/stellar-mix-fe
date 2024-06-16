import { AppState } from './state';

export const selectWeather = (state: AppState) => state.weather;
export const selectSunCalcData = (state: AppState) => state.sunCalcData;
export const selectSpotifyPlaylists = (state: AppState) => state.spotifyPlaylists;
export const selectSpotifyAccessToken = (state: AppState) => state.spotifyToken;
export const selectUserGenres = (state: AppState) => state.userSettings.genres;
export const selectActivityFilter = (state: AppState) => state.filters.activity;
export const selectLanguageFilter = (state: AppState) => state.filters.language;
export const selectSortFilter = (state: AppState) => state.filters.sort;
export const selectLimitFilter = (state: AppState) => state.filters.limit;
export const selectMoodData = (state: AppState) => state.moodData;
