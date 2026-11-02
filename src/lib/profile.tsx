import { createContext, useContext, useState, type ReactNode } from "react";

export interface Profile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  team?: string;
}

export type UserProfile = Profile;

interface ProfileContextType {
  profil: Profile;
  profile: Profile;
  setProfil: (p: Profile) => void;
  setProfile: (p: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  gantiProfil?: (id: string) => void;
  clientId: string;
  setClientId?: (id: string) => void;
  siap?: boolean;
}

const defaultProfile: Profile = {
  id: "consultant",
  name: "Dhia Najmi",
  role: "Konsultan · Tim Praktik",
  team: "Tim Praktik",
  email: "dhnaath@gmail.com",
};

const ProfileContext = createContext<ProfileContextType>({
  profil: defaultProfile,
  profile: defaultProfile,
  setProfil: () => {},
  setProfile: () => {},
  updateProfile: () => {},
  clientId: "11111111-1111-1111-1111-111111111111",
  siap: true,
});

export function PenyediaProfil({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<Profile>(defaultProfile);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfil((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profil,
        profile: profil,
        setProfil,
        setProfile: setProfil,
        updateProfile,
        clientId: "11111111-1111-1111-1111-111111111111",
        siap: true,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfil() {
  return useContext(ProfileContext);
}
