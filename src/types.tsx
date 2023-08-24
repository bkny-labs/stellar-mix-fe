export type UserProfile = {
    display_name: string;
    email?: string;
    country?: string;
    external_urls?: {spotify?: string};
    product?: string;
    followers?: { total?: number };
    images: { url: string }[];
  };