import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
    token: string | null;
    user: User | null;
    isAuth: boolean;

    // Acciones
    setAuth: (token: string, user: User) => void;
    logout: () => void;
    // Hidratación (para saber si ya leyó del localStorage al iniciar)
    hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuth: false,
            hasHydrated: false,

            setAuth: (token, user) => set({ token, user, isAuth: true }),
            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({ token: null, user: null, isAuth: false });
            },
            setHasHydrated: (state) => set({ hasHydrated: state })
        }),
        {
            name: 'auth-storage', // Clave en localStorage
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);