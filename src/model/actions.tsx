export const setWeatherAction = (data: Record<string, any>) => ({
  type: 'SET_WEATHER',
  payload: data,
}) as const;

export const setSunCalcAction = (data: Record<string, any>) => ({
  type: 'SET_SUNCALC',
  payload: data,
}) as const;

export const setSpotifyPlaylistsAction = (playlists: any[]) => ({
  type: 'SET_SPOTIFY_PLAYLISTS',
  payload: playlists,
}) as const;

export const setUserGenresAction = (genres: any[]) => ({
  type: 'SET_USER_GENRES',
  payload: genres,
}) as const;

export const setLoggedInAction = (isLoggedIn: boolean, token?: string | null) => ({
  type: 'SET_LOGGED_IN',
  isLoggedIn,
  token,
});

export const setSpotifyToken = (token: string) => ({
  type: 'SET_SPOTIFY_TOKEN',
  payload: token,
});

export type AppAction = 
  | ReturnType<typeof setWeatherAction>
  | ReturnType<typeof setSunCalcAction>
  | ReturnType<typeof setSpotifyPlaylistsAction>
  | ReturnType<typeof setUserGenresAction>
  | ReturnType<typeof setSpotifyToken>
  | ReturnType<typeof setLoggedInAction>;
