import { AppState, initialState, UserSettings, FiltersState } from './state';
import { AppAction } from './actions';

export const userSettingsReducer = (state: UserSettings = initialState.userSettings, action: AppAction): UserSettings => {
  switch (action.type) {
    case 'SET_USER_GENRES':
      return 'payload' in action ? { ...state, genres: action.payload } : state;
    default:
      return state;
  }
};

export const filtersReducer = (state: FiltersState = initialState.filters, action: AppAction): FiltersState => {
  switch (action.type) {
    case 'SET_ACTIVITY':
      return 'payload' in action ? { ...state, activity: action.payload } : state;
    case 'SET_LANGUAGE':
      return 'payload' in action ? { ...state, language: action.payload } : state;
    case 'SET_SORT':
      return 'payload' in action ? { ...state, sort: action.payload } : state;
    case 'SET_LIMIT':
      return 'payload' in action ? { ...state, limit: action.payload } : state;
    default:
      return state;
  }
};

export const spotifyPlaylistsReducer = (state: any = initialState.spotifyPlaylists, action: AppAction): any => {
  switch (action.type) {
    case 'SET_SPOTIFY_PLAYLISTS':
      return 'payload' in action ? action.payload : state;
    default:
      return state;
  }
};

export const weatherReducer = (state: any = initialState.weather, action: AppAction): any => {
  switch (action.type) {
    case 'SET_WEATHER':
      return 'payload' in action ? action.payload : state;
    default:
      return state;
  }
};

export const sunCalcReducer = (state: any = initialState.sunCalcData, action: AppAction): any => {
  switch (action.type) {
    case 'SET_SUNCALC':
      return 'payload' in action ? action.payload : state;
    default:
      return state;
  }
};

export const spotifyTokenReducer = (state: any = initialState.spotifyToken, action: AppAction): string | null => {
  switch (action.type) {
    case 'SET_SPOTIFY_TOKEN':
      return 'payload' in action ? action.payload : state;
    default:
      return state;
  }
};

export const isLoggedInReducer = (state: boolean = initialState.isLoggedIn, action: AppAction): boolean => {
  switch (action.type) {
    case 'SET_LOGGED_IN':
      return 'isLoggedIn' in action ? action.isLoggedIn : state;
    default:
      return state;
  }
};

export const appReducer = (state: AppState = initialState, action: AppAction): AppState => {
  return {
    weather: weatherReducer(state.weather, action),
    sunCalcData: sunCalcReducer(state.sunCalcData, action),
    spotifyPlaylists: spotifyPlaylistsReducer(state.spotifyPlaylists, action),
    isLoggedIn: isLoggedInReducer(state.isLoggedIn, action),
    spotifyToken: spotifyTokenReducer(state.spotifyToken, action),
    userSettings: userSettingsReducer(state.userSettings, action),
    filters: filtersReducer(state.filters, action),
  };
};
