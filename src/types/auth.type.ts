import { User } from "./user.type";

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  refreshToken: string | null;
  accessToken: string | null;
  logOut: () => Promise<void>;
  setUser: (user: User) => void;
};
