export type Artist = {
    name: string;
};

export type Album = {
    images: { url: string }[];
};

export interface Track {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
  }

  export interface Device {
    id: string;
    name: string;
  }
  
  export interface DeviceSelectProps {
    token: string;
    dispatch: any;
  }

  export interface Playlist {
    id: string;
    name: string;
    description: string;
    href: string;
    images: Image[];
    owner: {
      display_name: string;
      id: string;
    };
    tracks: {
      href: string;
      total: number;
    };
    external_urls: {
      spotify: string;
    };
  }
  
  interface Image {
    url: string;
    height: number | null;
    width: number | null;
  }
  