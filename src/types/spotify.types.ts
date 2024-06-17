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