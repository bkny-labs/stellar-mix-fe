// state.ts
export interface AppState {
  weather: any; // replace 'any' with actual type if available
  sunCalcData: any;
  spotifyPlaylists: any;
  isLoggedIn: boolean;
  spotifyToken: string | null;
  userSettings: {
    genres: any;
  };
}

export const initialState: AppState = {
  weather: null,
  sunCalcData: null,
  spotifyPlaylists: [],
  isLoggedIn: false,
  spotifyToken: null,
  userSettings: {
    genres: []
  }
};
