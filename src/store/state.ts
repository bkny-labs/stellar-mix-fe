const persistedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

export interface UserSettings {
  genres: any;
}

export interface FiltersState {
  activity: string;
  language: string;
  sort: string;
  limit: number;
}

export interface AppState {
  weather: any;
  sunCalcData: any;
  spotifyPlaylists: any;
  isLoggedIn: boolean;
  spotifyToken: string | null;
  userSettings: UserSettings;
  filters: FiltersState;
}

export const initialState: AppState = {
  weather: null,
  sunCalcData: null,
  spotifyPlaylists: [],
  isLoggedIn: persistedIsLoggedIn || false,
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