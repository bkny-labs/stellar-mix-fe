import { getClientCredentialsToken } from "../services/auth-service";
import { Playlist } from "../types/spotify.types";

const fetchFeaturedPlaylists = async (): Promise<Playlist[]> => {
  try {
    const token = await getClientCredentialsToken();

    const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching featured playlists:', errorData);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.playlists.items;
  } catch (error) {
    console.error('Error fetching featured playlists:', error);
    return [];
  }
};

export default fetchFeaturedPlaylists;
