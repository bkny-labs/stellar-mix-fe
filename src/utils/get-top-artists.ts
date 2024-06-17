import { getClientCredentialsToken } from "../services/auth-service";


interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  href: string;
}

const fetchNewReleases = async (): Promise<Album[]> => {
  try {
    const token = await getClientCredentialsToken();

    const response = await fetch('https://api.spotify.com/v1/browse/new-releases', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching new releases:', errorData);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.albums.items;
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
};

export default fetchNewReleases;
