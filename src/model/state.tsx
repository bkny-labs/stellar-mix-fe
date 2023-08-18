export interface AppState {
  weather: Record<string, any>;
  sunCalcData: Record<string, any>;
  spotifyPlaylists: Record<string, any>;
  isLoggedIn: boolean;
  spotifyToken?: string;
}

export const initialState: AppState = {
  weather: {},
  sunCalcData: {},
  spotifyPlaylists: {},
  isLoggedIn: false,
};
