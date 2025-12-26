'use client';

import { useCartStore } from '@/core/store/cart.store';
import { Product } from '@/core/types';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Evita que navegue al detalle
        e.stopPropagation();
        addItem(product);
        toast.success('Agregado al carrito');
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Imagen con Link */}
            <Link href={`/product/${product.slug}`} className="relative aspect-square bg-gray-50 overflow-hidden">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                    </div>
                )}

                {/* Badge de Stock */}
                {product.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                        AGOTADO
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                {/* Categoría / Marca */}
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                    {product.brands?.name || 'Genérico'}
                </div>

                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Precio y Botón */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Agregar al carrito"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}