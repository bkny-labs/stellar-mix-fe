const persistedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// state.ts
export interface AppState {
  weather: any; // replace 'any' with actual type if available
  sunCalcData: any;
  spotifyPlaylists: any;
  isLoggedIn: boolean;
  spotifyToken: string | null;
  userSettings: {
    genres: any;
  },
  filters: {
    activity: string;
    language: string;
    sort: string;
    limit: number;
  };
}

export const initialState: AppState = {
  weather: null,
  sunCalcData: null,
  spotifyPlaylists: [],
  isLoggedIn: persistedIsLoggedIn,
  spotifyToken: null,
  userSettings: {
    genres: []
  },
  filters: {
    activity: 'Creative Work',
    language: 'English',
    sort: 'Most Popular',
    limit: 20
  }
};
