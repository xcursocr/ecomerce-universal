import api from '../api/axios';
// Importamos todo desde el "barril" (index.ts)
import {
    ApiResponse,
    AuthResponse,
    LoginForm,
    RegisterUserPayload,
    User
} from '../types';

export const authService = {
    /**
     * Inicia sesión en el sistema.
     * @param credentials - Objeto tipado con email y password (LoginForm)
     */
    async login(credentials: LoginForm) {
        // En vez de definir { email: string... } manualmente, usamos la interfaz
        const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        return data;
    },

    /**
     * Registra un nuevo usuario.
     * @param userData - Objeto tipado con los datos de registro (RegisterUserPayload)
     */
    async register(userData: RegisterUserPayload) {
        // Usamos el DTO correcto para registro
        const { data } = await api.post<ApiResponse<{ id: number }>>('/auth/register', userData);
        return data;
    },

    /**
     * Obtiene el perfil del usuario actual usando el token.
     */
    async getProfile() {
        const { data } = await api.get<ApiResponse<User>>('/auth/profile');
        return data;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
    }
};