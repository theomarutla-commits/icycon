export type Profile = {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
  plan?: string;
  region?: string;
  brand_tone?: string;
};
