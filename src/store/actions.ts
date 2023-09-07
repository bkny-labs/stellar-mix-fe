export const SET_WEATHER = 'SET_WEATHER';
export const SET_SUNCALC = 'SET_SUNCALC';
export const SET_SPOTIFY_PLAYLISTS = 'SET_SPOTIFY_PLAYLISTS';
export const SET_USER_GENRES = 'SET_USER_GENRES';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_SPOTIFY_TOKEN = 'SET_SPOTIFY_TOKEN';
export const SET_ACTIVITY = 'SET_ACTIVITY';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_SORT = 'SET_SORT';
export const SET_LIMIT = 'SET_LIMIT';

interface SetWeatherAction {
  type: typeof SET_WEATHER;
  payload: any;
}

interface SetSunCalcAction {
  type: typeof SET_SUNCALC;
  payload: any;
}

interface SetSpotifyPlaylistsAction {
  type: typeof SET_SPOTIFY_PLAYLISTS;
  payload: any[];
}

interface SetUserGenresAction {
  type: typeof SET_USER_GENRES;
  payload: any[];
}

interface SetLoggedInAction {
  type: typeof SET_LOGGED_IN;
  isLoggedIn: boolean;
  token?: string | null;
}

interface SetSpotifyTokenAction {
  type: typeof SET_SPOTIFY_TOKEN;
  payload: string;
}

interface SetActivityAction {
  type: typeof SET_ACTIVITY;
  payload: string;
}

interface SetLanguageAction {
  type: typeof SET_LANGUAGE;
  payload: string;
}

interface SetSortAction {
  type: typeof SET_SORT;
  payload: string;
}

interface SetLimitAction {
  type: typeof SET_LIMIT;
  payload: number;
}

export const setWeatherAction = (data: any): SetWeatherAction => ({
  type: SET_WEATHER,
  payload: data,
});

export const setSunCalcAction = (data: any): SetSunCalcAction => ({
  type: SET_SUNCALC,
  payload: data,
});

export const setSpotifyPlaylistsAction = (playlists: any[]): SetSpotifyPlaylistsAction => ({
  type: SET_SPOTIFY_PLAYLISTS,
  payload: playlists,
});

export const setUserGenresAction = (genres: any[]): SetUserGenresAction => ({
  type: SET_USER_GENRES,
  payload: genres,
});

export const setLoggedInAction = (isLoggedIn: boolean, token?: string | null): SetLoggedInAction => {
  const action: SetLoggedInAction = {
    type: SET_LOGGED_IN,
    isLoggedIn
  };

  if (token !== undefined) { // If token is explicitly provided (including null value)
    action.token = token;
  }

  return action;
};

export const setSpotifyTokenAction = (token: string): SetSpotifyTokenAction => ({
  type: SET_SPOTIFY_TOKEN,
  payload: token,
});

export const setActivityAction = (activity: string): SetActivityAction => ({
  type: SET_ACTIVITY,
  payload: activity,
});

export const setLanguageAction = (language: string): SetLanguageAction => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setSortAction = (sort: string): SetSortAction => ({
  type: SET_SORT,
  payload: sort,
});

export const setLimitAction = (limit: number): SetLimitAction => ({
  type: SET_LIMIT,
  payload: limit,
});

// Combine action types
export type AppAction = 
  | SetWeatherAction
  | SetSunCalcAction
  | SetSpotifyPlaylistsAction
  | SetUserGenresAction
  | SetLoggedInAction
  | SetSpotifyTokenAction
  | SetActivityAction
  | SetLanguageAction
  | SetSortAction
  | SetLimitAction;
