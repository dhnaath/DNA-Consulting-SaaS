import React, { createContext, useContext } from "react";
interface User {
  id: string;
  name: string;
}
interface AuthContextType {
  user: User | null;
}
const AuthContext = createContext<AuthContextType>({ user: null });
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user: { id: "1", name: "Test" } }}>
      {children}
    </AuthContext.Provider>
  );
};
