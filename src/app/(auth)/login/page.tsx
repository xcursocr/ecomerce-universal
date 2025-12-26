'use client';

import { authService } from '@/core/services/auth.service';
import { useAuthStore } from '@/core/store/auth.store';
import { LoginForm } from '@/core/types';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginForm>();

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        console.log("🚀 Enviando formulario...", data);

        try {
            const response = await authService.login(data);
            // console.log("✅ Respuesta recibida:", response);

            if (!response || !response.data) {
                throw new Error("La respuesta del servidor está vacía");
            }

            // Guardar sesión
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            setAuth(response.data.accessToken, response.data.userData);

            toast.success(`Bienvenido, ${response.data.userData.name}`);

            // Redirigir
            if (response.data.userData.role === 'admin') {
                router.push('/dashboard');
            } else {
                router.push('/');
            }

        } catch (error) {
            console.error("❌ Error en Login:", error);

            // Manejo de errores ROBUSTO
            let message = "Ocurrió un error desconocido";

            if (error instanceof AxiosError) {
                // Error que viene del Backend (400, 401, 500)
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                // Error genérico de JS (ej: throw new Error)
                message = error.message;
            }

            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Iniciar Sesión</h1>

                <form
                    // 🛡️ CORRECCIÓN CLAVE:
                    // Forzamos el preventDefault manual para asegurar que NO recargue
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(onSubmit)(e);
                    }}
                    className="space-y-4"
                    noValidate
                >
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            {...register('email', { required: 'El correo es obligatorio' })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            placeholder="admin@test.com"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            {...register('password', { required: 'La contraseña es obligatoria' })}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            placeholder="******"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium cursor-pointer"
                    >
                        {isSubmitting ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}