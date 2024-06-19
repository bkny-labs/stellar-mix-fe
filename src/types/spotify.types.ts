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