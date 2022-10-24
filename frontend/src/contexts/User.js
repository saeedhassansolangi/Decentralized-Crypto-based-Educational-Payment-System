import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  auth: false,
  token: null,
  setUser: () => {},
  setToken: () => {},
});
