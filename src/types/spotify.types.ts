export type Artist = {
    name: string;
};

export type Album = {
    images: { url: string }[];
};

export type Track = {
    name: string;
    album: Album;
    artists: Artist[];
};
