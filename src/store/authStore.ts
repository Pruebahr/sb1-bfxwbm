import { create } from 'zustand';
import { User, Profile } from '../types/auth';
import { persist } from 'zustand/middleware';

interface AuthStore {
  currentUser: User | null;
  profiles: Profile[];
  selectedProfileId: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createProfile: (username: string, password: string) => boolean;
  deleteProfile: (id: string) => void;
  selectProfile: (id: string | null) => void;
}

const FINANZAS1_ID = 'finanzas1-default';

const predefinedUsers: User[] = [
  { username: 'Usuario 1', password: 'User2018', isAdmin: false },
  { username: 'Usuario 2', password: 'User2019', isAdmin: false },
  { username: 'Usuario 3', password: 'User2020', isAdmin: false },
  { username: 'Usuario 4', password: 'User2021', isAdmin: false },
];

const initialProfiles: Profile[] = [{
  id: FINANZAS1_ID,
  username: 'Finanzas1',
  password: 'Money2024',
  createdBy: 'system',
  createdAt: new Date('2024-01-01')
}];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      profiles: initialProfiles,
      selectedProfileId: null,
      isAuthenticated: false,

      login: (username: string, password: string) => {
        const user = predefinedUsers.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }

        const profile = get().profiles.find(
          (p) => p.username === username && p.password === password
        );

        if (profile) {
          set({ currentUser: { username, password, isAdmin: false }, isAuthenticated: true });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, selectedProfileId: null });
      },

      createProfile: (username: string, password: string) => {
        const { currentUser, profiles } = get();
        
        if (!currentUser?.isAdmin) return false;
        if (profiles.length >= 5) return false;
        
        const userExists = profiles.some(p => p.username.toLowerCase() === username.toLowerCase());
        if (userExists) {
          alert('Este nombre de usuario ya existe');
          return false;
        }
        
        const newProfile: Profile = {
          id: crypto.randomUUID(),
          username,
          password,
          createdBy: currentUser.username,
          createdAt: new Date(),
        };

        set((state) => ({
          profiles: [...state.profiles, newProfile],
        }));

        return true;
      },

      deleteProfile: (id: string) => {
        if (id === FINANZAS1_ID) {
          alert('No se puede eliminar el usuario predefinido Finanzas1');
          return;
        }

        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          selectedProfileId: state.selectedProfileId === id ? null : state.selectedProfileId,
        }));
      },

      selectProfile: (id: string | null) => {
        set({ selectedProfileId: id });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        profiles: state.profiles,
      }),
    }
  )
);