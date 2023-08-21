// state.ts
export interface AppState {
  weather: any;
  sunCalcData: any;
  spotifyPlaylists: any[];
  isLoggedIn: boolean;
  spotifyToken: string | null | undefined;
  userSettings: {
    genres: string[];
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
