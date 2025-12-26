'use client';

import { useAuthStore } from '@/core/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuth, hasHydrated } = useAuthStore();

    useEffect(() => {
        // Solo intentamos redirigir si el store ya cargó (hydrated)
        // y confirmamos que NO está autenticado.
        if (hasHydrated && !isAuth) {
            router.push('/login');
        }
    }, [isAuth, hasHydrated, router]);

    // 1. Mostrar carga mientras Zustand lee el localStorage
    if (!hasHydrated) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 2. Si ya cargó y no tiene permiso, retornamos null para evitar parpadeos
    // (El useEffect de arriba se encargará de redirigir en milisegundos)
    if (!isAuth) {
        return null;
    }

    // 3. Si tiene permiso, renderizamos el contenido
    return <>{children}</>;
}