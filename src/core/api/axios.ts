import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Interceptor de Solicitud: Inyectar Token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Interceptor de Respuesta: Manejo de Refresh Token (401)
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 🛑 VALIDACIÓN CLAVE: Si el error viene del LOGIN, no hacemos nada, solo devolvemos el error.
        // Esto evita el bucle de recarga cuando la contraseña está mal.
        if (originalRequest.url?.includes('/auth/login')) {
            return Promise.reject(error);
        }

        // Si error es 401 y no es un reintento
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                // Si no hay refresh token, no podemos renovar.
                // Pero NO redirigimos si ya estamos en /login para evitar bucles.
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Llamada a tu endpoint de backend para renovar
                const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
                    token: refreshToken,
                });

                const newAccessToken = data.data.token;

                // Guardar nuevo token
                localStorage.setItem('accessToken', newAccessToken);

                // Actualizar header y reintentar la petición original
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);

            } catch (refreshError) {
                // Si falla la renovación, limpiamos
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // 🛑 VALIDACIÓN CLAVE 2: Solo redirigir si NO estamos ya en el login
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;