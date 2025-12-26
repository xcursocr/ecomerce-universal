'use client';

import { authService } from '@/core/services/auth.service';
import { LayoutDashboard, LogOut, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Productos', href: '/dashboard/products', icon: Package },
    { name: 'Órdenes', href: '/dashboard/orders', icon: ShoppingBag },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-blue-600">AdminPanel</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={() => authService.logout()}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg"
                >
                    <LogOut size={20} />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}