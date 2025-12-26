import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean; // Para abrir/cerrar el mini-carrito lateral (opcional)

    // Acciones
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
    toggleCart: () => void;

    // Computed
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product) => {
                const { items } = get();
                const exists = items.find((i) => i.id === product.id);

                if (exists) {
                    // Si ya existe, aumentamos cantidad
                    set({
                        items: items.map((i) =>
                            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                } else {
                    // Si no existe, lo agregamos con quantity 1
                    set({ items: [...items, { ...product, quantity: 1 }] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set({ isOpen: !get().isOpen }),

            getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

            getTotalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        {
            name: 'shopping-cart', // Persistir en localStorage
        }
    )
);