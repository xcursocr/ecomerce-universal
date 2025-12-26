'use client';

import { useAuthStore } from '@/core/store/auth.store';
import { useCartStore } from '@/core/store/cart.store';
import { LogOut, Search, ShoppingBag, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const { isAuth, user, logout } = useAuthStore();
    const items = useCartStore((state) => state.items);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?q=${searchTerm}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Store<span className="text-gray-900">Universal</span>
                </Link>

                {/* Search Bar (Hidden on mobile for simplicity, or usable) */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </form>

                {/* Icons */}
                <div className="flex items-center gap-4">

                    {/* Cart */}
                    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
                        <ShoppingBag size={24} className="text-gray-700" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* User Auth */}
                    {isAuth && user ? (
                        <div className="flex items-center gap-2 group relative">
                            <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                            <button className="p-1 bg-gray-100 rounded-full">
                                {/* Si tuvieras avatar, iría aquí. Usamos icono por defecto */}
                                <UserIcon size={20} className="text-gray-600" />
                            </button>

                            {/* Dropdown simple */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {user.role === 'admin' && (
                                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-50 text-sm">Dashboard</Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex items-center gap-2"
                                >
                                    <LogOut size={14} /> Salir
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                            Ingresar
                        </Link>
                    )}

                </div>
            </div>
        </header>
    );
}